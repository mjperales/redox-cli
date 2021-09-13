#!/usr/bin/env node
require('dotenv').config();
const yargs = require('yargs');
const boxen = require('boxen');
const compileRepoNames = require('./compileRepoNames');
const fetchRepos = require('./fetchRepos');
const { fetchPrsCall } = require('./fetchPRsCall');
const extractTotalPages = require('./extractTotalPages');

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
            // const total = await calculateTotalPRs(list[i], options.total);
            const rsp = await fetchPrsCall(list[i], options.total);
            const { headers, data } = rsp;
            const { link } = headers;

            // it'll be undefined if link doesn't exists in the data object
            // which means we only have one page
            if (link === undefined) {
                arr.push({ repo: list[i], pulls: data.length });
            } else {
                const lastPage = extractTotalPages(link);

                // So, we know that the default page count is 30 pulls per page
                // We just need to figure out how many pages the results has and
                // since the pages before will have a 30 count, then we only need
                // to figure out how many pulls the last page has
                const prevPagesPRs = (lastPage - 1) * 30;

                // let's make a final fetch call to grab the total PRs for the last page
                const fetchLastPage = await fetchPrsCall(
                    list[i],
                    options.total,
                    lastPage
                );

                const total = fetchLastPage.data.length;

                arr.push({
                    repo: list[i],
                    pulls: prevPagesPRs + total,
                });
            }
        }

        const total = arr.reduce((acc, current) => acc + current.pulls, 0);
        const msgBox = boxen(total.toString(), boxenOptions);

        console.log(msgBox);
    }
    run();
}
if (options.name) {
    async function displayResults() {
        const data = await fetchRepos(options.name);
        const list = compileRepoNames(data);
        let prs = [];

        // iterate through repo names and push to array
        // the only bad part is that we need to iterate through pages too 🤢
        for (let i = 0; list.length > i; i++) {
            const rsp = await fetchPrsCall(list[i], options.name);

            const { data, headers } = rsp;
            const { link } = headers;

            // if we don't have a link property then we only have one page!
            // So, we can skip those since we will get an undefined error
            if (link !== undefined) {
                const totalPages = extractTotalPages(link);

                // this is where it gets yucky
                // greater than 1 since we already have the results for the first page
                for (let x = totalPages; x > 1; x--) {
                    const rsp = await fetchPrsCall(list[i], options.name, x);
                    const { data } = rsp;
                    prs = prs.concat(data);
                }
            }

            prs = prs.concat(data);
        }

        console.log(prs);
        // return pullRequests;
    }
    displayResults();
}
