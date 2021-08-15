require('dotenv').config();
const { request } = require('@octokit/request');
const token = process.env.TOKEN;

/**
 * Fetch an array of repository names for an organization
 *
 * @param {String} orgName Org name
 * @returns
 */
async function fetchRepoNames(orgName) {
    try {
        const rsp = await request('GET /orgs/{org}/repos', {
            headers: {
                authorization: `token ${token}`,
            },
            org: `${orgName.toLowerCase()}`,
        });

        const { data } = rsp;
        const names = [];

        // find repo names
        for (let i = 0; data.length > i; ++i) {
            names.push(data[i].name);
        }

        // console.log(names);
        return names;
    } catch (err) {
        console.log(err);
    }
}

module.exports = fetchRepoNames;
