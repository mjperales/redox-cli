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
 * @param {Number} perPage Total pull requests in a page (defaults to 30)
 * @returns
 */
async function fetchPrsCall(repo, orgName, pageNum = null, perPage = null) {
    try {
        let pagenumber = '';
        if (pageNum !== null) {
            pagenumber = `?page=${pageNum}`;
        }

        let perpage = '';
        if (perPage !== null) {
            perpage = `?per_page=${perPage}`;
        }

        const rsp = await axios.get(
            `https://api.github.com/repos/${orgName}/${repo}/pulls${perpage}${pagenumber}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return rsp;
    } catch (err) {
        checkStatus(err);
    }
}

module.exports = { fetchPrsCall };
