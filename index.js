"use strict";
var fs = require("fs");
// var request = require("request");
// var utils = require("axiom-utils");
const csv = require("csvtojson");

var moment = require("moment")
var async = require("async")

// var json2csv = require('json2csv');


//Read Files
function readFiles(cb) {
  fs.readdirSync(folder).forEach(file => {
    fileArray.push(file)
  })
  cb()
}
var results = {}
var fullFileName = '/home/anokhi/UserManagement_Insight.csv'

function processFiles(fileName) {
  var jsonObjects = [];

  csv({ includeColumns: [3, 8] }).fromFile(fileName).on('json', (jsonObj) => {

    jsonObjects.push(jsonObj)
  }).on('done', (error) => {


  })





}





/*var saveAsCSV = function(json, k, v, cb) {
    var data = [];
    Object.keys(json).forEach(function(e, i) {
        var tmp = {};
        tmp[k] = e;
        tmp[v] = json[e];
        data.push(tmp);
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
