require('dotenv').config();
const { request } = require('@octokit/request');
const token = process.env.TOKEN;

/**
 * Fetch PRs for a certain page number
 *
 * @param {Number} pageNum Last page number
 * @param {String} repo repository name
 * @param {String} owner Organization owner name
 * @returns
 */
async function getAPagePulls(pageNum, repo, owner) {
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

        console.log(err);
        return err;
    }
}

module.exports = getAPagePulls;
