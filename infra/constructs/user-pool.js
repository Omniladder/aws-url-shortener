// infra/constructs/user-pool.js
import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

/**
 * UserPool is the Cognito user pool that holds the app's accounts (ADR 0019).
 *
 * It extends the CDK UserPool and sets the sign-in rules the app uses:
 *   - Sign in with email and password.
 *   - Passwords must be at least 8 characters.
 *   - The pool is kept on `cdk destroy`, so user accounts are not deleted.
 *
 * Its methods hide the CDK wiring from the stack:
 *   - addWebClient() creates the app's client, which the browser signs in with.
 *   - addAutoConfirm(...) confirms every new account, so sign-up and sign-in happen in one step.
 */
export class UserPool extends cognito.UserPool {
  /**
   * @param {import('constructs').Construct} scope The parent construct (the stack).
   * @param {string} id The construct id. Must be unique inside the scope.
   * @param {cognito.UserPoolProps} [props] Optional overrides for the defaults below.
   */
  constructor(scope, id, props = {}) {
    super(scope, id, {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      standardAttributes: { email: { required: true, mutable: true } },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.NONE,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      ...props,
    });
  }

  /**
   * Creates the app's client. It does not hide whether an email exists, because the
   * register-on-miss flow needs to know (ADR 0019).
   *
   * @returns {cognito.UserPoolClient} The client, whose id goes to config.json.
   */
  addWebClient() {
    return this.addClient('WebClient', {
      authFlows: { userSrp: true },
      generateSecret: false,
      preventUserExistenceErrors: false,
    });
  }

  /**
   * Creates the pre sign-up function that confirms every new account.
   *
   * @param {object} options
   * @param {string} options.code Path to the handler file, relative to the infra folder, such as ../api/auth/auto-confirm.js.
   * @param {string} options.projectRoot The folder esbuild resolves imports from (the repo root).
   * @param {iam.IRole} options.role The IAM role the function runs as.
   * @returns {NodejsFunction} The Lambda function.
   */
  addAutoConfirm({ code, projectRoot, role }) {
    const fn = new NodejsFunction(this, 'AutoConfirmFunction', {
      entry: code,
      handler: 'handler',
      projectRoot,
      runtime: lambda.Runtime.NODEJS_22_X,
      role,
    });
    this.addTrigger(cognito.UserPoolOperation.PRE_SIGN_UP, fn);
    return fn;
  }
}
