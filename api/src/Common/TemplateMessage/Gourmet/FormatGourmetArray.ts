// Load the module
import { getGourmetInfo } from './GetGourmetInfo';

// types
import { RequiredGourmetArray } from './types/FormatGourmetArray.type';

export const formatGourmetArray = async (user_id: string | undefined, googleMapApi: string) => {
  return new Promise(async (resolve, reject) => {
    // modules getGourmetInfo
    const gourmetInfo: any = await getGourmetInfo(user_id, googleMapApi);

    // Extract only the data you need
    const sufficientGourmetArray: any = gourmetInfo.filter(
      (gourmet: any) => gourmet.photos !== undefined || null
    );

    // Format the data as required
    const requiredGourmetArray: RequiredGourmetArray = sufficientGourmetArray.map(
      (gourmet: any) => {
        return {
          geometry_location_lat: gourmet.geometry.location.lat,
          geometry_location_lng: gourmet.geometry.location.lng,
          name: gourmet.name,
          photo_reference: gourmet.photos[0].photo_reference,
          rating: gourmet.rating,
          vicinity: gourmet.vicinity,
        };
      }
    );
    console.log(requiredGourmetArray);
    resolve(requiredGourmetArray);
  });
};
