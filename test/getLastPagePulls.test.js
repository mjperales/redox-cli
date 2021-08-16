const assert = require('assert');
const expect = require('chai').expect;
// const chai = require('chai');
// const chaiAsPromised = require('chai-as-promised');
const getLastPagePulls = require('../bin/getLastPagePulls.js');

// chai.use(chaiAsPromised);

describe('getLastPagePulls tests', function () {
    it('returns a rejected promise if pageNum is not a number', async function () {
        assert.rejects(
            async () => await getLastPagePulls('string', 'ramda', 'ramda')
        );
    });

    it('returns page not found if wrong/bad repository name', async function () {
        const rsp = await getLastPagePulls(4, 'mayra', 'ramda');
        expect(rsp).equal('Not Found');
    });

    it('returns page not found if wrong/bad owner name', async function () {
        const rsp = await getLastPagePulls(4, 'ramda', 'mayra');
        expect(rsp).equal('Not Found');
    });

    it('should return a number', async function () {
        const total = await getLastPagePulls(2, 'ramda', 'ramda');
        expect(total).to.be.a('number');
    });
});
