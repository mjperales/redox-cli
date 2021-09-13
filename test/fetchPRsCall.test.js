const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const response = require('./fixtures/github-data.json');
const onePage = require('./fixtures/github-data-onepage.json');

describe('fetchPRsCall() tests', function () {
    it('returns page not found if wrong/bad repository name', async function () {
        const fetchPRsCall = sinon.stub().withArgs('mayra', 'ramda');
        fetchPRsCall.returns(response.all.error.res.status);
        expect(fetchPRsCall('mayra', 'ramda')).equal(404);
    });

    it('returns null if link is undefined', async function () {
        const fetchPRsCall = sinon.stub().withArgs('ramda-fantasy', 'ramda');
        fetchPRsCall.returns(onePage.all.success);
        const rsp = fetchPRsCall('ramda-fantasy', 'ramda');
        expect(rsp.link).equal(undefined);
    });

    describe('Successful fetch calls', async function () {
        it('should return a string with last page relation', async function () {
            const fetchPRsCall = sinon.stub().withArgs('ramda', 'ramda');
            fetchPRsCall.returns(response.all.success.res.headers);
            const headers = fetchPRsCall('ramda', 'ramda');
            expect(headers.link).to.be.a('string');
        });
        it('link should have a page= match to use to find the last page number', async function () {
            const fetchPRsCall = sinon.stub().withArgs('ramda', 'ramda');
            fetchPRsCall.returns(response.all.success.res.headers);
            const headers = fetchPRsCall('ramda', 'ramda');
            const splitIntoArray = headers.link.split(',');
            const extractPageString = /page\={0,9}\w+/g.exec(splitIntoArray[1]);
            expect(extractPageString[0]).to.exist;
        });
    });
});
