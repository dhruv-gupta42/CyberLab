const {execFile}=
require("child_process");

const Scan=
require("../models/Scan");

exports.runScan=
async(req,res)=>{

const {target,scanType}=req.body;

if(!target){

return res.status(400).json({

error:"Target required"

});

}

const commands={

quick:["-F",target],

full:["-p-",target],

service:["-sV",target]

};

const args=
commands[scanType]
||
commands.quick;

execFile(

"nmap",

args,

async(error,stdout)=>{

if(error){

return res.status(500).json({

error:"Scan failed"

});

}

const lines=
stdout.split("\n");

const ports=[];

lines.forEach(line=>{

const match=
line.match(

/(\d+)\/tcp\s+(\w+)\s+(.+)/

);

if(match){

ports.push({

port:match[1],
state:match[2],
service:match[3]

});

}

});

const vulnerabilities=[];

ports.forEach(port=>{

const portNum=
parseInt(port.port);

if(portNum===21){

vulnerabilities.push({

severity:"High",
issue:"FTP detected",
recommendation:
"FTP transmits credentials in plain text. Consider SFTP."

});

}

if(portNum===23){

vulnerabilities.push({

severity:"Critical",
issue:"Telnet detected",
recommendation:
"Disable Telnet and use SSH."

});

}

if(portNum===80){

vulnerabilities.push({

severity:"Medium",
issue:"HTTP detected",
recommendation:
"Use HTTPS if sensitive data is transmitted."

});

}

if(portNum===445){

vulnerabilities.push({

severity:"Critical",
issue:"SMB exposed",
recommendation:
"Restrict SMB access."

});

}

});

const riskScore=

Math.min(
ports.length*10,
100
);

const scan=
await Scan.create({

target,
scanType,
riskScore,
ports

});

res.json(scan);

}

);

};

exports.getHistory=
async(req,res)=>{

try{

const history=

await Scan.find()

.sort({

createdAt:-1

});

res.json(
history
);

}

catch(error){

res.status(500).json({

error:error.message

});

}

};