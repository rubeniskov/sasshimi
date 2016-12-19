import Transform from 'readable-stream/transform';
import sass from 'node-sass';
import path from 'path';
import glob from 'glob';
import fs from 'fs';
import util from 'util';
import resolve from 'browser-resolve';
import sf from 'streamifier';
import extend from 'extend';
import Q from 'q'

export default class Sasshimi extends Transform {
    static defaults = {
        extensions: ['.scss', '.sass', '.css', '.less'],
        paths: [],
        cwd: process.cwd(),
        quiet: false,
        objectMode: false
    }
    static done() {

    }
    static create() {
        var schema = Sasshimi.parse(arguments),
            stream = [];
        if (schema.input) {
            typeof(schema.input) === 'string' && extend(schema.options, {
                cwd: path.dirname(schema.input)
            });
            stream.push(Sasshimi.createReadStream(schema.input, {
                extensions: Sasshimi.defaults.extensions
            }));
        }
        stream.push(new Sasshimi(schema.options));
        if (schema.output) {
            stream.push(Sasshimi.createWriteStream(schema.output));
        }
        return stream.reduce(function(a, b) {
                return a.pipe(b);
            })
            .on('done', schema.done || Sasshimi.done);
    }
    static isPath(str, extensions) {
        return typeof(str) === 'string' && (new RegExp('(' + extensions.join('|') + ')$').test(str));
    }
    static parseOptions(options) {
        var options = extend({}, Sasshimi.defaults, options);
        options.paths = typeof(options.paths) === 'string' ? [options.paths] : options.paths
        options.paths.push(options.cwd);
        return options;
    }
    static parse() {
        var schema = {},
            args = arguments.length === 1 && arguments[0] && arguments[0].length ? arguments[0] : arguments;
        for (var arg, i = args.length; i--;) {
            arg = args[i];
            if (!schema.done && typeof(arg) === 'function')
                schema.done = arg;
            else if (!schema.options && typeof(arg) === 'object' && arg.constructor == Object)
                schema.options = arg;
            else if (!schema.output && i === 1)
                schema.output = arg;
            else
                schema.input = arg;
        }
        return schema;
    }
    static createStream(std, type, options) {
        if (std && /readable|writable/.test(type)) {
            if (std.readable || std.writable)
                return std;
            else if (typeof(std) === 'string') {
                if (type === 'readable')
                    return std === 'stdin' ?
                        process.stdin :
                        (Sasshimi.isPath(std, options.extensions) ? fs : sf).createReadStream(new Buffer(std, 'utf-8'), options)
                if (type === 'writable')
                    return std === 'stdout' ?
                        process.stdout :
                        fs.createWriteStream(path.resolve(std), options)
            }
        }
        throw new Error(type + ' stream error');
    }
    static createReadStream(std, options) {
        return Sasshimi.createStream(std, 'readable', options);
    }
    static createWriteStream(std, options) {
        return Sasshimi.createStream(std, 'writable', options);
    }
    constructor() {
        var options = Sasshimi.parseOptions(arguments[0]),
            self = super({
                objectMode: options.objectMode
            });
        self.options = options;
        !self.options.quiet && self.on('error', function(err) {
            console.error(err);
        })
        self.data = '';
    }
    _transform(chunk, encoding, done) {
        this.data += chunk.toString();
        done();
    }
    _flush(done) {
        var self = this,
            regexp_extension = new RegExp(self.options.extensions.join('|').replace(/\./g, '\\.') + '$');
        sass.render({
            data: this.data,
            importer: function importer(url, prev, next) {
                var parts = url.split(path.sep),
                    filename = parts.pop().replace(regexp_extension, ''),
                    dirname = parts.join(path.sep),
                    pattern = util.format('%s/%s/?(_)%s+(%s)',
                        prev === 'stdin' ? self.options.cwd : path.dirname(prev), dirname || '', filename ||  '', self.options.extensions.join('|'))
                    .replace(new RegExp(path.sep + '+', 'g'), path.sep);
                Q.nfcall(glob, pattern, {
                        absolute: true
                    })
                    .then(function(files) {
                        return files.length ? files.pop() : Q.nfcall(resolve, url, {
                            paths: self.options.paths,
                            extensions: self.options.extensions,
                            browser: 'style'
                        }).then(function(path) {
                            return path[0];
                        });
                    })
                    .then(function(file) {
                        return Q.ninvoke(fs, 'readFile', file, 'utf8')
                            .then(function(contents) {
                                return {
                                    file: file,
                                    contents: contents
                                }
                            });
                    })
                    .then(function(data) {
                        next(data);
                    })
                    .catch(function(err) {
                        done(err);
                    });
            }
        }, function(err, result) {
            if (err)
                return done(err);
            self.emit('done', result);
            done(null, self.options.objectMode ? result : result.css);
        })
    }
}
