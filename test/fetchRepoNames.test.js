const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const response = require('./fixtures/github-data-repos.json');

describe('fetchRepoNames() tests', function () {
    it('should return an array of 3', async function () {
        const fetchRepoNames = sinon.stub().withArgs('ramda');
        fetchRepoNames.returns(response.all.success.res.data);
        expect(fetchRepoNames('mayra').length).equal(3);
    });

    it('returns 404 status error with bad org name', async function () {
        const fetchRepoNames = sinon.stub().withArgs('mayra');
        fetchRepoNames.returns(response.all.error.res);
        expect(fetchRepoNames('mayra').status).equal(404);
    });
});
