// Load the package
import axios, { AxiosResponse } from 'axios';

// Load the module
import { getDatabaseInfo } from './GetDatabaseInfo';

export const getGourmetInfo = async (user_id: string | undefined, googleMapApi: string) => {
  return new Promise(async (resolve, reject) => {
    // modules getDatabaseInfo
    const data: any = await getDatabaseInfo(user_id);
    const isCar = data.Item.is_car.S;
    const latitude = data.Item.latitude.N;
    const longitude = data.Item.longitude.N;

    // Bifurcate the radius value depending on whether you are driving or walking
    let radius = 0;
    if (isCar === '車') {
      radius = 1400;
    } else {
      radius = 800;
    }

    let gourmetArray: any[] = [];

    new Promise(async (resolve) => {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${googleMapApi}&language=ja`;
      const gourmets: AxiosResponse<any> = await axios.get(url);

      const gourmetData = gourmets.data.results;
      gourmetArray = gourmetArray.concat(gourmetData);

      const pageToken = gourmets.data.next_page_token;
      resolve(pageToken);
    })
      .then((value) => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${googleMapApi}&language=ja&pagetoken=${value}`;
            const gourmets = await axios.get(url);

            const gourmetData = gourmets.data.results;
            gourmetArray = gourmetArray.concat(gourmetData);

            const pageToken = gourmets.data.next_page_token;
            resolve(pageToken);
          }, 2000);
        });
      })
      .then((value) => {
        setTimeout(async () => {
          const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${googleMapApi}&language=ja&pagetoken=${value}`;
          const gourmets = await axios.get(url);

          const gourmetData = gourmets.data.results;
          gourmetArray = gourmetArray.concat(gourmetData);
        }, 2000);
      });

    setTimeout(() => {
      resolve(gourmetArray);
    }, 8000);
  });
};
