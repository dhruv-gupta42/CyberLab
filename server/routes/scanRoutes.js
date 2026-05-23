const express=
require("express");

const router=
express.Router();   

const {
scanNetwork
}=require(
"../controllers/networkController"
);

const {
generateReport
}=require(
"../controllers/reportController"
);

const {

runScan,
getHistory

}=require(
"../controllers/scanController"
);

router.post(
"/scan",
runScan
);

router.get(
"/history",
getHistory
);

router.get(
"/network",
scanNetwork
);

router.post(
"/report",
generateReport
);

module.exports=
router;