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
 * @param {Number} pageNum Page number to fetch PRs
 * @returns
 */
async function fetchPrsCall(repo, orgName, pageNum = null) {
    try {
        let pagenumber = '';
        if (pageNum !== null) {
            pagenumber = `?page=${pageNum}`;
        }

        const rsp = await axios.get(
            `https://api.github.com/repos/${orgName}/${repo}/pulls${pagenumber}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return rsp;
    } catch (err) {
        return checkStatus(err);
    }
}

module.exports = { fetchPrsCall };
