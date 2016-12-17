var Sasshimi = require('../'),
    Transform = require('readable-stream/transform'),
    fs = require('fs'),
    path = require('path');

describe('#Basic', function() {

    // it('should be a instance of Transform', function() {
    //     var _class = Sasshimi,
    //         instance = new Sasshimi(),
    //         create = Sasshimi.create();
    //
    //     expect(Sasshimi).to.be.defined;
    //     expect(instance).to.be.an.object;
    //     expect(instance).to.be.instanceOf(Transform);
    //     expect(create).to.be.instanceOf(Sasshimi);
    //     expect(create).to.be.not.equal(instance);
    // });

    it('should read file and flow stream', function(done) {
        fs.createReadStream(require.resolve('./assets/imports.scss'))
          .pipe(new Sasshimi({
              cwd: path.resolve(__dirname, 'assets')
              // objectMode: true
          }))
          .on('data', function(chunk){
              console.log(chunk.toString())
          })
          .on('end', function(){
              done();
          });
    });
});
