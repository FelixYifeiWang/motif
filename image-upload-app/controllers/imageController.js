// controllers/imageController.js
const dynamodb = require('../config/dynamoConfig');

// Function to save image data
const saveImageData = async (userId, imageUrl) => {
  const params = {
    TableName: 'lookbook-users', // DynamoDB table name
    Item: {
      user_id: userId,
      image_url: imageUrl,
      register_time: new Date().toISOString(),
    },
  };
  try {
    await dynamodb.put(params).promise();
    console.log('Image saved successfully');
  } catch (error) {
    console.error('Error saving image:', error);
  }
};

// Function to retrieve images by user ID
const getUserImages = async (userId) => {
  const params = {
    TableName: 'lookbook-users',
    KeyConditionExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ':user_id': userId,
    },
  };
  try {
    const data = await dynamodb.query(params).promise();
    return data.Items;
  } catch (error) {
    console.error('Error retrieving images:', error);
    return [];
  }
};

module.exports = {
  saveImageData,
  getUserImages,
};

