import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';

export class DatabaseStack extends cdk.Stack {
  public readonly usersTable: Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.usersTable = new Table(this, 'UsersTable', {
      partitionKey: {
        name: 'UserID',
        type: AttributeType.STRING,
      },
      tableName: 'Users',
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.usersTable.addGlobalSecondaryIndex({
      indexName: 'usernameIndex',
      partitionKey: {
        name: 'username',
        type: AttributeType.STRING,
      },
    });
  }
}
