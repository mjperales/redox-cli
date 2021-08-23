const sinon = require('sinon');
const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const response = require('./fixtures/github-data.json');

describe('getAPagePulls tests', function () {
    it('returns a rejected promise if pageNum is not a number', async function () {
        const getAPagePulls = sinon.stub().withArgs('string', 'ramda', 'ramda');
        getAPagePulls.rejects();
        assert.rejects(() => getAPagePulls('string', 'ramda', 'ramda'));
    });

    it('returns page not found if wrong/bad repository name', async function () {
        const getAPagePulls = sinon.stub().withArgs(4, 'mayra', 'ramda');
        getAPagePulls.returns(response.all.error.res);
        expect(getAPagePulls(4, 'mayra', 'ramda').message).equal('Not Found');
    });

    it('should return a number', async function () {
        const getAPagePulls = sinon.stub().withArgs(2, 'ramda', 'ramda');
        getAPagePulls.returns(response.all.success.res.data);
        expect(getAPagePulls(2, 'ramda', 'ramda').length).equal(3);
    });
});
