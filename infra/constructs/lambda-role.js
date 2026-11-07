// infra/constructs/lambda-role.js
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * LambdaRole is the IAM role one Lambda function runs as (ADR 0017).
 *
 * It extends the CDK Role and sets the parts every function needs:
 *   - Lambda can assume it.
 *   - It can write logs to CloudWatch, and nothing else.
 *
 * Pass a table and an access level to give the function table access:
 *   - access 'read' (the default) for list and redirect.
 *   - access 'write' for create and delete.
 * Each function gets its own role, with only the access it needs (ADR 0017).
 */
export class LambdaRole extends iam.Role {
  /**
   * @param {import('constructs').Construct} scope The parent construct (the stack).
   * @param {string} id The construct id. Must be unique inside the scope.
   * @param {object} [options]
   * @param {import('aws-cdk-lib/aws-dynamodb').ITable} [options.table] The table the function reads or writes.
   * @param {'read' | 'write'} [options.access='read'] The table access the function needs.
   * @param {iam.RoleProps} [options.props] Optional overrides for the Role defaults.
   */
  constructor(scope, id, { table, access = 'read', props = {} } = {}) {
    super(scope, id, {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
      ...props,
    });

    if (table) {
      if (access === 'write') {
        table.grantReadWriteData(this);
      } else if (access === 'read') {
        table.grantReadData(this);
      } else {
        throw new Error(`LambdaRole access must be 'read' or 'write', got '${access}'`);
      }
    }
  }
}
