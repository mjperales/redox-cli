require('dotenv').config();
const axios = require('axios').default;
const checkStatus = require('./Utilities/HttpResponse');
const token = process.env.TOKEN;

/**
 * Fetch call for total PRs
 * Does not include any attributes like per_page
 *
 * @param {String} repo  Repository name
 * @param {String} orgName Organization name
 * @returns
 */
async function fetchPrsCall(repo, orgName) {
    try {
        const rsp = await axios.get(
            `https://api.github.com/repos/${orgName}/${repo}/pulls`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const { link } = rsp.headers;

        if (link === undefined) {
            return null;
        }

        return link;
    } catch (err) {
        checkStatus(err);
    }
}

module.exports = { fetchPrsCall };
