var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log("call", req);
  res.send("response with a resource");
});

module.exports = router;
