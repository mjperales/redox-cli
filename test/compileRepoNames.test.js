const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const response = require('./fixtures/github-data-repos.json');
const compileRepoNames = require('../bin/compileRepoNames');

describe('compileRepoNames() tests', function () {
    it('should return an array of 3', async function () {
        const total = compileRepoNames(response.all.success.res.data);
        expect(total.length).equal(3);
    });

    it('should throw an error if data is not an array', async function () {
        expect(() => compileRepoNames('not an array')).to.throw();
    });
});
