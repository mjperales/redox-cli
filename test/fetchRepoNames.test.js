const assert = require('assert');
const expect = require('chai').expect;
const fetchRepoNames = require('../bin/fetchRepoNames');

describe('fetchRepoNames() tests', async () => {
    it('should return an array', async () => {
        const names = await fetchRepoNames('ramda');
        expect(names).to.be.a('array');
    });

    it('returns page not found with bad org name', async () => {
        const rsp = await fetchRepoNames('mayra');
        expect(rsp).equal('Not Found');
    });
});
