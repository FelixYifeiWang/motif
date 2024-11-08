const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const saveUserToDynamoDB = async (user) => {
  const params = {
    TableName: 'Users',
    Item: {
      user_id: user.google_id,
      name: user.name,
      email: user.email,
      join_time: user.join_time,
      styles: user.styles
    },
  };
  try {
    await dynamodb.put(params).promise();
    console.log('User saved successfully');
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

const updateUserStyles = async (user_id, newStyles) => {
  const params = {
    TableName: 'Users',
    Key: { user_id: user_id },
    UpdateExpression: 'set styles = :styles',
    ExpressionAttributeValues: {
      ':styles': newStyles,
    },
    ReturnValues: 'UPDATED_NEW', // Returns the updated attributes
  };

  try {
    const result = await dynamodb.update(params).promise();
    console.log('User styles updated successfully:', result);
  } catch (error) {
    console.error('Error updating user styles:', error);
  }
};

const getUserFromDynamoDB = async (googleId) => {
  const params = {
    TableName: 'Users',
    Key: {
      user_id: googleId
    }
  };

  try {
    const result = await dynamodb.get(params).promise();
    return result.Item || null; // Return user data if found, otherwise null
  } catch (error) {
    console.error('Error fetching user from DynamoDB:', error);
    throw new Error('Could not retrieve user from database');
  }
}

const saveImageData = async (userId, imageId, imageUrl, styles) => {
  const params = {
    TableName: 'Images',
    Item: {
      user_id: userId,
      image_id: imageId,
      image_url: imageUrl,
      upload_date: new Date().toISOString(),
      styles: styles,
    },
  };
  try {
    await dynamodb.put(params).promise();
    console.log('Image saved successfully');
  } catch (error) {
    console.error('Error saving image:', error);
  }
};

const getUserImages = async (userId) => {
  const params = {
    TableName: 'Images',
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

const deleteImageData = async (userId, imageId) => {
  const params = {
    TableName: 'Images',
    Key: {
      user_id: userId,
      image_id: imageId,
    },
  };
  try {
    await dynamodb.delete(params).promise();
    console.log('Image deleted successfully from DynamoDB');
  } catch (error) {
    console.error('Error deleting image from DynamoDB:', error);
  }
};

module.exports = {
  saveUserToDynamoDB,
  getUserFromDynamoDB,
  saveImageData,
  getUserImages,
  deleteImageData,
};


