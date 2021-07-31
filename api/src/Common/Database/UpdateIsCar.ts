// Load the package
import aws from 'aws-sdk';

// DynamoDB
const dynamodb = new aws.DynamoDB();

export const updateIsCar = (userId: string | undefined, isCar: string) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'Gourmets',
      Key: {
        user_id: {
          S: userId,
        },
      },
      ExpressionAttributeNames: {
        '#IC': 'is_car',
      },
      ExpressionAttributeValues: {
        ':i': {
          S: isCar,
        },
      },
      UpdateExpression: 'SET #IC = :i',
    };

    dynamodb.updateItem(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
