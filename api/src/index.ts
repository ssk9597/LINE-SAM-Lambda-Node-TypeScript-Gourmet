// Load the package
import { ClientConfig, Client, WebhookEvent } from '@line/bot-sdk';
import aws from 'aws-sdk';

// Load the module
// TemplateMessage
import { yourLocationTemplate } from './Common/TemplateMessage/YourLocation';
import { errorTemplate } from './Common/TemplateMessage/Error';
import { isCarTemplate } from './Common/TemplateMessage/IsCar';
// Database
import { putLocation } from './Common/Database/PutLocation';
import { updateIsCar } from './Common/Database/UpdateIsCar';

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

exports.handler = async (event: any, context: any) => {
  // Retrieving values in the SSM parameter store
  const CHANNEL_ACCESS_TOKEN: any = await ssm
    .getParameter(LINE_GOURMET_CHANNEL_ACCESS_TOKEN)
    .promise();
  const CHANNEL_SECRET: any = await ssm.getParameter(LINE_GOURMET_CHANNEL_SECRET).promise();

  const channelAccessToken: string = CHANNEL_ACCESS_TOKEN.Parameter.Value;
  const channelSecret: string = CHANNEL_SECRET.Parameter.Value;

  // Create a client using the SSM parameter store
  const clientConfig: ClientConfig = {
    channelAccessToken: channelAccessToken,
    channelSecret: channelSecret,
  };
  const client = new Client(clientConfig);

  // body
  const body: any = JSON.parse(event.body);
  const response: WebhookEvent = body.events[0];

  // action
  try {
    console.log('debug: ' + JSON.stringify(response));
    await actionLocationOrError(client, response);
    await actionIsCar(client, response);
    await actionFlexMessage(client, response);
  } catch (err) {
    console.log(err);
  }
};

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
    if (text === 'お店を探す') {
      await client.replyMessage(replyToken, yourLocation);
    } else if (text === '車' || text === '徒歩') {
      return;
    } else {
      await client.replyMessage(replyToken, error);
    }
  } catch (err) {
    console.log(err);
  }
};

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

const actionFlexMessage = async (client: Client, event: WebhookEvent) => {
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
    if (isCar === '車' || isCar === '徒歩') {
      // Register userId, isCar in DynamoDB
      await updateIsCar(userId, isCar);
    } else {
      return;
    }
  } catch (err) {
    console.log(err);
  }
};
