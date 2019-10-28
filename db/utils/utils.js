exports.formatDates = list => {
    const formattedArr = list.map(obj => {
        const formattedObj = {...obj};
        const formattedDate = new Date(obj.created_at);
        formattedObj.created_at = formattedDate;
        return formattedObj;
    });
    return formattedArr;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
