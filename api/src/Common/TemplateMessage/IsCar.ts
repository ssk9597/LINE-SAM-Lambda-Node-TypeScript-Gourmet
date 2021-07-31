// Load the package
import { TemplateMessage } from '@line/bot-sdk';

export const isCarTemplate = (): Promise<TemplateMessage> => {
  return new Promise((resolve, reject) => {
    const params: TemplateMessage = {
      type: 'template',
      altText: 'あなたの移動手段は？',
      template: {
        type: 'confirm',
        text: 'あなたの移動手段は?',
        actions: [
          {
            type: 'message',
            label: '車',
            text: '車',
          },
          {
            type: 'message',
            label: '徒歩',
            text: '徒歩',
          },
        ],
      },
    };

    resolve(params);
  });
};
