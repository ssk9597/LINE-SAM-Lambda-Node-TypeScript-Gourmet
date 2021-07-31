// Load the package
import { TextMessage } from '@line/bot-sdk';

export const errorTemplate = (): Promise<TextMessage> => {
  return new Promise((resolve, reject) => {
    const params: TextMessage = {
      type: 'text',
      text: 'ごめんなさい、このメッセージには対応していません',
    };

    resolve(params);
  });
};
