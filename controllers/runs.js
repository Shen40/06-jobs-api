const Run = require("../models/Run")
const { StatusCodes} = require("http-status-codes")
const {BadRequestError, NotFoundError} = require('../errors')

const getAllRuns = async(req,res) =>{
    res.send('get all jobs')
}

const getRun = async(req,res) =>{
    res.send('get job')
}

const createRun = async(req,res) =>{
    try {
        req.body.createdBy = req.user.userId 
        const run = await Run.create(req.body)
        res.status(StatusCodes.CREATED).json({run})
    } catch (error) {
         res.status(400).json({msg:error.message})
    }
    
}

const updateRun = async(req,res) =>{
    res.send('update job')
}

const deleteRun = async(req,res) =>{
    res.send('delete job')
}

module.exports ={
    getAllRuns,
    getRun,
    createRun,
    updateRun,
    deleteRun
}