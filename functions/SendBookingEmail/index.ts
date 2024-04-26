import {
  DynamoDB,
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';

import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const sesClient = new SESv2Client({
  region: 'us-east-1',
});

export const handler = async (event: {
  detail: {
    flightId: string;
    seats: string[];
    username: string;
  };
}): Promise<void> => {
  const { flightId, seats } = event.detail;
  const senderEmail = 'duck_soop@outlook.com';
  const templateName = 'BookingReceiptTemplate';
  const userData = await getUser(event.detail.username);
  const useremail = userData[0].email;

  console.log(useremail);

  try {
    const response = await sesClient.send(
      new SendEmailCommand({
        FromEmailAddress: senderEmail,
        Content: {
          Template: {
            TemplateName: templateName,
            TemplateData: JSON.stringify({
              flightId,
              seats,
            }),
          },
        },
        Destination: {
          ToAddresses: [useremail],
        },
      })
    );
    console.log({ response });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getUser = async (username: string) => {
  const ddbClient = new DynamoDBClient({
    region: 'us-east-1',
  });
  const command = new QueryCommand({
    TableName: 'Users',
    IndexName: 'usernameIndex',
    KeyConditionExpression: '#DDB_username = :pkey',
    ExpressionAttributeNames: {
      '#DDB_username': 'username',
    },
    ExpressionAttributeValues: {
      ':pkey': { S: username },
    },
  });
  try {
    const response = await ddbClient.send(command);
    return (response.Items || []).map((i) => unmarshall(i)) as any;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
