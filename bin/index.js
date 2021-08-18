#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const boxen = require('boxen');
const yargs = require('yargs');
const findTotal = require('./findTotal');
const fetchRepoNames = require('./fetchRepoNames');
const calculateTotalPRs = require('./calculateTotalPRs');
const fetchPRsWith100PerPage = require('./fetchPRsWith100PerPage');
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
 * Calculate to total number of PRs for an organization
 *
 * @param {String} orgName Github org name
 * @returns
 */
async function calculateTotalNumberPRs(orgName) {
    try {
        const data = await fetchRepos(orgName);
        // console.log(data);
        const list = fetchRepoNames(data);
        const arr = [];

        // We loop through our repos
        // Can't use forEach because it doesn't wait for promises
        for (let i = 0; list.length > i; i++) {
            const total = await calculateTotalPRs(list[i], orgName);
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
 * Fetch an array of objects (PRs for an organization)
 *
 * @param {String} orgName  Github organization name
 * @returns
 */
async function saveListOfPRs(orgName) {
    try {
        const data = await fetchRepos(orgName);
        const list = fetchRepoNames(data);
        let prs = [];

        // iterate through repo names and push to array
        // the only bad part is that we need to iterate through pages too 🤢
        for (let i = 0; list.length > i; i++) {
            const rsp = await fetchPRsWith100PerPage(orgName, list[i]);

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
                        list[i],
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
    calculateTotalNumberPRs(options.total);
}
if (options.name) {
    // console.log('...writing to file...');
    async function displayResults() {
        const pullRequests = await saveListOfPRs(options.name);

        console.log(pullRequests);
        return pullRequests;
    }
    displayResults();
}
