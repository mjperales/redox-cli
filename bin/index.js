#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const yargs = require('yargs');
const boxen = require('boxen');
const calculateTotalPRs = require('./calculateTotalPRs');
const compileRepoNames = require('./compileRepoNames');
const fetchPRsWith100PerPage = require('./fetchPRsWith100PerPage');
const findTotal = require('./findTotal');
const fetchRepos = require('./fetchRepos');

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
 * Fetch an array of objects (PRs for an organization)
 *
 * @param {Array} repoNames  List of repository names
 * @param {String} orgName Organization name
 * @returns
 */
async function saveListOfPRs(repoNames, orgName) {
    try {
        let prs = [];

        // iterate through repo names and push to array
        // the only bad part is that we need to iterate through pages too 🤢
        for (let i = 0; repoNames.length > i; i++) {
            const rsp = await fetchPRsWith100PerPage(orgName, repoNames[i]);

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
                    const rsp = await fetchPRsWith100PerPage(
                        orgName,
                        repoNames[i],
                        x
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

    async function run() {
        const data = await fetchRepos(options.total);
        const list = compileRepoNames(data);
        const arr = [];

        // We loop through our repos
        // Can't use forEach because it doesn't wait for promises
        for (let i = 0; list.length > i; i++) {
            const total = await calculateTotalPRs(list[i], options.total);
            arr.push({ repo: list[i], pulls: total });
        }

        const total = findTotal(arr);
        const msgBox = boxen(total.toString(), boxenOptions);

        console.log(msgBox);
    }
    run();
}
if (options.name) {
    // console.log('...writing to file...');
    async function displayResults() {
        const data = await fetchRepos(options.name);
        const list = compileRepoNames(data);
        const pullRequests = await saveListOfPRs(list, options.name);

        console.log(pullRequests);
        // return pullRequests;
    }
    displayResults();
}
