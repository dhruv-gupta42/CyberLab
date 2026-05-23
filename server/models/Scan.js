const mongoose=require("mongoose");

const scanSchema=
new mongoose.Schema({

target:{
type:String,
required:true
},

scanType:{
type:String
},

riskScore:{
type:Number
},

ports:[

{

port:String,
state:String,
service:String

}

],

createdAt:{

type:Date,
default:Date.now

}

});

module.exports=
mongoose.model(
"Scan",
scanSchema
);