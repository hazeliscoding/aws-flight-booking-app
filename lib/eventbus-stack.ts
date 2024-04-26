import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { EventBus, Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

interface EventBridgeStackProps extends cdk.StackProps {
  registerBooking: NodejsFunction;
  emailReceipt: NodejsFunction;
  syncFlights: NodejsFunction;
}

export class EventBridgeStack extends cdk.Stack {
  public readonly eventBus: EventBus;
  
  constructor(scope: Construct, id: string, props: EventBridgeStackProps) {
    super(scope, id, props);

    this.eventBus = new EventBus(this, 'EventBus', {
      eventBusName: 'FlightBookingEventBus',
    });
    const bookFlightRule = new Rule(this, 'BookFlightRule', {
      eventBus: this.eventBus,
      eventPattern: {
        source: ['bookFlight'],
        detailType: ['flightBooked'],
      },
    });

    bookFlightRule.addTarget(new LambdaFunction(props.registerBooking));
    // bookFlightRule.addTarget(new LambdaFunction(props.emailReceipt));

    const syncFlightRule = new Rule(this, 'SyncFlightRule', {
      schedule: Schedule.rate(cdk.Duration.days(1)),
    });
    // syncFlightRule.addTarget(new LambdaFunction(props.syncFlights));
  }
}
