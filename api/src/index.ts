// Load the package
import { ClientConfig, Client, WebhookEvent } from '@line/bot-sdk';
import aws from 'aws-sdk';

// Load the module
// TemplateMessage
import { yourLocationTemplate } from './Common/TemplateMessage/YourLocation';
import { errorTemplate } from './Common/TemplateMessage/Error';
import { isCarTemplate } from './Common/TemplateMessage/IsCar';
import { createFlexMessage } from './Common/TemplateMessage/Gourmet/CreateFlexMessage';
import { makeFlexMessage } from './Common/TemplateMessage/Favorite/MakeFlexMessage';
// Database
import { putLocation } from './Common/Database/PutLocation';
import { updateIsCar } from './Common/Database/UpdateIsCar';
import { putFavorite } from './Common/Database/PutFavorite';
import { deleteFavorite } from './Common/Database/DeleteFavorite';

// SSM
const ssm = new aws.SSM();
const LINE_GOURMET_CHANNEL_ACCESS_TOKEN = {
  Name: 'LINE_GOURMET_CHANNEL_ACCESS_TOKEN',
  WithDecryption: false,
};
const LINE_GOURMET_CHANNEL_SECRET = {
  Name: 'LINE_GOURMET_CHANNEL_SECRET',
  WithDecryption: false,
};
const LINE_GOURMET_GOOGLE_MAP_API = {
  Name: 'LINE_GOURMET_GOOGLE_MAP_API',
  WithDecryption: false,
};

exports.handler = async (event: any, context: any) => {
  // Retrieving values in the SSM parameter store
  const CHANNEL_ACCESS_TOKEN: any = await ssm
    .getParameter(LINE_GOURMET_CHANNEL_ACCESS_TOKEN)
    .promise();
  const CHANNEL_SECRET: any = await ssm.getParameter(LINE_GOURMET_CHANNEL_SECRET).promise();
  const GOOGLE_MAP_API: any = await ssm.getParameter(LINE_GOURMET_GOOGLE_MAP_API).promise();

  const channelAccessToken: string = CHANNEL_ACCESS_TOKEN.Parameter.Value;
  const channelSecret: string = CHANNEL_SECRET.Parameter.Value;
  const googleMapApi: string = GOOGLE_MAP_API.Parameter.Value;

  // Create a client using the SSM parameter store
  const clientConfig: ClientConfig = {
    channelAccessToken: channelAccessToken,
    channelSecret: channelSecret,
  };
  const client = new Client(clientConfig);

  // body
  const body: any = JSON.parse(event.body);
  const response: WebhookEvent = body.events[0];
  // console.log(JSON.stringify(response));

  // action
  try {
    await actionLocationOrError(client, response);
    await actionIsCar(client, response);
    await actionFlexMessage(client, response, googleMapApi);
    await actionPutFavoriteShop(response, googleMapApi);
    await actionTapFavoriteShop(client, response);
    await actionDeleteFavoriteShop(response);
  } catch (err) {
    console.log(err);
  }
};

// ?????????????????????????????????????????????????????????
const actionLocationOrError = async (client: Client, event: WebhookEvent): Promise<void> => {
  try {
    // If the message is different from the target, returned
    if (event.type !== 'message' || event.message.type !== 'text') {
      return;
    }

    // Retrieve the required items from the event
    const replyToken = event.replyToken;
    const text = event.message.text;

    // modules
    const yourLocation = await yourLocationTemplate();
    const error = await errorTemplate();

    // Perform a conditional branch
    if (text === '???????????????') {
      await client.replyMessage(replyToken, yourLocation);
    } else if (text === '???' || text === '??????') {
      return;
    } else if (text === '?????????????????????') {
      return;
    } else {
      await client.replyMessage(replyToken, error);
    }
  } catch (err) {
    console.log(err);
  }
};

// ?????????????????????????????????????????????????????????????????????????????????
const actionIsCar = async (client: Client, event: WebhookEvent): Promise<void> => {
  try {
    // If the message is different from the target, returned
    if (event.type !== 'message' || event.message.type !== 'location') {
      return;
    }

    // Retrieve the required items from the event
    const replyToken = event.replyToken;
    const userId = event.source.userId;
    const latitude: string = String(event.message.latitude);
    const longitude: string = String(event.message.longitude);

    // Register userId, latitude, and longitude in DynamoDB
    await putLocation(userId, latitude, longitude);

    // modules
    const isCar = await isCarTemplate();

    // Send a two-choice question
    await client.replyMessage(replyToken, isCar);
  } catch (err) {
    console.log(err);
  }
};

// ???????????????????????????????????????????????????Flex Message???????????????
const actionFlexMessage = async (client: Client, event: WebhookEvent, googleMapApi: string) => {
  try {
    // If the message is different from the target, returned
    if (event.type !== 'message' || event.message.type !== 'text') {
      return;
    }

    // Retrieve the required items from the event
    const replyToken = event.replyToken;
    const userId = event.source.userId;
    const isCar = event.message.text;

    // Perform a conditional branch
    if (isCar === '???' || isCar === '??????') {
      // Register userId, isCar in DynamoDB
      await updateIsCar(userId, isCar);
      const flexMessage = await createFlexMessage(userId, googleMapApi);
      if (flexMessage === undefined) {
        return;
      }
      await client.replyMessage(replyToken, flexMessage);
    } else {
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

// FlexMessage????????????????????????????????????????????????????????????????????????
const actionPutFavoriteShop = async (event: WebhookEvent, googleMapApi: string) => {
  try {
    // If the message is different from the target, returned
    if (event.type !== 'postback') {
      return;
    }

    // Retrieve the required items from the event
    const data = event.postback.data;
    const timestamp = event.timestamp;
    const userId = event.source.userId;

    // conditional branching
    const isFavorite = data.indexOf('timestamp');
    if (isFavorite === -1) {
      // Register data, userId in DynamoDB
      await putFavorite(data, timestamp, userId, googleMapApi);
    }
  } catch (err) {
    console.log(err);
  }
};

// ?????????????????????????????????????????????????????????????????????????????????????????????
const actionTapFavoriteShop = async (client: Client, event: WebhookEvent) => {
  // If the message is different from the target, returned
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  // Retrieve the required items from the event
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const text = event.message.text;

  if (text === '?????????????????????') {
    const flexMessage = await makeFlexMessage(userId);
    if (flexMessage === undefined) {
      return;
    }
    await client.replyMessage(replyToken, flexMessage);
  } else {
    return;
  }
};

// FlexMessage??????????????????????????????????????????????????????????????????DB?????????????????????
const actionDeleteFavoriteShop = async (event: WebhookEvent) => {
  try {
    // If the message is different from the target, returned
    if (event.type !== 'postback') {
      return;
    }

    // Retrieve the required items from the event
    const data = event.postback.data;
    const userId = event.source.userId;

    // conditional branching
    const isFavorite = data.indexOf('timestamp');
    if (isFavorite !== -1) {
      // Delete Gourmets_Favorite
      await deleteFavorite(data, userId);
    }
  } catch (err) {
    console.log(err);
  }
};
