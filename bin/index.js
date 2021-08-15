#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const boxen = require('boxen');
const { request } = require('@octokit/request');
const token = process.env.TOKEN;
const yargs = require('yargs');
const findTotal = require('./findTotal');
const fetchRepoNames = require('./fetchRepoNames');
const getTotalPulls = require('./getTotalPulls');

const boxenOptions = {
    padding: 1,
    maring: 1,
    borderStyle: 'round',
    borderColor: 'green',
    backgroundColor: '#555555',
};

const options = yargs
    .usage('Usage: -n <orgName>')
    .options('n', {
        alias: 'name',
        describe: 'Fetch all PRs for an organization',
        type: 'string',
    })
    .options('t', {
        alias: 'total',
        describe: 'Find Total PRs for organization',
        type: 'string',
    })
    .help().argv;

/**
 * Let's get started by finding all the repo names of an organization,
 * then fetching total pulls for each repo and then combining the results
 *
 * @param {String} orgName Github org name
 * @returns
 */
async function getStarted(orgName) {
    try {
        const list = await fetchRepoNames(orgName);
        const arr = [];

        // We loop through our repos
        // Can't use forEach because it doesn't wait for promises
        for (let i = 0; list.length > i; i++) {
            const total = await getTotalPulls(list[i], orgName);
            arr.push({ repo: list[i], pulls: total });
        }

        const total = await findTotal(arr);
        const msgBox = boxen(total.toString(), boxenOptions);

        console.log(msgBox);
        return total;
    } catch (err) {
        console.log('Make sure to use a valid organization name');
        console.log(err);
    }
}

/**
 * Fetch an array of PRs for an organization
 *
 * @param {String} orgName  Github organization name
 * @returns
 */
async function fetchOrgPullRequests(orgName) {
    try {
        const list = await fetchRepoNames(orgName);
        let prs = [];

        // iterate through repo names and push to array
        // the only bad part is that we need to iterate through pages too 🤢
        for (let i = 0; list.length > i; i++) {
            const rsp = await request(
                `GET /repos/{owner}/{repo}/pulls?per_page=100`,
                {
                    headers: {
                        authorization: `token ${token}`,
                    },
                    owner: orgName,
                    repo: `${list[i]}`,
                }
            );

            const { data, headers } = rsp;

            // if we don't have a link property then we only have one page!
            // So, we can skip those since we will get an undefined error
            if (headers.link) {
                const extractPageString = /&page\={0,9}\w+/g.exec(headers.link);
                const lastPage = /\d+[0-9]*/.exec(extractPageString[0]);
                const totalPages = parseInt(lastPage, 10);

                // this is where it gets yucky
                // greater than 1 since we already have the results for the first page
                for (let x = totalPages; x > 1; x--) {
                    const rsp = await request(
                        `GET /repos/{owner}/{repo}/pulls?per_page=100&page=${x}`,
                        {
                            headers: {
                                authorization: `token ${token}`,
                            },
                            owner: orgName,
                            repo: `${list[i]}`,
                        }
                    );
                    const { data } = rsp;
                    prs = prs.concat(data);
                }
            }

            prs = prs.concat(data);
        }
        // console.log(prs.length);
        return prs;
    } catch (err) {
        console.log(err);
    }
}

if (options.total) {
    console.log(`Total pulls for ${options.total}:`);
    console.log(`...wait while we calculate...`);
    getStarted(options.total);
}
if (options.name) {
    // console.log('...writing to file...');
    async function saveFile() {
        const pullRequests = await fetchOrgPullRequests(options.name);
        // we won't create a file everytime... but we can
        // const milliseconds = new Date().now;
        // fs.writeFile(
        //     `./pull-requests-${milliseconds}.js`,
        //     JSON.stringify(pullRequests),
        //     { flag: 'a+' },
        //     (err) => {
        //         if (err) {
        //             console.log(err);
        //             return;
        //         }
        //     }
        // );
        console.log(pullRequests);
        return pullRequests;
    }
    saveFile();
}
