const assert = require('assert');
const expect = require('chai').expect;
const fetchPRsCall = require('../bin/fetchPRsCall');

describe('fetchPRsCall() tests', function () {
    it('returns page not found if wrong/bad repository name', async function () {
        const rsp = await fetchPRsCall('mayra', 'ramda');
        expect(rsp).equal('Not Found');
    });

    it('returns page not found if wrong/bad organization name', async function () {
        const rsp = await fetchPRsCall('ramda', 'mayra');
        expect(rsp).equal('Not Found');
    });

    it('returns null if link is undefined', async function () {
        const rsp = await fetchPRsCall('ramda-fantasy', 'ramda');
        expect(rsp).equal(null);
    });

    describe('Successful fetch calls', async function () {
        it('should return a string with last page relation', async function () {
            const link = await fetchPRsCall('ramda', 'ramda');
            expect(link).to.be.a('string');
        });
        it('link should have a page= match to use to find the last page number', async function () {
            const link = await fetchPRsCall('ramda', 'ramda');
            const splitIntoArray = link.split(',');
            const extractPageString = /page\={0,9}\w+/g.exec(splitIntoArray[1]);
            expect(extractPageString[0]).to.exist;
        });
    });
});
