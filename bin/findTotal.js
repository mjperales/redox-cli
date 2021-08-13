/**
 * Finds the total of all pulls for an organizations
 *
 * @param {Array} arr Array of object with repos and total pulls
 * @returns
 */
function findTotal(arr) {
    try {
        const total = arr.reduce((acc, current) => acc + current.pulls, 0);

        return total;
    } catch (err) {
        console.log(err);
    }
}

// exports
module.exports = findTotal;
