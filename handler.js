'use strict';

const AWS = require('aws-sdk');
const readline = require('readline');

const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB({maxRetries: 5, retryDelayOptions: {base: 300} });
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.postprocess = (event) => {

	event.Records.forEach((record) => {
    let items = [];
    const s3ObjParams = {Bucket: record.s3.bucket.name, Key: record.s3.object.key};	
    const rl = readline.createInterface({
      input: s3.getObject(s3ObjParams).createReadStream()
    });

    rl.on('line', function(line) {
      console.log('Read line - ' + line); 
      let itemAttributes = line.split(',');
      console.log('Split line - ' + itemAttributes[2]); 

		  items.push({
        PutRequest: {
          Item: {
            Identifier: itemAttributes[0],
            Name: itemAttributes[1],
            Data: itemAttributes[2]
          }
        }
      });
    })
    .on('close', function() {
      console.log('Read File');
      let requests = [];

      items.forEach(function(item) {
          requests.push(item);
          if(requests.length == 25) { 
            insertIntoDynamo(requests);
            requests = []; 
          }
      });

      if(requests.length > 0) {
        insertIntoDynamo(requests);
      }
    });    
	});
};

function insertIntoDynamo(items) {
  let ddb_params = {
    RequestItems: {
        'S3_TO_DYNAMO_TABLE': items 
    }
  };

  documentClient.batchWrite(ddb_params, function(err, data) {
    if (err) {
        console.log(err);
    } else {
      console.log('Inserted '+ items.length + ' into dynamo');
    }
  });
}
