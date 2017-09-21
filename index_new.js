"use strict";
var fs = require("fs");
// var request = require("request");
// var utils = require("axiom-utils");
const csv = require("csvtojson");

var moment = require("moment")
var async = require("async")
var shifts = [{ st: '23:00:00', et: "01:00:00", type: "break" }, { st: '08:00:00', et: "09:00:00", type: "break" }, { st: "01:00:00", et: "08:00:00", type: "shift" }, { st: "09:00:00", et: "16:00:00", type: "shift" }, { st: "16:00:00", et: "23:00:00", type: "shift" }];
// var json2csv = require('json2csv');


//Read Files
function readFiles(cb) {
  fs.readdirSync(folder).forEach(file => {
    fileArray.push(file)
  })
  cb()
}
var results = {}
var fullFileName = '/home/shailee/production_plan.csv'

function processFiles(fileName) {
  var jsonObjects = [];

  csv( /*{ includeColumns: [3, 8] }*/ ).fromFile(fileName).on('json', (jsonObj) => {

    jsonObjects.push(jsonObj)
  }).on('done', (error) => {
    // console.log(jsonObjects[0])
    processJson(jsonObjects)

  }).on("error", (err) => {
    console.log(err)
  })





}

/*function getBucket(argument) {
  return shifts[0];
}*/
function getBucket(startTime) {
  var time;
  for (i = 0; i < shifts.length; i++) {
    var bucketStartTime = moment.utc(shifts[i].st, "h:mm:ss").local();
    var bucketEndTime = moment.utc(shifts[i].et, "h:mm:ss").local();
    startTime = moment.utc(startTime, "h:mm:ss").local();
    // console.log()
    // console.log("bucketStartTime,bucketEndTime,startTime", bucketStartTime, bucketEndTime, startTime);

    if ((startTime.diff(bucketStartTime) == 0) || (startTime.isAfter(bucketStartTime) && startTime.isBefore(bucketEndTime))) {
      // return shifts[i]
      shifts[i].differnce = bucketEndTime.diff(startTime)
      time = new Object(shifts[i]);
      return time
        // cb(shifts[i]);
        // 
    }
  }
  /*shifts.forEach(function(shifts[i], index) {
    var bucketStartTime = moment.utc(shifts[i].st, "h:mm:ss").local();
    var bucketEndTime = moment.utc(shifts[i].et, "h:mm:ss").local();
    startTime = moment.utc(startTime, "h:mm:ss").local();
    // console.log()
    // console.log("bucketStartTime,bucketEndTime,startTime", bucketStartTime, bucketEndTime, startTime);

    if ((startTime.diff(bucketStartTime) == 0) || (startTime.isAfter(bucketStartTime) && startTime.isBefore(bucketEndTime))) {
      // return shifts[i]
      shifts[i].differnce = bucketEndTime.diff(startTime)
      time = new Object(shifts[i]);
      // cb(shifts[i]);
      // 
    }

  });
      console.log(time)

  return time*/

}



function processJson(jArray) {
  // console.log(jArray[0])
  var transformed = [];
  jArray.every(function(e, i) {
    // console.log(getBucket(jArray[i]['Plan Start Date']))

    /*if (moment(e["Plan Start Date"]).day() == 7) {
      shifts.forEach(function(shift, ii) {
        var newEntry = new Object(e);
        newEntry['Plan Start Date'] = moment(e.date());
        var bkt = getBucket(moment(e.date()))
        newEntry['Plan End Date'] = moment(e.date()).add(shifts[i].differnce);
        newEntry['status'] = 0;
        transformed.push(newEntry);
      });
    } else {*/
    var curr = e['Plan Start Date'];
    console.log(curr)
    while (moment(curr).isSameOrBefore(e['Plan End Date'])) {
      var newEntry = new Object(e);
      var bucket = getBucket(curr);
      // endTime = bucket.end();

      if (bucket.type == "break") {
        newEntry['Plan Start Date'] = curr;
        // var currDT = moment(curr)
        /*.format("DD-MM-YYYY").toString() + " " + moment(bucket.et).format("h:mm:ss"),
                    newdt = moment(curr).add(bucket.differnce, 'hours')*/
        newEntry['Plan End Date'] = moment(curr).add(bucket.differnce, 'hours');
        newEntry['status'] = 0;
        transformed.push(newEntry);
        // curr = moment(curr).add(moment(bucket.et).diff(bucket.st), 'hours');
      } else {
        newEntry['Plan Start Date'] = curr;
        newEntry['Plan End Date'] = moment(curr).add(bucket.differnce, 'hours');
        newEntry['status'] = 1;
        transformed.push(newEntry);

      }
      curr = moment(curr).add(bucket.differnce, 'hours')

    }
    // }

  });
}

/*

var curr = e['Plan Start Date']
while (curr.isBefore(planEndTime)) {
  var newEntry = new Object(e);
  var a = getBucket(curr);
  endTime = bucket.end();

  if (bucket.type == "break") {
    newEntry['Plan Start Date'] = curr;
    newEntry['Plan End Date'] = bucket.et;
    newEntry['status'] = 0;
    transformed.push(newEntry);
  } else {
    newEntry['Plan Start Date'] = curr;
    newEntry['Plan End Date'] = bucket.et;
    newEntry['status'] = 1;
    transformed.push(newEntry);
  }
  curr = bucket.et;

}

 */



/*var saveAsCSV = function(json, k, v, cb) {
    var data = [];
    Object.keys(json).forEach(function(e, i) {
        var tmp = {};
        tmp[k] = e;
        tmp[v] = json[e];
        datbucket.push(tmp);
    });
    console.log(data)
    try {
        var result = json2csv({ data: data, fields: [k, v] });
        fs.writeFile('file.csv', result, function(err) {
            if (err) throw err;
            cb('file saved');
        });
    } catch (err) {
        // Errors are thrown for bad options, or if the data is empty and no fields are provided.
        // Be sure to provide fields if it is possible that your data array will be empty.
        cb(err);
    }

}
*/
processFiles(fullFileName)
