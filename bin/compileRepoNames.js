/**
 * Compile an array of repository names for an organization
 *
 * @param {Array} data Array of objects
 * @returns
 */
function compileRepoNames(data) {
    if (!Array.isArray(data)) {
        throw new Error('data should be an array');
    }
    const names = [];

    // find repo names
    for (let i = 0; data.length > i; ++i) {
        names.push(data[i].name);
    }

    // console.log(names);
    return names;
}

module.exports = compileRepoNames;
