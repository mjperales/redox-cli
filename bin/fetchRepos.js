require('dotenv').config();
const axios = require('axios').default;
const checkStatus = require('./Utilities/HttpResponse');
const token = process.env.TOKEN;

/**
 *  Fetch repos for an organization
 *
 * @param {String} orgName  Organization name
 * @returns
 */
async function fetchRepos(orgName) {
    try {
        const rsp = await axios.get(
            `https://api.github.com/orgs/${orgName}/repos`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const { data } = rsp;
        return data;
    } catch (err) {
        return checkStatus(err);
    }
}

module.exports = fetchRepos;
