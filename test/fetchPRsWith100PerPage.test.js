const expect = require('chai').expect;
const fetchPRsWith100PerPage = require('../bin/fetchPRsWith100PerPage');

describe('fetchPRsWith100PerPage() tests', function () {
    it('returns page not found if wrong/bad repository name', async function () {
        const rsp = await fetchPRsWith100PerPage('ramda', 'mayra');
        expect(rsp).equal('Not Found');
    });
    it('returns page not found if wrong/bad organization name', async function () {
        const rsp = await fetchPRsWith100PerPage('mayra', 'ramda');
        expect(rsp).equal('Not Found');
    });
});
