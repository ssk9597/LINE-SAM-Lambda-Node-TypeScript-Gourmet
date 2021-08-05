// Load the package
import aws from 'aws-sdk';

// Create DynamoDB document client
const docClient = new aws.DynamoDB.DocumentClient();

export const getDatabaseInfo = async (userId: string | undefined) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'Gourmets',
      Key: {
        user_id: userId,
      },
    };

    docClient.get(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
