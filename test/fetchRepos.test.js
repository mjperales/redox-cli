const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const response = require('./fixtures/github-data.json');
const axios = require('axios');
const fetchRepos = require('../bin/fetchRepos');

describe('fetchRepos() tests', function () {
    let stubAxios;
    beforeEach(() => {
        stubAxios = sinon.stub(axios, 'get');
    });

    afterEach(() => {
        stubAxios.restore();
    });

    it('returns page not found if wrong/bad organization name', async function () {
        stubAxios.returns(Promise.reject(response.all.error.res));
        const res = await fetchRepos('wrong-name');

        expect(res).equal('Not Found');
        sinon.assert.calledOnce(stubAxios);
    });

    it('returns error', async function () {
        stubAxios.returns(Promise.reject('Things will explode 💥'));
        const res = await fetchRepos('wrong-name');

        expect(res).equal('Things will explode 💥');
        sinon.assert.calledOnce(stubAxios);
    });

    it('returns data on success', async function () {
        stubAxios.returns(Promise.resolve(response.all.success.res));
        const data = await fetchRepos('success');

        expect(data.length).equal(3);
        sinon.assert.calledOnce(stubAxios);
    });
});
