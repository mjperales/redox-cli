const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const response = require('./fixtures/github-data.json');

describe('fetchRepos1() tests', function () {
    it('returns page not found if wrong/bad organization name', async function () {
        const fetchRepos1 = sinon.stub().withArgs('mayra');
        fetchRepos1.returns(response.all.error.res.status);
        expect(fetchRepos1('mayra')).equal(404);
    });
    it('returns data on success', async function () {
        const fetchRepos = sinon.stub().withArgs('ramda');
        fetchRepos.returns(response.all.success.res);
        expect(fetchRepos('ramda').status).equal(200);
    });
});
