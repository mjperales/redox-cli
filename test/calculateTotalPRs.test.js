const assert = require('assert');
const expect = require('chai').expect;
const calculateTotalPRs = require('../bin/calculateTotalPRs');

describe('calculateTotalPRs() tests', function () {
    it('returns total of 2 (current PRs)', async function () {
        const total = await calculateTotalPRs('ramda-fantasy', 'ramda');
        expect(total).equal(2);
    });
    it('should return a number', async function () {
        const total = await calculateTotalPRs('ramda-fantasy', 'ramda');
        expect(total).to.be.a('number');
    });
    describe('Calculate if we have more than one page of results', function () {
        it('should calculate total PRs', async function () {
            const total = await calculateTotalPRs('ramda', 'ramda');
            expect(total).equal(102);
        });
        it('should be a number', async function () {
            const total = await calculateTotalPRs('ramda', 'ramda');
            expect(total).to.be.a('number');
        });
    });
});
