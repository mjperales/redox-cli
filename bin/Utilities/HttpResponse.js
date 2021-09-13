const checkStatus = (err) => {
    if (err.status === 404) {
        return err.message;
    }

    return err;
};

module.exports = checkStatus;
