require('dotenv').config();
const { request } = require('@octokit/request');
const token = process.env.TOKEN;

/**
 * Let's find the amount of pulls for the last page
 *
 * @param {Number} pageNum Last page number
 * @param {String} repo repository name
 * @param {String} owner Organization owner name
 * @returns
 */
async function getLastPagePulls(pageNum, repo, owner) {
    try {
        const rsp = await request(
            `GET /repos/{owner}/{repo}/pulls?page=${pageNum}`,
            {
                headers: {
                    authorization: `token ${token}`,
                },
                owner: owner,
                repo: repo,
            }
        );

        return rsp.data.length;
    } catch (err) {
        if (err.status === 404) {
            return err.message;
        }
        return console.log(err);
    }
}

module.exports = getLastPagePulls;
