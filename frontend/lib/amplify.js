import { Amplify } from 'aws-amplify';

/**
 * The one place the browser sets up sign-in. The Cognito ids come from
 * /config.json, which the CDK stack writes next to the site files
 * (see infra/lib/short-links-stack.js and docs/arch/0019).
 *
 * The first call loads the file and configures Amplify. Later calls reuse that result.
 *
 * @returns {Promise<void>} Resolves when Amplify is ready to use.
 * @throws {Error} If /config.json is missing.
 */
let configured;
export function configureAmplify() {
  configured ??= fetch('/config.json')
    .then((response) => {
      if (!response.ok) throw new Error('The site is missing its sign-in settings (config.json).');
      return response.json();
    })
    .then((config) => {
      Amplify.configure({
        Auth: {
          Cognito: {
            userPoolId: config.userPoolId,
            userPoolClientId: config.userPoolClientId,
          },
        },
      });
    });
  return configured;
}
