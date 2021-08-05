// Load the package
import { FlexMessage, FlexCarousel, FlexBubble } from '@line/bot-sdk';

// Load the module
import { sortRatingGourmetArray } from './SortRatingGourmetArray';

// types
import { Gourmet, RatingGourmetArray } from './types/CreateFlexMessage.type';

export const createFlexMessage = async (
  user_id: string | undefined,
  googleMapApi: string
): Promise<FlexMessage | undefined> => {
  return new Promise(async (resolve, reject) => {
    try {
      // modules sortRatingGourmetArray
      const ratingGourmetArray: RatingGourmetArray = await sortRatingGourmetArray(
        user_id,
        googleMapApi
      );

      // FlexMessage
      const FlexMessageContents: FlexBubble[] = await ratingGourmetArray.map((gourmet: Gourmet) => {
        // Create a URL for a store photo
        const photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${gourmet.photo_reference}&key=${googleMapApi}`;

        // Create a URL for the store details
        const encodeURI = encodeURIComponent(`${gourmet.name} ${gourmet.vicinity}`);
        const storeDetailsURL = `https://maps.google.co.jp/maps?q=${encodeURI}&z=15&iwloc=A`;

        // Create a URL for store routing information
        const storeRoutingURL = `https://www.google.com/maps/dir/?api=1&destination=${gourmet.geometry_location_lat},${gourmet.geometry_location_lng}`;

        const flexBubble: FlexBubble = {
          type: 'bubble',
          hero: {
            type: 'image',
            url: photoURL,
            size: 'full',
            aspectMode: 'cover',
            aspectRatio: '20:13',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: gourmet.name,
                size: 'xl',
                weight: 'bold',
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'icon',
                    url:
                      'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png',
                    size: 'sm',
                  },
                  {
                    type: 'text',
                    text: `${gourmet.rating}`,
                    size: 'sm',
                    margin: 'md',
                    color: '#999999',
                  },
                ],
                margin: 'md',
              },
            ],
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                action: {
                  type: 'uri',
                  label: '店舗詳細',
                  uri: storeDetailsURL,
                },
              },
              {
                type: 'button',
                action: {
                  type: 'uri',
                  label: '店舗案内',
                  uri: storeRoutingURL,
                },
              },
            ],
            spacing: 'sm',
          },
        };

        return flexBubble;
      });

      const flexContainer: FlexCarousel = {
        type: 'carousel',
        contents: FlexMessageContents,
      };

      const flexMessage: FlexMessage = {
        type: 'flex',
        altText: '近隣の美味しいお店10店ご紹介',
        contents: flexContainer,
      };

      resolve(flexMessage);
    } catch (err) {
      reject(err);
    }
  });
};
