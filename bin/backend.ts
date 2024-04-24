#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';

const app = new cdk.App();
const dbStack = new DatabaseStack(app, 'DatabaseStack');
