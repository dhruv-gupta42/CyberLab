const {execFile}=require(
"child_process"
);

exports.scanNetwork=
(req,res)=>{

execFile(

"nmap",

[
"-sn",
"192.168.1.0/24"
],

(error,stdout)=>{

if(error){

console.log(error);

return res.status(500).json({

error:error.message

});

}

const devices=[];

const lines=
stdout.split("\n");

let current={};

lines.forEach(line=>{

if(
line.includes(
"Nmap scan report for"
)
){

if(current.ip){

devices.push(
current
);

}

current={

ip:
line.replace(
"Nmap scan report for ",
""
),

hostname:
"Unknown",

mac:
"Unknown",

status:
"Online"

};

}

if(
line.includes(
"MAC Address:"
)
){

const match=
line.match(
/MAC Address:\s([A-F0-9:]+)\s\((.*?)\)/i
);

if(match){

current.mac=
match[1];

current.vendor=
match[2];

}

}

});

if(current.ip){

devices.push(
current
);

}

res.json(
devices
);

}

);

};