import Transform from 'readable-stream/transform';
import sass from 'node-sass';
import path from 'path';
import glob from 'glob';
import fs from 'fs';
import util from 'util';
import resolve from 'browser-resolve';
import Q from 'q'

export default class Sasshimi extends Transform {
    static create(options) {
        return new Sasshimi(options);
    }
    constructor(options) {
        var self = super({
            objectMode: options.objectMode
        });

        self.options = options || {};
        self.options.cwd = self.options.cwd ||  process.cwd();
        self.options.includePaths = [__dirname + '/../test/fixtures/node_modules']
        self.data = '';
    }
    _transform(chunk, encoding, done) {
        this.data += chunk.toString();
        done();
    }
    _flush(done) {
        var self = this;
        sass.render({
            data: this.data,
            importer: function importer(url, prev, next) {
                Q.nfcall(glob, util.format('{%s}/?%s.{scss,sass,css}', [
                        (prev = prev === 'stdin' ? self.options.cwd : prev),
                        process.cwd()
                    ].join(','), url), {
                        absolute: true
                    })
                    .then(function(files) {
                        return files.length ? files.pop() : Q.nfcall(resolve, url, {
                            paths: self.options.includePaths,
                            extensions: ['.scss', '.sass', '.css'],
                            browser: 'style'
                        }).then(function(path){
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
                        next(data)
                    })
                    .catch(function(err){
                        done(err);
                    });
            }
        }, function(err, result) {
            if (err)
                return done(err);
            done(null, self.options.objectMode ? result : result.css);
        })
    }
}
