require('dotenv').config();
const { request } = require('@octokit/request');
const token = process.env.TOKEN;
const getLastPagePulls = require('./getLastPagePulls');
const fetchPrsCall = require('./fetchPRsCall');

/**
 * Finds the total pulls for a an organization
 *
 * @param {String} repo repo name
 * @param {String} orgName Orgnanization name
 * @returns
 */
async function calculateTotalPRs(repo, orgName) {
    const link = await fetchPrsCall(repo, orgName);

    // if link doesn't exist then we only have 1 page!
    if (link === null) {
        const onlyOnePagePulls = await getLastPagePulls(1, repo, orgName);
        return onlyOnePagePulls;
    }

    // So, we know that the default page count is 30 pulls per page
    // We just need to figure out how many pages the results has and
    // since the pages before will have a 30 count, then we only need
    // to figure out how many pulls the last page has and then add to it
    const addIntoArray = link.split(',');
    const extractPageString = /page\={0,9}\w+/g.exec(addIntoArray[1]);
    const lastPage = /\d+[0-9]*/.exec(extractPageString[0]);
    const lastPageNum = parseInt(lastPage, 10);

    const pullsFromPrevPages = (lastPageNum - 1) * 30;
    const pullsFromLastPage = await getLastPagePulls(
        lastPageNum,
        repo,
        orgName
    );

    return pullsFromPrevPages + pullsFromLastPage;
}

module.exports = calculateTotalPRs;
