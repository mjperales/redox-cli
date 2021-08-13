const assert = require('assert');
const expect = require('chai').expect;
const findTotal = require('../bin/findTotal');

describe('findTotal() tests', function () {
    const arrayOfObjects = [
        { repo: 'mayra', pulls: 1 },
        { repo: 'clarice', pulls: 40 },
    ];

    it('Should return 41', function () {
        assert.equal(findTotal(arrayOfObjects), 41);
    });

    it('Should throw an error', function () {
        expect(() => findTotal('45')).to.throw();
    });
});
