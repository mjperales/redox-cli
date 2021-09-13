const sinon = require('sinon');
const chai = require('chai');
const axios = require('axios');
const expect = chai.expect;
const response = require('./fixtures/github-data.json');
const onePage = require('./fixtures/github-data-onepage.json');
const { fetchPrsCall } = require('../bin/fetchPRsCall');
const extractTotalPages = require('../bin/extractTotalPages');

describe('fetchPRsCall() tests', function () {
    let stubAxios;
    beforeEach(() => {
        stubAxios = sinon.stub(axios, 'get');
    });

    afterEach(() => {
        stubAxios.restore();
    });

    it('returns page not found if wrong/bad repository name', async function () {
        stubAxios.returns(Promise.reject(response.all.error.res));
        const rsp = await fetchPrsCall('wrong-name', 'ramda');

        expect(rsp).equal('Not Found');
        sinon.assert.calledOnce(stubAxios);
    });

    it('returns error', async function () {
        stubAxios.returns(Promise.reject('Things will explode 💥'));
        const rsp = await fetchPrsCall('wrong-name', 'ramda');

        expect(rsp).equal('Things will explode 💥');
        sinon.assert.calledOnce(stubAxios);
    });

    it('returns null if link is undefined', async function () {
        stubAxios.returns(Promise.resolve(onePage.all.success.res));
        const rsp = await fetchPrsCall('one-page', 'ramda');

        expect(rsp.link).equal(undefined);
        sinon.assert.calledOnce(stubAxios);
    });

    describe('Successful fetch calls', async function () {
        it('should return a string with last page relation', async function () {
            stubAxios.returns(Promise.resolve(response.all.success.res));
            const rsp = await fetchPrsCall('ramda', 'ramda');
            expect(rsp.headers.link).to.be.a('string');
            sinon.assert.calledOnce(stubAxios);
        });
        it('link should have a page= match to use to find the last page number', async function () {
            stubAxios.returns(Promise.resolve(response.all.success.res));
            const rsp = await fetchPrsCall('ramda', 'ramda');
            const lastPage = extractTotalPages(rsp.headers.link);
            expect(lastPage).to.be.a('number');
            sinon.assert.calledOnce(stubAxios);
        });
    });
});
