// Load the package
import aws from 'aws-sdk';

// Create DynamoDB document client
const docClient = new aws.DynamoDB.DocumentClient();

export const putLocation = (userId: string | undefined, latitude: string, longitude: string) => {
  return new Promise((resolve, reject) => {
    const params = {
      Item: {
        user_id: userId,
        latitude: latitude,
        longitude: longitude,
      },
      ReturnConsumedCapacity: 'TOTAL',
      TableName: 'Gourmets',
    };

    docClient.put(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
