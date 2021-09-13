/**
 * Finds the total pulls for a an organization
 *
 * @param {String} repo repo name
 * @param {String} orgName Orgnanization name
 * @returns
 */
function extractTotalPages(link) {
    const lastRel = link.split(',');
    const regex = /page\={0,9}\w+/g;

    while ((lastPage = regex.exec(lastRel[1])) !== null) {
        const lastPageInt = /\d+[0-9]*/.exec(lastPage[0]);
        if (parseInt(lastPageInt, 10) === NaN) {
            throw new Error('Something is wrong with extractTotalPages()');
        }

        return parseInt(lastPageInt, 10);
    }

    // let's return an error if we can't find the page={NUMBER} string
    throw new Error('the page= string was not found');
}

module.exports = extractTotalPages;
