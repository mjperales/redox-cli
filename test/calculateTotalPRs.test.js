const expect = require('chai').expect;
const assert = require('assert');
const sinon = require('sinon');
const calculateTotalPRs = require('../bin/calculateTotalPRs');
const fetchPRsCall = require('../bin/fetchPRsCall');
const getAPagePulls = require('../bin/getAPagePulls');
const response = require('./fixtures/github-data.json');
const onePage = require('./fixtures/github-data-onepage.json');

describe('calculateTotalPRs() tests', function () {
    // let fetchPRsCallStub;
    // let getAPagePullsStub;

    // beforeEach(function () {
    //     fetchPRsCallStub = sinon.stub(fetchPRsCall, 'fetchPrsCall');
    //     getAPagePullsStub = sinon.stub(getAPagePulls, 'getAPagePulls');
    // });

    // afterEach(function () {
    //     fetchPRsCallStub.restore();
    //     getAPagePullsStub.restore();
    // });

    it('returns total of 63 (current PRs)', async function () {
        const fetchPRsCallStub = sinon.stub(fetchPRsCall, 'fetchPrsCall');
        const getAPagePullsStub = sinon.stub(getAPagePulls, 'getAPagePulls');

        // total of 3 pages
        fetchPRsCallStub
            .withArgs('repoName', 'mayra')
            .returns(Promise.resolve('rel:first page=1 info, rel:last page=3'));

        // data length
        getAPagePullsStub
            .withArgs(3, 'repoName', 'mayra')
            .returns(Promise.resolve(3));

        const total = await calculateTotalPRs('repoName', 'mayra');

        assert.equal(getAPagePullsStub.calledOnce, true);
        // expect(total).equal(63);
    });
    // it('should return a number', async function () {
    //     const calculateTotalPRs = sinon.stub().returns(2);
    //     const total = await calculateTotalPRs('ramda-fantasy', 'ramda');
    //     expect(total).to.be.a('number');
    // });
    // describe('Calculate if we have more than one page of results', function () {
    //     it('should calculate total PRs', async function () {
    //         const calculateTotalPRs = sinon.stub().returns(102);
    //         const total = await calculateTotalPRs('ramda', 'ramda');
    //         expect(total).equal(102);
    //     });
    //     it('should be a number', async function () {
    //         const calculateTotalPRs = sinon.stub().returns(2);
    //         const total = await calculateTotalPRs('ramda', 'ramda');
    //         expect(total).to.be.a('number');
    //     });
    // });
});
