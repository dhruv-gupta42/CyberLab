const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");

require("dotenv").config();
const scanRoutes=
require("./routes/scanRoutes");
const app=express();

app.use(cors());

app.use(express.json());
app.use("/api",scanRoutes);

mongoose.connect(
process.env.MONGO_URI
)
.then(()=>{

console.log(
"Mongo Connected"
);

})
.catch(err=>{

console.log(err);

});

app.get("/",(req,res)=>{

res.send(
"CyberLab API Running"
);

});

const PORT=
process.env.PORT||5000;

app.listen(PORT,()=>{

console.log(
`Server running on ${PORT}`
);

});