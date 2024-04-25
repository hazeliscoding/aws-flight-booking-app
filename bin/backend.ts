#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';
import { ComputeStack } from '../lib/compute-stack';

const app = new cdk.App();
const dbStack = new DatabaseStack(app, 'DatabaseStack');
const computeStack = new ComputeStack(app, 'ComputeStack', {
  usersTable: dbStack.usersTable,
});
