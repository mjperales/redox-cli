require('dotenv').config();
const { request } = require('@octokit/request');
const token = process.env.TOKEN;

/**
 *  Fetch repos for an organization
 *
 * @param {String} orgName  Organization name
 * @returns
 */
async function fetchRepos(orgName) {
    try {
        const rsp = await request('GET /orgs/{org}/repos', {
            headers: {
                authorization: `token ${token}`,
            },
            org: `${orgName.toLowerCase()}`,
        });

        const { data } = rsp;
        return data;
    } catch (err) {
        if (err.status === 404) {
            return err.message;
        }

        console.log(err);
        return err;
    }
}

module.exports = fetchRepos;
