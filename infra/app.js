// infra/app.js
/**
 * CDK entry point. `npx cdk synth` and `npx cdk deploy` run this file.
 *
 * It creates the CDK app and one stack. The account and region are not set here,
 * so the CDK CLI uses your current AWS profile.
 */
import * as cdk from 'aws-cdk-lib';
import { ShortLinkStack } from './stack.js';

const app = new cdk.App();

new ShortLinkStack(app, 'ShortLinkStack');
