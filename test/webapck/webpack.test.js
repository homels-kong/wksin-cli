/**
 * tool test
 */
let { getResolveLoader } = require('../../src/config/webpack.base');
let { assert, expect } = require('chai');

describe('webpack.base.js', function() {
  describe('webpack.getResolveLoader()', function() {
    it('should return webpack.getResolveLoader is an object', async () => {
        let result = await getResolveLoader();
        expect(result).to.be.a('object');
    });
  });
});