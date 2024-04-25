import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

import path = require('path');
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

interface ComputeStackProps extends cdk.StackProps {
  usersTable: Table;
}

export class ComputeStack extends cdk.Stack {
  readonly addUserToTableFunc: NodejsFunction;
  readonly bookingLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    this.addUserToTableFunc = this.addUserToUsersTable(props);
  }

  addUserToUsersTable(props: ComputeStackProps) {
    const func = new NodejsFunction(this, 'addUserFunc', {
      functionName: 'addUserFun',
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(
        __dirname,
        '../functions/AddUserPostConfirmation/index.ts'
      ),
    });

    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:PutItem'],
        resources: [props.usersTable.tableArn as string],
      })
    );

    return func;
  }
}
