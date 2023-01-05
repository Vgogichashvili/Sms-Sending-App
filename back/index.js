process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db.js");
var smsController = require("./controllers/smsController.js");

var app = express();
app.use(bodyParser.json());
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.listen(3000, () => console.log("Server started at port : 3000"));

app.use("/", smsController);
