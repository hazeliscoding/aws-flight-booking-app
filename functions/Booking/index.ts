import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

import { createBooking } from './createBooking';
const ddbClient = new DynamoDBClient({
  region: 'us-east-1',
});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let message: string;

  console.log('CONTEXT');
  console.log({ event });
  console.log(context);
  console.log(context.identity?.cognitoIdentityId);
  try {
    switch (event.httpMethod) {
      case 'POST':
        const postReponse = createBooking(event, ddbClient);
        return postReponse;
      default:
        break;
    }
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify('Posted'),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
  };

  return response;
}

export { handler };
