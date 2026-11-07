// infra/constructs/gateway.js
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration, HttpUrlIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { HostingBucket } from './hosting-bucket.js';

/**
 * PublicApi is the public entry point for a website and its API (ADR 0017).
 *
 * It extends the CDK HTTP API, so everything a normal HttpApi does still works.
 * Its methods hide the CDK wiring from the stack:
 *   - addHostingBucket(...) serves a built site from an S3 bucket (ADR 0016).
 *   - addLambdaRoute(...) adds one route backed by a Lambda function (ADR 0017).
 */
export class PublicApi extends apigatewayv2.HttpApi {
  /**
   * Creates the hosting bucket, uploads the built site into it, and sends matching
   * requests from this API to the bucket.
   *
   * The bucket is reached through its website endpoint, which is HTTP only. Visitors
   * still use HTTPS to reach the API (ADR 0016).
   *
   * @param {object} options
   * @param {string} options.files Local folder with the built site, such as ../dist.
   * @param {object} [options.config] Values written to config.json next to the site.
   * @param {string} [options.route] The route path to send to the bucket. Defaults to the catch-all `/{proxy+}`.
   */
  addHostingBucket({ files, config = {}, route = '/{proxy+}' }) {
    // The bucket that holds the site. Website hosting and public read are set in HostingBucket.
    this.bucket = new HostingBucket(this, 'SiteBucket');

    // Copies the files from `files` and config.json into the bucket on every deploy.
    new s3deploy.BucketDeployment(this, 'DeploySite', {
      sources: [
        s3deploy.Source.asset(files),
        s3deploy.Source.jsonData('config.json', config),
      ],
      destinationBucket: this.bucket,
    });

    // "/" goes to the bucket root, which serves index.html (the bucket's index document).
    this.addRoutes({
      path: '/',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new HttpUrlIntegration('RootIntegration', this.bucket.bucketWebsiteUrl),
    });

    // Sends each matching request to the same path in the bucket. The {proxy} part
    // of the route is copied into the URL, so /assets/app.js becomes /assets/app.js in the bucket.
    this.addRoutes({
      path: route,
      methods: [apigatewayv2.HttpMethod.ANY],
      integration: new HttpUrlIntegration(
        'SiteIntegration',
        `${this.bucket.bucketWebsiteUrl}/{proxy}`,
      ),
    });
  }

  /**
   * Creates one Lambda function from a handler file and sends one route to it (ADR 0017).
   *
   * @param {object} options
   * @param {string} options.code Path to the handler file, relative to the infra folder, such as ../api/hello.js.
   *   The file must export `handler`. esbuild bundles it with the files it imports.
   * @param {string} options.route The route path, such as /api/items/{id}.
   * @param {string} options.method The HTTP method, such as GET.
   * @param {iam.IRole} options.role The IAM role the function runs as. Each function gets its own role.
   * @param {string} [options.projectRoot] The folder esbuild resolves imports from. Needed when the handler sits outside infra/.
   * @param {Record<string, string>} [options.environment] Environment variables for the function, such as TABLE_NAME.
   * @param {apigatewayv2.IHttpRouteAuthorizer} [options.authorizer] Checks the sign-in token before the function runs (ADR 0019).
   * @returns {NodejsFunction} The Lambda function, in case the stack needs to grant more access.
   */
  addLambdaRoute({ code, route, method, role, projectRoot, environment = {}, authorizer }) {
    if (!role) {
      throw new Error(`addLambdaRoute(${method} ${route}) needs an IAM role`);
    }

    // A construct id made from the method and route, such as GETapiitemsid.
    const id = `${method}${route}`.replace(/[^a-zA-Z0-9]/g, '');

    // Bundles the handler file and runs it on Node.js 22 (ADR 0017).
    const fn = new NodejsFunction(this, `${id}Function`, {
      entry: code,
      handler: 'handler',
      projectRoot,
      runtime: lambda.Runtime.NODEJS_22_X,
      role,
      environment,
    });

    // Sends matching requests from this API to the function. The authorizer, when given, runs first.
    this.addRoutes({
      path: route,
      methods: [method],
      integration: new HttpLambdaIntegration(`${id}Integration`, fn),
      authorizer,
    });

    return fn;
  }
}
