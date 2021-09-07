require('dotenv').config();
const axios = require('axios').default;
const checkStatus = require('./Utilities/HttpResponse');
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
        const rsp = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/pulls?page=${pageNum}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return rsp.data.length;
    } catch (err) {
        checkStatus(err);
    }
}

module.exports = { getAPagePulls };
