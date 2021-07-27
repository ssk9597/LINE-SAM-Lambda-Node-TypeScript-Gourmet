// import
import aws from 'aws-sdk';

// SSM
const ssm = new aws.SSM();

exports.handler = async (event: any, context: any) => {
  const LINE_GOURMET_CHANNEL_ACCESS_TOKEN = {
    Name: 'LINE_GOURMET_CHANNEL_ACCESS_TOKEN',
    WithDecryption: false,
  };

  const CHANNEL_ACCESS_TOKEN: any = await ssm
    .getParameter(LINE_GOURMET_CHANNEL_ACCESS_TOKEN)
    .promise();

  const channelAccessToken: string = CHANNEL_ACCESS_TOKEN.Parameter.Value;

  console.log('channelAccessToken: ' + channelAccessToken);
};
