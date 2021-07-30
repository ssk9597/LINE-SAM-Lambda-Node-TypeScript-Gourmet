// Load the package
import { ClientConfig, Client, WebhookEvent } from '@line/bot-sdk';
import aws from 'aws-sdk';

// Load the module
import { yourLocationTemplate } from './Common/TemplateMessage/YourLocation';
import { errorMessageTemplate } from './Common/TemplateMessage/ErrorMessage';

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
    await actionLocationOrError(client, response);
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
    const errorMessage = await errorMessageTemplate();

    // Perform a conditional branch
    if (text === 'お店を探す') {
      await client.replyMessage(replyToken, yourLocation);
    } else {
      await client.replyMessage(replyToken, errorMessage);
    }
  } catch (err) {
    console.log(err);
  }
};
