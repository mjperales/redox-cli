const chai = require('chai');
const expect = chai.expect;
const extractTotalPages = require('../bin/extractTotalPages');

const success =
    '<https://api.github.com/repositories/10851820/pulls?page=2>; rel="next", <https://api.github.com/repositories/10851820/pulls?page=4>; rel="last"';

const bad = 'No page number not found';

describe('extractTotalPages() tests', function () {
    it('returns a number', function () {
        const lastPage = extractTotalPages(success);
        expect(lastPage).to.be.a('number');
        expect(lastPage).equal(4);
    });
    it('lastPage to equal to 4', function () {
        const lastPage = extractTotalPages(success);
        expect(lastPage).equal(4);
    });
    it('expect an error', function () {
        expect(() => extractTotalPages(bad)).to.throw(
            'the page= string was not found'
        );
    });
});
