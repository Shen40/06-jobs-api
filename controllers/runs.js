const Run = require("../models/run")
const { StatusCodes} = require("http-status-codes")
const {BadRequestError, NotFoundError} = require('../errors')

const getAllRuns = async(req,res) =>{
    const runs = await Run.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({runs, count:runs.length})
}

const getRun = async(req,res) =>{
    const {user:{userId},params:{id:runId}} = req

    const run = await Run.findOne({
            _id:runId,createdBy:userId
    })

    if(!run){
        throw new NotFoundError(`No run with id ${runId}`)
    }

    res.status(StatusCodes.OK).json({run})
}

const createRun = async(req,res) =>{
    req.body.createdBy = req.user.userId 
    const run = await Run.create(req.body)
    res.status(StatusCodes.CREATED).json({run})
    
}

const updateRun = async(req,res) =>{
    const {
            body:{title, distance, duration},
            user:{userId},
            params:{id:runId}} = req

    if(title===''||distance===''||duration===''){
            throw new BadRequestError('Title, Distance, or Duration fields cannot be empty')
    }

    const run = await Run.findByIdAndUpdate({_id:runId, createdBy:userId}, req.body, {new:true, runValidators:true})

    if(!run){
            throw new NotFoundError(`No run with id ${runId}`)
    }
    res.status(StatusCodes.OK).json({run})
}

const deleteRun = async(req,res) =>{
    const {user:{userId},params:{id:runId}} = req

    const run = await Run.findOneAndDelete({
        _id:runId,
        createdBy:userId
    })
    if(!run){
        throw new NotFoundError(`No run with id ${runId}`)
    }
    res.status(StatusCodes.OK).json({ msg: "The entry was deleted." });
}

module.exports ={
    getAllRuns,
    getRun,
    createRun,
    updateRun,
    deleteRun
}