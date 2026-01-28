const mongoose = require('mongoose')

const RunSchema = new mongoose.Schema({
    title:{
        type:String,
        default:"Run", 
        maxlength: 50 
    },
    distance:{
        type:Number,
        required:[true, "Please input a distance"]
    },
    duration:{
        type:Number,
        required:[true, "Please input a duration"]
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true, "Please provide user"]
    },
}, {timestamps:true})

module.exports = mongoose.model("Run", RunSchema)

