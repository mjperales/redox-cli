require('dotenv').config();
const { request } = require('@octokit/request');
const token = process.env.TOKEN;

/**
 * Fetch PRs with a total page count of 100
 * @param {String} orgName Organization name
 * @param {String} repo Repository name
 * @param {Number} page Page number to fetch
 * @returns
 */
async function fetchPRsWith100PerPage(orgName, repo, page = null) {
    try {
        let path = 'GET /repos/{owner}/{repo}/pulls?per_page=100';

        if (page !== null) {
            path = `GET /repos/{owner}/{repo}/pulls?per_page=100&page=${page}`;
        }

        const rsp = await request(path, {
            headers: {
                authorization: `token ${token}`,
            },
            owner: orgName,
            repo: repo,
        });

        return rsp;
    } catch (err) {
        if (err.status === 404) {
            return err.message;
        }
        return err;
    }
}

module.exports = fetchPRsWith100PerPage;
