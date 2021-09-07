const checkStatus = (err) => {
    if (err.status === 404) {
        console.log(err.message);
    }
    console.log(err);
};

module.exports = checkStatus;
