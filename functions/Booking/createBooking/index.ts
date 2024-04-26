import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const eventBridgeClient = new EventBridgeClient({
  region: 'us-east-1',
});

export const createBooking = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No data provided.',
      }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { flightId, seats, username } = body;
    if (!flightId || !seats || !Array.isArray(seats)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid data format.',
        }),
      };
    }

    const bookings = await Promise.all(
      seats.map((seatId) => getBooking(flightId, seatId, ddbClient))
    );

    if (bookings.some((booking) => booking === 'True')) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'One or more seats are booked.',
        }),
      };
    }

    await eventBridgeClient.send(
      new PutEventsCommand({
        Entries: [
          {
            Source: 'bookFlight',
            DetailType: 'flightBooked',
            EventBusName: 'FlightBookingEventBus',
            Detail: JSON.stringify({
              flightId,
              seats,
              username,
            }),
          },
        ],
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Seats Booking Initiated' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error occurred.',
      }),
    };
  }
};

const getBooking = async (
  flightId: string,
  seatId: string,
  ddbClient: DynamoDBClient
): Promise<string> => {
  try {
    const params = {
      TableName: 'SeatBooking',
      Key: {
        FlightID: { S: flightId },
        SeatID: { S: seatId },
      },
    };

    const response = await ddbClient.send(new GetItemCommand(params));
    return response.Item?.IsBooked?.S || '';
  } catch (e) {
    console.error(e);
    throw e;
  }
};
