// Load the package
import aws from 'aws-sdk';

// DynamoDB
const dynamodb = new aws.DynamoDB();

export const getDatabaseInfo = async (userId: string | undefined) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'Gourmets',
      Key: {
        user_id: {
          S: userId,
        },
      },
    };

    dynamodb.getItem(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
