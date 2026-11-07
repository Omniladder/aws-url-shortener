// infra/constructs/links-table.js
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

/**
 * LinksTable is the DynamoDB table that stores every short link (ADR 0018).
 *
 * It extends the CDK Table and sets the parts the app needs:
 *   - Partition key `shortCode`, so a short code is unique (ADR 0005, ADR 0018).
 *   - On-demand billing, so the workshop pays only for requests.
 *   - A global secondary index `byUser` on `userId` and `createdAt`, so the
 *     dashboard can list one user's links with a single Query.
 *   - Removal policy RETAIN, so `cdk destroy` keeps the links.
 *
 * Grant Lambda access with LambdaRole, which takes this table (ADR 0017).
 */
export class LinksTable extends dynamodb.Table {
  /**
   * @param {import('constructs').Construct} scope The parent construct (the stack).
   * @param {string} id The construct id. Must be unique inside the scope.
   * @param {dynamodb.TableProps} [props] Optional overrides for the defaults below.
   */
  constructor(scope, id, props = {}) {
    super(scope, id, {
      partitionKey: { name: 'shortCode', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      ...props,
    });

    // Lets the dashboard list one user's links. Each link has a userId and a createdAt.
    this.addGlobalSecondaryIndex({
      indexName: 'byUser',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
    });
  }
}
