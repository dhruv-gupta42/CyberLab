const PDFDocument=require("pdfkit");

exports.generateReport=(req,res)=>{

try{

const {

target,
riskScore,
ports,
vulnerabilities

}=req.body;

const doc=
new PDFDocument();

res.setHeader(
"Content-Type",
"application/pdf"
);

res.setHeader(

"Content-Disposition",

`attachment; filename=security-report.pdf`

);

doc.pipe(res);

doc
.fontSize(24)
.text(
"CyberLab Security Report"
);

doc.moveDown();

doc
.fontSize(16)
.text(
`Target: ${target}`
);

doc.text(
`Risk Score: ${riskScore}/100`
);

doc.moveDown();

doc
.fontSize(18)
.text(
"Open Ports"
);

doc.moveDown();

ports.forEach(port=>{

doc.text(

`Port: ${port.port}
State: ${port.state}
Service: ${port.service}`

);

doc.moveDown();

});

doc.moveDown();

doc
.fontSize(18)
.text(
"Detected Vulnerabilities"
);

doc.moveDown();

if(
vulnerabilities?.length
){

vulnerabilities.forEach(v=>{

doc.text(

`${v.severity}

Issue:
${v.issue}

Recommendation:
${v.recommendation}

`

);

doc.moveDown();

});

}

else{

doc.text(
"No vulnerabilities detected"
);

}

doc.end();

}

catch(error){

res.status(500).json({

error:error.message

});

}

};