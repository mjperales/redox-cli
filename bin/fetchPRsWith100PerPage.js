require('dotenv').config();
const axios = require('axios').default;
const checkStatus = require('./Utilities/HttpResponse');
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
        let path = `https://api.github.com/repos/${orgName}/${repo}/pulls?per_page=100`;

        if (path !== null) {
            path = `https://api.github.com/repos/${orgName}/${repo}/pulls?per_page=100${page}`;
        }
        const rsp = await axios.get(path, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return rsp;
    } catch (err) {
        checkStatus(err);
    }
}

module.exports = fetchPRsWith100PerPage;
