// Load the module
import { formatGourmetArray } from './FormatGourmetArray';

// types
import { GourmetData, GourmetDataArray } from './types/SortRatingGourmetArray.type';

export const sortRatingGourmetArray = async (
  user_id: string | undefined,
  googleMapApi: string
): Promise<GourmetDataArray> => {
  return new Promise(async (resolve, reject) => {
    try {
      // modules formatGourmetArray
      const gourmetArray: GourmetDataArray = await formatGourmetArray(user_id, googleMapApi);

      // Sort by rating
      gourmetArray.sort((a: GourmetData, b: GourmetData) => b.rating - a.rating);

      // narrow it down to 10 stores.
      const sortGourmetArray: GourmetDataArray = gourmetArray.slice(0, 10);
      resolve(sortGourmetArray);
    } catch (err) {
      reject(err);
    }
  });
};
