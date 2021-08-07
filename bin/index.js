#!/usr/bin/env node
require('dotenv').config();
const boxen = require('boxen');
const { request } = require('@octokit/request');
const token = process.env.TOKEN;
const yargs = require('yargs');

const boxenOptions = {
    padding: 1,
    maring: 1,
    borderStyle: 'round',
    borderColor: 'green',
    backgroundColor: '#555555',
};

const options = yargs
    .usage('Usage: -t <total>')
    .options('n', {
        alias: 'total',
        describe: 'Find Total Repos',
        type: 'string',
        demandOption: false,
    })
    .options('n', {
        alias: 'name',
        describe: 'Org Name',
        type: 'string',
        demandOption: false,
    }).argv;

/**
 * Grab a list of repo names for one org
 *
 * @param {Array} list repo names for one org
 * @returns
 */
const fetchListOfRepoNames = (list) => ({
    repos: list,
});

/**
 * Let's get started by finding all the repo names of an organization,
 * then fetching total pulls for each repo and then combining the results
 *
 * @param {String} orgName Github org name
 * @returns
 */
async function getStarted(orgName) {
    try {
        const rsp = await request('GET /orgs/{org}/repos', {
            headers: {
                authorization: `token ${token}`,
            },
            org: `${orgName.toLowerCase()}`,
        });

        const { data } = rsp;
        let names = [];

        // find repo names
        data.forEach((item) => {
            names.push(item.name);
        });
        const list = fetchListOfRepoNames(names);
        const { repos } = list;
        const arr = [];

        // We loop through our repos
        // Can't use forEach because it doesn't wait for promises
        for (let i = 0; repos.length > i; i++) {
            const total = await getTotalPulls(repos[i]);
            arr.push({ repo: repos[i], pulls: total });
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
 * Finds the total of all pulls for an organizations
 *
 * @param {Array} arr Array of object with repos and total pulls
 * @returns
 */
async function findTotal(arr) {
    try {
        const total = arr.reduce((acc, current) => acc + current.pulls, 0);

        return total;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Finds the total pulls for a repository
 *
 * @param {String} repo repo name
 * @returns
 */
async function getTotalPulls(repo) {
    try {
        const rsp = await request('GET /repos/{owner}/{repo}/pulls', {
            headers: {
                authorization: `token ${token}`,
            },
            owner: 'ramda',
            repo: `${repo}`,
        });

        const { link } = rsp.headers;

        // if link doens't exist then we only have 1 page!
        if (link === undefined) {
            const onlyOnePagePulls = await getLastPagePulls(1, repo);
            return onlyOnePagePulls;
        }

        // So, we know that the default page count is 30 pulls per page
        // We just need to figure out how many pages the results has and
        // since the pages before will have a 30 count, then we only need
        // to figure out how many pulls the last page has and then add
        const addIntoArray = link.split(',');
        const extractPageString = /page\={0,9}\w+/g.exec(addIntoArray[1]);
        const lastPage = /\d+[0-9]*/.exec(extractPageString[0]);
        const lastPageNum = parseInt(lastPage, 10);

        const pullsFromPrevPages = (lastPageNum - 1) * 30;
        const pullsFromLastPage = await getLastPagePulls(lastPageNum, repo);

        return pullsFromPrevPages + pullsFromLastPage;
    } catch (err) {
        return console.log(err);
    }
}

/**
 * Let's find the amount of pulls for the last page
 *
 * @param {Num} pageNum Last page number
 * @param {String} repo repository name
 * @returns
 */
async function getLastPagePulls(pageNum, repo) {
    try {
        const rsp = await request(
            `GET /repos/{owner}/{repo}/pulls?page=${pageNum}`,
            {
                headers: {
                    authorization: `token ${token}`,
                },
                owner: 'ramda',
                repo: `${repo}`,
            }
        );
        return rsp.data.length;
    } catch (err) {
        return console.log(err);
    }
}

if (options.total && options.name) {
    console.log(`Total pulls for ${options.name}:`);
    console.log(`...wait while we calculate...`);
    getStarted(options.name);
}
