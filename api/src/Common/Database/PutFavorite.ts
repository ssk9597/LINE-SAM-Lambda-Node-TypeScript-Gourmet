// Load the package
import aws from 'aws-sdk';

// Create DynamoDB document client
const docClient = new aws.DynamoDB.DocumentClient();

export const putFavorite = (
  data: string,
  timestamp: number,
  userId: string | undefined,
  googleMapApi: string
) => {
  return new Promise((resolve, reject) => {
    //
    const dataArray = data.split('&');
    const lat = dataArray[0].split('=')[1];
    const lng = dataArray[1].split('=')[1];
    const name = dataArray[2].split('=')[1];
    const photo = dataArray[3].split('=')[1];
    const rating = dataArray[4].split('=')[1];
    const vicinity = dataArray[5].split('=')[1];

    // Create a URL for a store photo
    const photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo}&key=${googleMapApi}`;

    // Create a URL for the store details
    const encodeURI = encodeURIComponent(`${name} ${vicinity}`);
    const storeDetailsURL = `https://maps.google.co.jp/maps?q=${encodeURI}&z=15&iwloc=A`;

    // Create a URL for store routing information
    const storeRoutingURL = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    const params = {
      Item: {
        user_id: userId,
        timestamp: timestamp,
        photo_url: photoURL,
        name: name,
        rating: rating,
        store_details_url: storeDetailsURL,
        store_routing_url: storeRoutingURL,
      },
      ReturnConsumedCapacity: 'TOTAL',
      TableName: 'Gourmets_Favorite',
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
