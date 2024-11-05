// config/dynamoConfig.js
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' }); // Replace 'your-region' with your AWS region

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamodb;

