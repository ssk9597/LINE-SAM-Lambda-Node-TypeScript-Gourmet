// Load the package
import { FlexMessage, FlexCarousel, FlexBubble } from '@line/bot-sdk';

// Load the module
import { queryDatabaseInfo } from './QueryDatabaseInfo';

// types
import { Item, QueryItem } from './types/MakeFlexMessage.type';

export const makeFlexMessage = async (userId: string | undefined): Promise<FlexMessage> => {
  return new Promise(async (resolve, reject) => {
    try {
      // modules queryDatabaseInfo
      const query: any = await queryDatabaseInfo(userId);
      const queryItem: QueryItem = query.Items;

      // FlexMessage
      const FlexMessageContents: FlexBubble[] = await queryItem.map((item: Item) => {
        const flexBubble: FlexBubble = {
          type: 'bubble',
          hero: {
            type: 'image',
            url: item.photo_url,
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
                text: item.name,
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
                    text: `${item.rating}`,
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
                  uri: item.store_details_url,
                },
              },
              {
                type: 'button',
                action: {
                  type: 'uri',
                  label: '店舗案内',
                  uri: item.store_routing_url,
                },
              },
              {
                type: 'button',
                action: {
                  type: 'postback',
                  label: '行きつけを解除',
                  data: `timestamp=${item.timestamp}`,
                  displayText: '行きつけを解除する',
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
        altText: 'お気に入りのお店',
        contents: flexContainer,
      };

      resolve(flexMessage);
    } catch (err) {
      reject(err);
    }
  });
};
