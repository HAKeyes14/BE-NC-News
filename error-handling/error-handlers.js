
exports.errorHandler = (err, req, res, next) => {
    //console.log(err);
    if(err.status) {
        res.status(err.status).send({msg: err.message});
    }
}