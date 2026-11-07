# CLAUDE.md: Project guide

This is the URL Shortener, a small full-stack app for an introductory cloud computing workshop. Users register, log in, create short links, and visit `/r/:code` to be redirected.

The project is meant to teach how a browser, a frontend, managed sign-in, an API, and a database work together. Keep code readable and simple. Scope limits are in [ADR 0008](docs/arch/0008-scope-limited-to-core-crud.md).

## Stack

- HTML, CSS, and vanilla JavaScript (ES modules) for the frontend, built with Vite
- AWS, defined with AWS CDK in JavaScript:
  - S3 bucket for the built site
  - API Gateway HTTP API as the public entry point (`go.dustintobrien.com`, DNS in Cloudflare)
  - Lambda functions, one per route
  - DynamoDB for links
  - Cognito for sign-in

See the ADRs for why: [ADR 0015](docs/arch/0015-host-on-aws-with-cdk.md) through [ADR 0020](docs/arch/0020-redirect-short-links-in-lambda.md).

## File structure

```
hackathon-demo/
├── CLAUDE.md              This file
├── README.md              Setup and run instructions
├── index.html             Login page markup (served at /)
├── dashboard.html         Dashboard markup (served at /dashboard)
├── create.html            Create-link markup (served at /create)
├── redirect.html          "Link not found" markup (shown when a code is unknown)
├── package.json           Frontend scripts and dependencies (aws-amplify, vite)
├── vite.config.js         Vite configuration and dev proxy to the API
├── public/
│   └── logo.svg           Static files served as-is
├── frontend/
│   ├── index.css          Global styles
│   ├── lib/
│   │   └── amplify.js     Sets up Amplify from config.json (the one place sign-in is configured)
│   ├── pages/
│   │   ├── login.js       Behavior for the login page (index.html)
│   │   ├── dashboard.js   Behavior for /dashboard
│   │   ├── create.js      Behavior for /create
│   │   └── redirect.js    Shows "Link not found" (the redirect itself is in the API)
│   └── services/
│       ├── auth.js        Register, log in, log out, get the ID token
│       └── urls.js        Create, list, and delete links through the API
├── api/                   Lambda source, one file per route (its own package.json)
│   ├── db.js              The one DynamoDB client
│   ├── http.js            Response and user-id helpers
│   ├── links/             list.js, create.js, delete.js, redirect.js
│   └── auth/              auto-confirm.js (Cognito pre sign-up trigger)
├── infra/                 AWS CDK app in JavaScript (its own package.json and CLAUDE.md)
│   ├── app.js             CDK entry point
│   ├── stack.js           Every AWS resource and route (empty until written)
│   └── cdk.json           Context: site domain and ACM certificate ARN
└── docs/
    ├── arch/              Architecture Decision Records (see docs/arch/CLAUDE.md)
    └── ideation/          Planning notes and parked ideas (see docs/ideation/CLAUDE.md)
```

### Layer rules

- **Pages** (`frontend/pages/`) hold each page's behavior. They render no HTML of their own and handle user events. They may call services directly ([ADR 0014](docs/arch/0014-page-scripts-in-pages-folder.md)).
- **Services** (`frontend/services/`) call the API or Cognito. Each function does one thing and returns data or throws an error.
- **`frontend/lib/amplify.js`** is the only place Amplify is configured.
- **`api/`** holds the Lambda code. Each route has its own file ([ADR 0017](docs/arch/0017-api-gateway-with-one-lambda-per-route.md)). The access rule (only the owner can list or delete a link) lives in these files ([ADR 0018](docs/arch/0018-store-links-in-dynamodb.md)).
- **`infra/`** defines every AWS resource. Infrastructure changes go here, not in the AWS console.

## Docs

- Architecture decisions go in `docs/arch/` as ADRs. Read the relevant ADR before changing code it covers. Details in `docs/arch/CLAUDE.md`.
- Ideas, flows, and workshop plans go in `docs/ideation/`. Details in `docs/ideation/CLAUDE.md`.
- If code contradicts an accepted ADR, write a new ADR rather than changing the code silently.

## Commands

```
npm install                 Install frontend dependencies (run in the root, then in api/ and infra/)
npm run build               Build the site to dist/ (run this before deploying)
npm run dev                 Start the local dev server (needs public/config.json and API_ORIGIN, see README)
cd infra && npx cdk deploy  Deploy the stack (uploads dist/ and writes config.json)
cd infra && npx cdk destroy Remove the stack (the table and user pool are kept)
```

## Conventions

- Infrastructure values (domain, certificate ARN) are CDK context in `infra/cdk.json` or `cdk deploy -c name=value`. Never commit account ids or secrets.
- The browser gets its Cognito ids from `/config.json`, which CDK writes. Do not put them in `VITE_` variables.
- Keep files small and named after what they do. This is a teaching codebase, so favor clear code over clever code.
- Match the style of the code around your change.
