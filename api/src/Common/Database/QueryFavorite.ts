// Load the package
import aws from 'aws-sdk';

// Create DynamoDB document client
const docClient = new aws.DynamoDB.DocumentClient();

export const queryFavorite = async (userId: string | undefined) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'Gourmets_Favorite',
      ExpressionAttributeNames: { '#u': 'user_id' },
      ExpressionAttributeValues: { ':val': userId },
      KeyConditionExpression: '#u = :val',
    };

    docClient.query(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(data);
        resolve(data);
      }
    });
  });
};
