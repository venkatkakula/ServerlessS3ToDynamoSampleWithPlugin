'use strict';
/*
 * Plugin to upload a test csv file to S3
 * Ensure that the test file has three columns representing [ID, Name and Data]
 * This plugin needs the aws-sdk module installed in order to be able to upload file to S3
 */

const AWS = require('aws-sdk');
const path = require("path");
const s3 = new AWS.S3();
const fs = require('fs');

class UploadDataPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.commands = {
      uploadFile: {
        usage: 'Uploads a file to S3 bucket',
        lifecycleEvents: ['upload'],
        options: {
          filepath: {
            usage:
              'Specify the CSV file that is to be uploaded to S3 to be eventually written to Dynamo ' +
              '(e.g. "--uploadFile \'completePathToFile\'" or "-u \'completePathToFile\'")',
            required: true,
            shortcut: 'u',
          },
        },
      },
    };

    this.hooks = {
      'uploadFile:upload': this.uploadToS3.bind(this)
    };
  }

  uploadToS3() {
    this.serverless.cli.log(`File To Be Uploaded: ${this.options.filepath}`);
    let s3Key = path.basename(this.options.filepath);
    fs.readFile(this.options.filepath, function (err, data) {
      if (err) { throw err; }
      s3.putObject({
        Bucket: 'serverlesstests3todynamo1010',
        Key: path.basename(s3Key),
        Body: data
      },function (resp) {
        console.log(arguments);
        console.log('Successfully uploaded data file');
      });
    });
  }
}

module.exports = UploadDataPlugin;