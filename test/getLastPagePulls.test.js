const sinon = require('sinon');
const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const response = require('./fixtures/github-data.json');

describe('getLastPagePulls tests', function () {
    it('returns a rejected promise if pageNum is not a number', async function () {
        const getLastPagePulls = sinon
            .stub()
            .withArgs('string', 'ramda', 'ramda');
        getLastPagePulls.rejects();
        assert.rejects(() => getLastPagePulls('string', 'ramda', 'ramda'));
    });

    it('returns page not found if wrong/bad repository name', async function () {
        const getLastPagePulls = sinon.stub().withArgs(4, 'mayra', 'ramda');
        getLastPagePulls.returns(response.all.error.res);
        expect(getLastPagePulls(4, 'mayra', 'ramda').message).equal(
            'Not Found'
        );
    });

    it('should return a number', async function () {
        const getLastPagePulls = sinon.stub().withArgs(2, 'ramda', 'ramda');
        getLastPagePulls.returns(response.all.success.res.data);
        expect(getLastPagePulls(2, 'ramda', 'ramda').length).equal(3);
    });
});
