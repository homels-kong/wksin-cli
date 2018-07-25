/**
 * tool test
 */
let util = require('../../src/common/util');
let { assert, expect } = require('chai');

describe('Util.js', function() {
  describe('Util.checkVersion()', function() {
    it('should return util.checkVersion is a promise', async () => {
        expect(util.checkVersion()).to.be.a('promise');
    });
  });
});

describe('Util.js', function() {
    describe('Util.hasCommand()', function() {
      it('should return result is not empty or null', async () => {
          let result = await util.hasCommand('git');
          expect(result).to.have.property('stdout');
      });
    });
});