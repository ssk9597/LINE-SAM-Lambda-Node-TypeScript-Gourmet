// Load the package
import aws from 'aws-sdk';

// Create DynamoDB document client
const docClient = new aws.DynamoDB.DocumentClient();

export const updateIsCar = (userId: string | undefined, isCar: string) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'Gourmets',
      Key: {
        user_id: userId,
      },
      UpdateExpression: 'SET is_car = :i',
      ExpressionAttributeValues: {
        ':i': isCar,
      },
    };

    docClient.update(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
