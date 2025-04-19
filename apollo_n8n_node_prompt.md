Apollo.io n8n Node Specification (2025 Update)

📌 Purpose

Develop a full-featured declarative-style n8n node for the Apollo.io API inside the n8n-nodes-apolloio starter project. The node should support search, enrichment, and campaign operations for sales intelligence workflows.

Note: Custom nodes like this are only supported on self-hosted n8n instances.

✅ Project Setup

Starter Template

Clone: github.com/n8n-io/n8n-nodes-starter

Rename root folder to: n8n-nodes-apolloio

🧹 Clean Up Starter Files

Delete:

nodes/ExampleNode

nodes/HttpBin

credentials/ExampleCredentialsApi.credentials.ts

credentials/HttpBinApi.credentials.ts

pnpm-lock.yaml (we're using npm)

🗓 TypeScript Compatibility

Update typescript from ~4.8.4 to ^5.x

Add compatibility with n8n >=1.80.0 via:

"engines": {
"n8n": ">=1.80.0"
},

Consider Docker-based development using Compose:

docker compose up -d
docker exec -it n8n npm link /path/to/n8n-nodes-apolloio
docker restart n8n

📦 package.json Essentials

Ensure:

Correct n8n paths

Valid author, repository, and main

Add engines.n8n field

Use modern scripts (build, dev, lint, etc.)

📁 File Structure

n8n-nodes-apolloio/
├── credentials/
│ └── ApolloApi.credentials.ts
├── nodes/
│ └── Apollo/
│ ├── Apollo.node.ts
│ ├── Apollo.node.json
│ └── Apollo.svg
├── package.json
├── tsconfig.json
├── gulpfile.js
└── test-n8n/ ← Local self-hosted n8n instance

Add Apollo.svg for node icon.

🔐 Authentication (ApolloApi.credentials.ts)

import {
IAuthenticateGeneric,
ICredentialTestRequest,
ICredentialType,
INodeProperties,
} from 'n8n-workflow';

export class ApolloApi implements ICredentialType {
name = 'apolloApi';
displayName = 'Apollo.io API';

properties: INodeProperties[] = [
{
displayName: 'API Key',
name: 'apiKey',
type: 'string',
default: '',
required: true,
typeOptions: { password: true },
},
];

authenticate: IAuthenticateGeneric = {
type: 'generic',
properties: {
headers: {
'X-Api-Key': '={{$credentials.apiKey}}',
},
},
};

test: ICredentialTestRequest = {
request: {
baseURL: 'https://api.apollo.io/api/v1',
url: '/organizations/enrich',
method: 'GET',
params: { domain: 'apollo.io' },
},
};
}

🔩 Node Definition (Apollo.node.ts)

Fully typed with INodeType and INodeTypeDescription

Add usableAsTool: true to allow AI tool usage

Support for Apollo 2025 enrichment, batch processing, and new logic-based workflow features

const description: INodeTypeDescription = {
// ... existing properties
usableAsTool: true,
// ...
};

Enable use via environment variable:

export N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true

🚀 Apollo API Enhancements (2025)

Improved enrichment depth (person + company)

Pre-meeting insights via Chrome extension

Outlook integration

New endpoints for smart workflows (Feb 2025)

Support:

/people/bulk_enrich

/companies/search

/mixed_people/search

🔁 Pagination & Batching

Use modern helpers:

await this.helpers.requestWithPagination.call(
this,
'POST',
'/mixed_people/search',
body,
{},
{ rawData: true },
);

🛡 Error Handling

Use structured error handling with:

import { NodeOperationError, NodeApiError } from 'n8n-workflow';

Handle:

401/403: Auth

429: Rate limit

400/422: Validation

5xx: Server issues

🧠 AI & Code Node Support (2025)

Apollo node usable with n8n AI Agent workflows

Supports usableAsTool: true

Output JSON formatted for use with:

Code Node (JavaScript/Python)

AI decision logic

🔧 Dev & Testing Setup

Local n8n at: ~/n8n-nodes-apolloio/test-n8n/

Local Install

cd ~/n8n-nodes-apolloio
npm install
npm run build
npm link

Link in Test n8n

cd ~/n8n-nodes-apolloio/test-n8n/
mkdir -p custom && cd custom
npm init -y
npm link n8n-nodes-apolloio

Run n8n

cd ~/n8n-nodes-apolloio/test-n8n/
n8n

Or, for Docker:

docker compose up -d
docker exec -it n8n npm link /path/to/n8n-nodes-apolloio
docker restart n8n

🛰 2025 Use Cases

1. AI-Powered Lead Scoring

Enrich Apollo contacts

Pass to Code Node or AI Agent

Rank lead value automatically

2. Form-Based Enrichment

Use Form node (Oct 2024)

Submit -> Enrich via Apollo

Display enriched profile instantly

3. ABM with Chrome Insights

Use Outlook + Chrome Extension APIs

Apollo node populates meeting context

📊 Final Notes

The Apollo.io node spec is sound but must evolve with 2025:

Add AI support

Embrace Docker development

Support updated Apollo endpoints

Include Code Node readiness

Include proper typing + pagination

Staying up to date with n8n’s fast-evolving toolset ensures your integrations remain powerful and future-proof.

References: See original doc or citation list from Perplexity analysis.
