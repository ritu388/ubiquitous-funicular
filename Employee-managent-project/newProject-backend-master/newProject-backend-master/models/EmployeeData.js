const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const DetailSchema = new Schema({
    projectId: {
        type: Number
    },
    employeeId:{
        type:Number
    },
    Name:{
        type:String,
        default:""
    },
    EmailID:{
        type: String,
    },
    PhoneNo:{
        type:Number,
    },
    Location:{
        type: String,
    },
    Vendor:{
        type: String,
    },
    JobType:{
        type: String,
    },
    IDCard: {
        type: String,
    },
    status:{
        type: String,
        default:""
    }
})

module.exports = mongoose.model('EmployeeDetail',DetailSchema)

