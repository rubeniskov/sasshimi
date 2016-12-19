var Sasshimi = require('../'),
    Transform = require('readable-stream/transform'),
    fs = require('fs'),
    path = require('path');

describe('#Basic', function() {

    it('should be a instance of Transform', function() {
        var _class = Sasshimi,
            instance = new Sasshimi(),
            create = Sasshimi.create();

        expect(Sasshimi).to.be.defined;
        expect(instance).to.be.an.object;
        expect(instance).to.be.instanceOf(Transform);
        expect(create).to.be.instanceOf(Sasshimi);
        expect(create).to.be.not.equal(instance);
    });

    it('should parse arguments correctly [input]', function() {
        var input = 'foo/bar.scss',
            parse = Sasshimi.parse([input]);
        expect(parse.input).to.be.defined;
        expect(parse.input).to.be.equal(input);
    });

    it('should parse arguments correctly [options]', function() {
        var options = {},
            parse = Sasshimi.parse([options]);
        expect(parse.options).to.be.defined;
        expect(parse.options).to.be.equal(options);
    });

    it('should parse arguments correctly [input, options]', function() {
        var input = 'foo/bar.scss',
            options = {},
            parse = Sasshimi.parse([input, options]);

        expect(parse.input).to.be.defined;
        expect(parse.input).to.be.equal(input);
        expect(parse.options).to.be.defined;
        expect(parse.options).to.be.equal(options);
    });

    it('should parse arguments correctly [done]', function() {
        var done = function() {},
            parse = Sasshimi.parse([done]);
        expect(parse.done).to.be.defined;
        expect(parse.done).to.be.equal(done);
    });

    it('should parse arguments correctly [input, done]', function() {
        var input = 'foo/bar.scss',
            done = function() {},
            parse = Sasshimi.parse([input, done]);

        expect(parse.input).to.be.defined;
        expect(parse.input).to.be.equal(input);
        expect(parse.done).to.be.defined;
        expect(parse.done).to.be.equal(done);
    });

    it('should parse arguments correctly [input, options, done]', function() {
        var input = 'foo/bar.scss',
            options = {},
            done = function() {},
            parse = Sasshimi.parse([input, options, done]);

        expect(parse.input).to.be.defined;
        expect(parse.input).to.be.equal(input);
        expect(parse.options).to.be.defined;
        expect(parse.options).to.be.equal(options);
        expect(parse.done).to.be.defined;
        expect(parse.done).to.be.equal(done);
    });

    it('should parse arguments correctly [input, output]', function() {
        var input = 'foo/bar.scss',
            output = 'foo/bar.css',
            parse = Sasshimi.parse([input, output]);

        expect(parse.input).to.be.defined;
        expect(parse.input).to.be.equal(input);
        expect(parse.output).to.be.defined;
        expect(parse.output).to.be.equal(output);
    });

    it('should parse arguments correctly [input, output, options]', function() {
        var input = 'foo/bar.scss',
            output = 'foo/bar.css',
            options = {},
            parse = Sasshimi.parse([input, output, options]);

        expect(parse.input).to.be.defined;
        expect(parse.input).to.be.equal(input);
        expect(parse.output).to.be.defined;
        expect(parse.output).to.be.equal(output);
        expect(parse.options).to.be.defined;
        expect(parse.options).to.be.equal(options);
    });

    it('should parse arguments correctly [input, output, done]', function() {
        var input = 'foo/bar.scss',
            output = 'foo/bar.css',
            done = function() {},
            parse = Sasshimi.parse([input, output, done]);

        expect(parse.input).to.be.defined;
        expect(parse.input).to.be.equal(input);
        expect(parse.output).to.be.defined;
        expect(parse.output).to.be.equal(output);
        expect(parse.done).to.be.defined;
        expect(parse.done).to.be.equal(done);
    });

    it('should parse arguments correctly [input, output, options, done]', function() {
        var input = 'foo/bar.scss',
            output = 'foo/bar.css',
            options = {},
            done = function() {},
            parse = Sasshimi.parse([input, output, options, done]);

        expect(parse.input).to.be.defined;
        expect(parse.input).to.be.equal(input);
        expect(parse.output).to.be.defined;
        expect(parse.output).to.be.equal(output);
        expect(parse.options).to.be.defined;
        expect(parse.options).to.be.equal(options);
        expect(parse.done).to.be.defined;
        expect(parse.done).to.be.equal(done);
    });

    // it('should read file and flow stream', function(done) {
    //     fs.createReadStream(require.resolve('./assets/imports.scss'))
    //       .pipe(new Sasshimi({
    //           cwd: path.resolve(__dirname, 'assets')
    //           // objectMode: true
    //       }))
    //       .on('data', function(chunk){
    //           console.log(chunk.toString())
    //       })
    //       .on('end', function(){
    //           done();
    //       });
    // });
});
