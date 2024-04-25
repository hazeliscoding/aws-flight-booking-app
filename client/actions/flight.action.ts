// Usage: AWS_PROFILE=fbs npx ts-node ./script.ts
// Make sure to have @aws-sdk/util-dynamodb and @aws-sdk/client-dynamodb modules installed!
// You can use following command to do so: npm install @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb --save
import {
  DynamoDBClient,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
});

const TableName = "Flights";
export interface FlightType {
  Origin: string;
  Destination: string;
  FlightID: string;
  DepartureTime: Date;
  ArrivalTime: Date;
}
export const fetchFlights = async (
  limit: number = 10
): Promise<FlightType[]> => {
  const command = new ScanCommand({
    TableName,
    Limit: limit,
  });
  try {
    const response = await client.send(command);

    // Unmarshalling DynamoDB items into JS objects and casting to TS types
    return (response.Items || []).map((i) => unmarshall(i)) as FlightType[];
  } catch (error) {
    console.error(
      `Failed to fetch data from DynamoDB. Error: ${JSON.stringify(
        error,
        null,
        2
      )}`
    );

    throw error;
  }
};
export interface SeatDataType {
  SeatID: string;
  IsBooked: string;
  FlightID: string;
}
const SeatBookingTableName = "SeatBooking";

export const fetchSeats = async (flightId: string): Promise<SeatDataType[]> => {
  const command = new QueryCommand({
    TableName: SeatBookingTableName,
    KeyConditionExpression: "#DDB_FlightID = :pkey",
    ExpressionAttributeNames: {
      "#DDB_FlightID": "FlightID",
    },
    ExpressionAttributeValues: {
      ":pkey": { S: flightId },
    },
    Limit: 42,
  });
  try {
    const response = await client.send(command);

    // Unmarshalling DynamoDB items into JS objects and casting to TS types
    return (response.Items || []).map((i) => unmarshall(i)) as SeatDataType[];
  } catch (error) {
    console.error(
      `Failed to fetch data from DynamoDB. Error: ${JSON.stringify(
        error,
        null,
        2
      )}`
    );

    throw error;
  }
};
