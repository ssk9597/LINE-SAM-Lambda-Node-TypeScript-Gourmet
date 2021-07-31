// Load the package
import aws from 'aws-sdk';

// DynamoDB
const dynamodb = new aws.DynamoDB();

export const putLocation = (userId: string | undefined, latitude: string, longitude: string) => {
  return new Promise((resolve, reject) => {
    const params = {
      Item: {
        user_id: {
          S: userId,
        },
        latitude: {
          N: latitude,
        },
        longitude: {
          N: longitude,
        },
      },
      ReturnConsumedCapacity: 'TOTAL',
      TableName: 'Gourmets',
    };

    dynamodb.putItem(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
