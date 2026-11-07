# 03: Workshop plan

This maps each learning objective to a part of the app the attendee can see or read, and suggests an order for the session. The stack is the AWS design in [ADR 0015](../arch/0015-host-on-aws-with-cdk.md). The CDK code is being redesigned, so the file names below may change.

## Learning objectives and where they appear

| # | Objective | Where it shows up in the app | Demo idea |
|---|-----------|------------------------------|-----------|
| 1 | How browsers load websites | `index.html` loads its page script, which loads the services and Amplify | Open DevTools, show the Network tab on first load |
| 2 | How frontend and backend communicate | Every call in the services folder goes from the browser to the API Gateway URL under `/api` | Show one request and its JSON response in the Network tab |
| 3 | What cloud hosting does | An S3 bucket holds the built site (`dist/`). API Gateway serves it on the public domain | Show the bucket's files in the S3 console, then load a page through the domain |
| 4 | What managed databases provide | The `LinksTable` DynamoDB table | Insert an item by hand in the DynamoDB console, then see it on the dashboard |
| 5 | How authentication and sessions work | Cognito user pool, and the token check in API Gateway | Log in, close the tab, reopen it, and stay logged in. Show the token in the browser |
| 6 | How APIs interact with databases | One Lambda per route in `api/links/` reads or writes the table | Compare a `QueryCommand` in the Lambda with the same query in the DynamoDB console |
| 7 | How HTTP redirects work | `/r/{code}` runs a Lambda that returns a `302` with a `Location` header | Open DevTools and show the redirect status and the `Location` header |
| 8 | How cloud infrastructure is defined as code | The CDK stack defines every resource | Run `cdk diff` after a small change and show the new resource in the output |

## Suggested session order (about 90 minutes)

1. **Introduction (10 min):** show the finished app, then the architecture diagram from the project brief.
2. **Frontend and browser (15 min):** objectives 1 and 2. Walk through `index.html` and one page script.
3. **Authentication (15 min):** objective 5. Register, log in, and show the session in the browser.
4. **Database and API (20 min):** objectives 4 and 6. Read one Lambda, then create a link and find it in the DynamoDB console.
5. **Redirects (10 min):** objective 7. Open a short link in a new tab and explain each step.
6. **Hosting and infrastructure (15 min):** objectives 3 and 8. Show the S3 bucket and the CDK stack, then change one line and deploy it.
7. **Questions and exercises (5 min):** attendees try one exercise from [05-future-ideas.md](05-future-ideas.md).

## Prerequisites for attendees

- An AWS account, with access to create a CloudFormation stack.
- AWS CLI credentials for that account.
- A Cloudflare DNS zone, if the presenter uses the custom domain.
- Node.js LTS and npm installed.

## Presenter checklist

- The stack is deployed with `cd infra && npx cdk deploy` before the session. Check that the site loads and a link can be created.
- The Cloudflare CNAME for the site domain points at the API Gateway host (see the `ApiGatewayTarget` output).
- Cognito confirms new accounts automatically, through the pre sign-up trigger ([ADR 0019](../arch/0019-cognito-for-sign-in.md)). Nobody has to confirm an email.
- A recorded demo, in case of network problems.
- The AWS account has a budget alert, so a forgotten stack does not run up a bill.
