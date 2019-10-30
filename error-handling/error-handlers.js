const createMessage = (err) => {
    return err.message.split(' - ')[1];
}

exports.customErrorHandler = (err, req, res, next) => {
    //console.log(err);
    if(err.status) {
        res.status(err.status).send({msg: err.message});
    } else next(err);
}

exports.psqlErrorHandler = (err, req, res, next) => {
    const psqlCodes = {
        '22P02': {
            status: 400,
            msg: createMessage(err)
        },
        '23503': {
            status: 404,
            msg: createMessage(err)
        },
        '23502': {
            status: 400,
            msg: createMessage(err)
        },
        '42703': {
            status: 400,
            msg: createMessage(err)
        }
    }

    const thisError = psqlCodes[err.code];
    
    if (thisError) {
        res.status(thisError.status).send({msg: thisError.msg});
    } else next(err);

}

exports.serverErrorHandler = (err, req, res, next) => {
    res.status(500).send({msg: "something is wrong!"});
}

exports.send405Error = (req, res, next) => {
    res.status(405).send({ msg: 'method not allowed' });
};

exports.routeNotFoundErrorHandler = (req, res, next) => {
    res.status(404).send({msg: `Route "${req.originalUrl}" not found`});
}
  
