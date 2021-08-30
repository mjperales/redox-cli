#!/usr/bin/env node
require('dotenv').config();
const yargs = require('yargs');
const boxen = require('boxen');
const calculateTotalPRs = require('./calculateTotalPRs');
const compileRepoNames = require('./compileRepoNames');
const findTotal = require('./findTotal');
const fetchRepos = require('./fetchRepos');
const saveListOfPRs = require('./saveListOfPRs');

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
