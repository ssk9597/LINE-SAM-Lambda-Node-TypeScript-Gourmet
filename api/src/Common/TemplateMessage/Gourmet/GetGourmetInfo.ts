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

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${googleMapApi}&language=ja`;
    console.log(url);

    const gourmets: AxiosResponse<any> = await axios.get(url);
    const gourmetData = gourmets.data.results;
    console.log(gourmetData);
    return gourmetData;
  });
};
