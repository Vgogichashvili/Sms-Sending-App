const express = require("express");
var router = express.Router();
const axios = require("axios");
var ObjectId = require("mongoose").Types.ObjectId;
var { Sms } = require("../models/sms");
const url = "mongodb://0.0.0.0:27017/";
var MongoClient = require("mongodb").MongoClient;
var pendStatus = [];
var pend = [];

//get numbers from db
router.get("/", (req, res) => {
  Sms.find((err, docs) => {
    for (let i = 0; i < docs.length; i++) {
      if (docs[i].status == "submitted" || docs[i].status == "processing") {
        pendStatus.push(docs[i]);
        pend.push(docs[i]);
      }
    }
  });
});

//check numbers status and update them with special api
router.get("/inspect", (req, res) => {
  for (let i = 0; i < pend.length; i++) {
    let id = pend[i].groupId;
    var phone = pend[i].phone.replace(/\D/g, ",");

    var array = phone.split(",");
    for (let i = 0; i < array.length; i++) {
      var s = array[i];

      axios
        .get(
          // in this api, we will set groupid and the actual number, it returns 3 status(processing,submitted,
          // delivered)
          `https://groupid=${id}&number=${s}`
        )
        .then((res) => {
          //update
          MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("PhoneNumbers");
            var myquery = { status: "submitted" };
            var newvalues = { $set: { status: res.data.status_text } };
            dbo
              .collection("sms")
              .updateMany(myquery, newvalues, function (err, res) {
                if (err) throw err;
                db.close();
              });

            var myquery = { status: "processing" };
            var newvalues = { $set: { status: res.data.status_text } };
            dbo
              .collection("sms")
              .updateMany(myquery, newvalues, function (err, res) {
                if (err) throw err;
                db.close();
              });
          });
        });
    }
  }
});

var response = [];
var phoneNum;

//get updated numbers for front
router.get("/lastRes", (req, res) => {
  Sms.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log(
        "Error in Retriving Sms :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

//sending message with api
router.post("/", (req, res) => {
  let datetime = new Date()
    .toLocaleString()
    .split(/\D/)
    .slice(0, 3)
    .map((num) => num.padStart(2, "0"))
    .join("/");

  var emp = new Sms({
    text: req.body.text,
    phone: req.body.phone,
    status: "processing",
    groupId: "",
    sendDate: datetime,
  });

  var phone = req.body.phone.replace(/\D/g, ",");

  var array = phone.split(",");
  for (let i = 0; i < array.length; i++) {
    setTimeout(() => {
      var singleNum = array[i];
      var emp2 = new Sms({
        text: emp.text,
        phone: singleNum,
        status: "processing",
        groupId: "",
        sendDate: datetime,
      });

      if (emp2.phone.length != 0) {
        axios
          .post(
            //this is not free api, it  needs phone number and text as parameters, then it will return success object(true/false)
            // and also groupid wich will be used in second api to check number status 
            //here is a part of api
            `https://&numbers=${emp2.phone}&text=${emp2.text}`
          )
          .then((res) => {
            emp2.groupId = res.data.id;
            response.push(res.data.success);
            groupid = res.data.id;
            phoneNum.push(emp2.phone.replace(/\D/g, ";"));
            if (res.data.success == true || res.data.success == false  ) {
              if (emp2.phone.length > 11) {
                emp2.phone = emp2.phone.substring(3);
              }
             if(res.data.success == true){
              emp2.save((err, doc) => {
                if (!err) {
                } else {
                  console.log(JSON.stringify(err, undefined, 2));
                }
              });
             }
             else if(res.data.success == false){
              emp2.status = 'not delivered'
              emp2.save((err, doc) => {
                if (!err) {
                } else {
                  console.log(JSON.stringify(err, undefined, 2));
                }
              });
             }
            }
          });
      }
    }, 300);
  }

  setTimeout(() => {
    res.send(response);
  }, 1000);
  response = [];
  phoneNum = [];
});

module.exports = router;
