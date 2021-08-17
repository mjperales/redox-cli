const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const response = require('./fixtures/github-data.json');

describe('fetchPRsWith100PerPage() tests', function () {
    it('returns page not found if wrong/bad repository name or orgName', async function () {
        const fetchPRsWith100PerPage = sinon.stub().withArgs('ramda', 'mayra');
        fetchPRsWith100PerPage.returns(
            JSON.parse(response.all.error.res.status)
        );

        expect(fetchPRsWith100PerPage('ramda', 'mayra')).equal(404);
    });
    it('returns object with successful response', async function () {
        const fetchPRsWith100PerPage = sinon
            .stub()
            .withArgs('ramda', 'ramda-fantasy');
        fetchPRsWith100PerPage.returns(response.all.success.res);
        expect(fetchPRsWith100PerPage('ramda', 'ramda-fantasy')).to.be.a(
            'object'
        );
    });
    it('returns an array with 3 items', async function () {
        const fetchPRsWith100PerPage = sinon
            .stub()
            .withArgs('ramda', 'ramda-fantasy');
        fetchPRsWith100PerPage.returns(response.all.success.res.data);
        response.all.success.res.data.length.should.equal(3);
    });
});
