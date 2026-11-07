// infra/stack.js
import * as cdk from 'aws-cdk-lib';
import { HttpJwtAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PublicApi } from './constructs/gateway.js';
import { LambdaRole } from './constructs/lambda-role.js';
import { LinksTable } from './constructs/links-table.js';
import { UserPool } from './constructs/user-pool.js';

// The repo root, one folder above infra/. The api/ handlers sit there, so esbuild needs it as its root.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * ShortLinkStack holds the AWS resources for sign-in and the site.
 */
export class ShortLinkStack extends cdk.Stack {
  /**
   * @param {import('constructs').Construct} scope The CDK app.
   * @param {string} id The stack name.
   * @param {cdk.StackProps} [props] Standard CDK stack options.
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // Sign-in with email and password (ADR 0019). The user pool is kept on destroy.
    this.userPool = new UserPool(this, 'UserPool');
    this.userPoolClient = this.userPool.addWebClient();
    this.userPool.addAutoConfirm({
      code: '../api/auth/auto-confirm.js',
      projectRoot: repoRoot,
      role: new LambdaRole(this, 'AutoConfirmRole'),
    });

    // The links table (ADR 0018). The table is kept on destroy. Lambda roles get access through LambdaRole.
    this.table = new LinksTable(this, 'LinksTable');

    // The public entry point. It serves the site and config.json, which holds the Cognito ids (ADR 0019).
    this.api = new PublicApi(this, 'PublicApi');
    this.api.addHostingBucket({
      files: '../dist',
      config: {
        userPoolId: this.userPool.userPoolId,
        userPoolClientId: this.userPoolClient.userPoolClientId,
      },
    });

    // The links API (ADR 0017). API Gateway checks the sign-in token (ADR 0019) before each Lambda runs.
    // A token from the app's client has the client id as its audience.
    const authorizer = new HttpJwtAuthorizer('LinksAuthorizer', this.userPool.userPoolProviderUrl, {
      jwtAudience: [this.userPoolClient.userPoolClientId],
    });
    const linkEnvironment = { TABLE_NAME: this.table.tableName };

    this.api.addLambdaRoute({
      code: '../api/links/list.js',
      route: '/api/links',
      method: HttpMethod.GET,
      role: new LambdaRole(this, 'ListLinksRole', { table: this.table, access: 'read' }),
      projectRoot: repoRoot,
      environment: linkEnvironment,
      authorizer,
    });
    this.api.addLambdaRoute({
      code: '../api/links/create.js',
      route: '/api/links',
      method: HttpMethod.POST,
      role: new LambdaRole(this, 'CreateLinkRole', { table: this.table, access: 'write' }),
      projectRoot: repoRoot,
      environment: linkEnvironment,
      authorizer,
    });
    this.api.addLambdaRoute({
      code: '../api/links/delete.js',
      route: '/api/links/{shortCode}',
      method: HttpMethod.DELETE,
      role: new LambdaRole(this, 'DeleteLinkRole', { table: this.table, access: 'write' }),
      projectRoot: repoRoot,
      environment: linkEnvironment,
      authorizer,
    });

    // The public redirect (ADR 0020). Anyone who has the code can use it, so there is no authorizer.
    this.api.addLambdaRoute({
      code: '../api/links/redirect.js',
      route: '/r/{code}',
      method: HttpMethod.GET,
      role: new LambdaRole(this, 'RedirectRole', { table: this.table, access: 'read' }),
      projectRoot: repoRoot,
      environment: linkEnvironment,
    });

    // Printed after `cdk deploy` and shown in the CloudFormation console.
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.apiEndpoint,
      description: 'Public URL of the site (go here in the browser)',
    });
  }
}
