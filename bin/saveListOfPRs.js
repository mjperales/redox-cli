const fetchPRsWith100PerPage = require('./fetchPRsWith100PerPage');

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
            const { link } = headers;

            // if we don't have a link property then we only have one page!
            // So, we can skip those since we will get an undefined error
            if (link) {
                const extractPageString = /&page\={0,9}\w+/g.exec(link);
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

module.exports = saveListOfPRs;
