#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';
import { ComputeStack } from '../lib/compute-stack';
import { AuthStack } from '../lib/auth-stack';
import { ApiStack } from '../lib/api-stack';
import { EventBridgeStack } from '../lib/eventbus-stack';

const app = new cdk.App();

// Determine the environment from a command-line argument or environment variable
const environment = process.env.ENV || 'dev'; // Default to 'dev' if not specified

// Stack names include the environment
const dbStack = new DatabaseStack(app, `FBS-${environment}-DatabaseStack`);
const computeStack = new ComputeStack(app, `FBS-${environment}-ComputeStack`, {
  usersTable: dbStack.usersTable,
  seatsTable: dbStack.seatsTable,
  flightTable: dbStack.flightsTable,
});
const authStack = new AuthStack(app, `FBS-${environment}-AuthStack`, {
  addUserPostConfirmation: computeStack.addUserToTableFunc,
});
const apiStack = new ApiStack(app, `FBS-${environment}-ApiStack`, {
  bookingLambdaIntegration: computeStack.bookingLambdaIntegration,
  userPool: authStack.userPool,
});
const eventStack = new EventBridgeStack(
  app,
  `FBS-${environment}-EventBridgeStack`,
  {
    syncFlights: computeStack.syncFlightRuleFunc,
    registerBooking: computeStack.registerBookingFunc,
    emailReceipt: computeStack.sendEmailFunc,
  }
);
