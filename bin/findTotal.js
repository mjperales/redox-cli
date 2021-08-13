/**
 * Finds the total of all pulls for an organizations
 *
 * @param {Array} arr Array of object with repos and total pulls
 * @returns
 */
function findTotal(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('Make sure to use a valid array.');
    }

    return arr.reduce((acc, current) => acc + current.pulls, 0);
}

// exports
module.exports = findTotal;
