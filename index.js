"use strict";
var fs = require("fs");
// var request = require("request");
// var utils = require("axiom-utils");
const csv = require("csvtojson");

var moment = require("moment")
var async = require("async")
var shifts = [{st: '23:00:00', et: "00:00:00", type: "break"},{ st: '00:00:00', et: "01:00:00", type: "break" }, { st: '08:00:00', et: "09:00:00", type: "break" }, { st: "01:00:00", et: "08:00:00", type: "shift" }, { st: "09:00:00", et: "16:00:00", type: "shift" }, { st: "16:00:00", et: "23:00:00", type: "shift" }];
// var json2csv = require('json2csv');


//Read Files
// function readFiles(cb) {
//   fs.readdirSync(folder).forEach(file => {
//     fileArray.push(file)
//   })
//   cb()
// }
// var results = {}
// var fullFileName = '/home/shailee/production_plan.csv'

// function processFiles(fileName) {
//   var jsonObjects = [];

//   csv( /*{ includeColumns: [3, 8] }*/ ).fromFile(fileName).on('json', (jsonObj) => {

//     jsonObjects.push(jsonObj)
//   }).on('done', (error) => {
//     // console.log(jsonObjects[0])
//     processJson(jsonObjects)

//   }).on("error", (err) => {
//     console.log(err)
//   })





// }

// function getDate(date, time) {
//   var d = date;


//   var c = time;
//   var a = d.getFullYear() + "-" + (d.getMonth() + 1) < 10 ? (("0" + d.getMonth() + 1)) : (d.getMonth() + 1) + "-" + d.getDate();
//   // var a = d.getDate() + "-" + (d.getMonth() + 1) < 10 ? (("0" + d.getMonth() + 1)) : (d.getMonth() + 1) + "-" + d.getFullYear();
//   var e = a + "T" + c + ":000Z";
//   // e;
//   return new Date(e);
//   //a;
//   //dDate;
// }

/*function getBucket(argument) {
  return shifts[0];
}*/
// processJson("2017-09-10 08:00:00", "2017-09-12 10:00:00");

// function processJson(startTime, endTime) {

//     getBucket(new Date(startTime), new Date(endTime));

// }
processRow(new Date("2017-09-10 23:30:00"), new Date("2017-09-12 10:00:00"));

function processRow(startTime, endTime) {
    var finalRows = [];
    var curr = new Date(startTime);
    while (curr <= endTime) {
        var result = getBucket(curr);
        var tempEnd = new Date(result.et);
        if (tempEnd > endTime) {
            tempEnd = endTime;
        }
        finalRows.push({ startTime: curr.getFullYear() + "-" + curr.getMonth() + "-" + curr.getDate() + " " + curr.getHours() + ":" + curr.getMinutes() + ":" + curr.getSeconds(), endTime: tempEnd.getFullYear() + "-" + tempEnd.getMonth() + "-" + tempEnd.getDate() + " " + tempEnd.getHours() + ":" + tempEnd.getMinutes() + ":" + tempEnd.getSeconds(), type: result.type });
        curr = new Date(result.et);
    }
    console.log(finalRows);
}

function getBucket(startTime) {

    for (var i = 0; i < shifts.length; i++) {
        var type = shifts[i].type;
        var bucketStartTime = shifts[i].st.split(":");
        var bucketEndTime = shifts[i].et.split(":");

        var bucketStartDate = new Date(startTime);
        bucketStartDate.setHours(parseInt(bucketStartTime[0]));
        bucketStartDate.setMinutes(parseInt(bucketStartTime[1]));
        bucketStartDate.setSeconds(parseInt(bucketStartTime[2]));

        var bucketEndDate = new Date(startTime);
        bucketEndDate.setHours(parseInt(bucketEndTime[0]));
        bucketEndDate.setMinutes(parseInt(bucketEndTime[1]));
        bucketEndDate.setSeconds(parseInt(bucketEndTime[2]));

        if (bucketEndTime[0] < bucketStartTime[0]) {
            if (!(startTime.getHours() == 0 && startTime.getSeconds() == 0 && startTime.getMinutes() == 0)) {
                var a = new Date(bucketStartDate);
                var addOne = a.getDate() + 1;
                bucketEndDate.setDate(addOne);
            } else {
                var a = new Date(bucketStartDate);
                var subOne = a.getDate() - 1;
                bucketStartDate.setDate(subOne);
            }
        }

        var a = bucketStartDate.getFullYear() + "-" + bucketStartDate.getMonth() + "-" + bucketStartDate.getDate() + " " + bucketStartDate.getHours() + ":" + bucketStartDate.getMinutes() + ":" + bucketStartDate.getSeconds();
        var b = bucketEndDate.getFullYear() + "-" + bucketEndDate.getMonth() + "-" + bucketEndDate.getDate() + " " + bucketEndDate.getHours() + ":" + bucketEndDate.getMinutes() + ":" + bucketEndDate.getSeconds();
        
        if(startTime.getDay()==0){
          type = 'idle';
        }
        if (startTime >= bucketStartDate && startTime < bucketEndDate) {

            return { et: bucketEndDate, type: type };
        }


    }

}

// function processJson(jArray) {
//   // console.log(jArray[0])
//   var transformed = [];
//   jArray.every(function(e, i) {
//     // console.log(getBucket(jArray[i]['Plan Start Date']))

//     /*if (moment(e["Plan Start Date"]).day() == 7) {
//       shifts.forEach(function(shift, ii) {
//         var newEntry = new Object(e);
//         newEntry['Plan Start Date'] = moment(e.date());
//         var bkt = getBucket(moment(e.date()))
//         newEntry['Plan End Date'] = moment(e.date()).add(shifts[i].differnce);
//         newEntry['status'] = 0;
//         transformed.push(newEntry);
//       });
//     } else {*/
//     var curr = e['Plan Start Date'];
//     console.log(curr)
//     while (moment(curr).isSameOrBefore(e['Plan End Date'])) {
//       var newEntry = new Object(e);
//       var bucket = getBucket(curr);
//       // endTime = bucket.end();
//       console.log("bucket", bucket)
//       if (bucket.type == "break") {
//         newEntry['Plan Start Date'] = curr;
//         // var currDT = moment(curr)
//         /*.format("DD-MM-YYYY").toString() + " " + moment(bucket.et).format("h:mm:ss"),
//                     newdt = moment(curr).add(bucket.differnce, 'hours')*/
//         newEntry['Plan End Date'] = moment(curr).add(bucket.differnce, 'hours');
//         newEntry['status'] = 0;
//         transformed.push(newEntry);
//         // curr = moment(curr).add(moment(bucket.et).diff(bucket.st), 'hours');
//       } else {
//         newEntry['Plan Start Date'] = curr;
//         newEntry['Plan End Date'] = moment(curr).add(bucket.differnce, 'hours');
//         newEntry['status'] = 1;
//         transformed.push(newEntry);

//       }
//       curr = moment(curr).add(bucket.differnce, 'hours')

//     }
//     // }

//   });
// }





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
// processFiles(fullFileName)
