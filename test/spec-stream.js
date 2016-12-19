var Sasshimi = require('../'),
    fs = require('fs'),
    path = require('path');

describe('#Stream', function() {
    it('should read file and resolve node_modules', function(done) {
        var data = '';
        fs.createReadStream(require.resolve('./assets/imports.scss'))
          .pipe(new Sasshimi({
              cwd: path.resolve(__dirname, 'assets'),
              paths: path.resolve(__dirname, 'fixtures/node_modules')
          }))
          .on('data', function(chunk){
              data += chunk.toString();
          })
          .on('end', function(){
              expect(data).to.have.string('#module-test.base-scss');
              expect(data).to.have.string('module-test/styles/_base.scss');
              done();
          });
    });
});
