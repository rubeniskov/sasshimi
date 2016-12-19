global.sinon = require("sinon");
global.expect = require("chai").use(require("sinon-chai")).expect;

describe('Sasshimi', function() {
    require('./spec-basic');
    require('./spec-stream');
});
