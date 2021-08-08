// Load the package
import aws from 'aws-sdk';

// Create DynamoDB document client
const docClient = new aws.DynamoDB.DocumentClient();

export const deleteFavorite = (data: string, userId: string | undefined) => {
  return new Promise((resolve, reject) => {
    // data
    const timestamp: number = Number(data.split('=')[1]);

    const params = {
      TableName: 'Gourmets_Favorite',
      Key: {
        user_id: userId,
        timestamp: timestamp,
      },
    };

    docClient.delete(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
