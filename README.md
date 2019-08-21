# ServerlessS3ToDynamoSampleWithPlugin

This example demonstrates a basic serverless function that reads CSV formatted files 
from S3 andthen populates the data into dynamo. 

This example eschews in depth validation and possible edge cases such as lambda timeouts, very large data files etc 
in favor of simplicity. This project could be extended as applicable to a specific use case; besides the fact that 
it is best to control such cases at the source. This project assumes that the data files are of manageable size and 
do not contain errors. In real applications, it could be extended to account for those possibilities. 

##Pre-Requisites
Prior to the test, please ensure that and AWS account is linked to the workspace. 
This account will become the target of generated resources - S3 bucket, Lambda and a Dynamo table. 

The plugin included in the plugins folder depends on 'aws-sdk' module. 
Run 'npm install aws-sdk' to ensure it is installed. 

##Deployment
Run 'serverless deploy' to deploy resources and install the Lambda. 

##Post Deployment
Ensure that a test CSV file is available to test. It should contain three columns -ID, Name and Data - all string types. 
Run 'serverless uploadFile -u {full path to file}'

