// infra/constructs/hosting-bucket.js
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

/**
 * HostingBucket is the S3 bucket that holds a built website (ADR 0016).
 *
 * It extends the CDK Bucket and turns on the settings the site needs:
 *   - Website hosting, so `/` serves index.html.
 *   - Public read, because the site is public anyway. Only the bucket policy is
 *     allowed to grant public access; ACL-based public access stays blocked.
 *   - Removal policy DESTROY, with the objects deleted too. The bucket only holds
 *     built files, so `cdk destroy` can remove it.
 *
 * Callers can override any default by passing props. The defaults are spread last
 * on top of the base options, so a prop here overrides the same field in the base.
 *
 * The bucket's website endpoint is HTTP only (see ADR 0016).
 */
export class HostingBucket extends s3.Bucket {
  /**
   * @param {import('constructs').Construct} scope The parent construct (the stack).
   * @param {string} id The construct id. Must be unique inside the scope.
   * @param {s3.BucketProps} [props] Optional overrides for the defaults below.
   */
  constructor(scope, id, props = {}) {
    super(scope, id, {
      // Serve index.html for requests to the bucket root.
      websiteIndexDocument: 'index.html',

      // Public read through the bucket policy. ACL-based public access stays blocked.
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS_ONLY,

      // The files are uploaded again on every deploy, so it is safe to delete with the stack.
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,

      ...props,
    });
  }
}
