require('dotenv').config();
const { request } = require('@octokit/request');
const token = process.env.TOKEN;

async function fetchPrsCall(repo, orgName) {
    try {
        const rsp = await request('GET /repos/{owner}/{repo}/pulls', {
            headers: {
                authorization: `token ${token}`,
            },
            owner: orgName,
            repo: repo,
        });

        const { link } = rsp.headers;

        if (link === undefined) {
            return null;
        }

        return link;
    } catch (err) {
        if (err.status === 404) {
            return err.message;
        }

        return err;
    }
}

module.exports = fetchPrsCall;
