Here’s the updated version of your Apollo.io n8n Node Specification as Markdown, with all relevant dev/test instructions tailored to your local setup (~/n8n-nodes-apolloio/test-n8n/):

⸻

Apollo.io n8n Node Specification (Updated)

📌 Purpose

Develop a full-featured declarative style n8n node for the Apollo.io API inside the n8n-nodes-apolloio starter project, enabling search, enrichment, and campaign operations for sales intelligence workflows.

Note: Custom nodes, like this one, are only supported on self-hosted n8n instances.

⸻

✅ Project Setup

Starter Template
• Start with the n8n declarative node starter: github.com/n8n-io/n8n-nodes-starter
• Rename the root folder to n8n-nodes-apolloio

🧹 Clean Up Starter Files

Delete:
• nodes/ExampleNode
• nodes/HttpBin
• credentials/ExampleCredentialsApi.credentials.ts
• credentials/HttpBinApi.credentials.ts
• pnpm-lock.yaml (we’ll use npm)

⸻

📦 package.json Configuration (CRITICAL)

Replace the entire contents of package.json with this (updated as of May 2nd, 2024):

<details>
<summary>Click to view <code>package.json</code></summary>

{
"name": "n8n-nodes-apolloio",
"version": "0.1.0",
"description": "n8n node for the Apollo.io API",
"keywords": ["n8n-community-node-package"],
"license": "MIT",
"homepage": "",
"author": {
"name": "",
"email": ""
},
"repository": {
"type": "git",
"url": "<https://github.com/><your-org>/n8n-nodes-apolloio.git"
},
"main": "index.js",
"scripts": {
"build": "tsc && gulp build:icons",
"dev": "tsc --watch",
"format": "prettier nodes credentials --write",
"lint": "eslint nodes credentials package.json",
"lintfix": "eslint nodes credentials package.json --fix",
"prepublishOnly": "npm run build && npm run lint -c .eslintrc.prepublish.js nodes credentials package.json"
},
"files": ["dist"],
"n8n": {
"n8nNodesApiVersion": 1,
"credentials": [
"dist/credentials/ApolloApi.credentials.js"
],
"nodes": [
"dist/nodes/Apollo/Apollo.node.js"
]
},
"devDependencies": {
"@typescript-eslint/parser": "~5.45",
"eslint-plugin-n8n-nodes-base": "^1.11.0",
"gulp": "^4.0.2",
"n8n-workflow": "_",
"prettier": "^2.7.1",
"typescript": "~4.8.4"
},
"peerDependencies": {
"n8n-workflow": "_"
}
}

</details>

⸻

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
└── test-n8n/ ← Your local n8n instance

Icon: Add a custom Apollo.svg for branding inside the node UI.

⸻

🔐 Authentication: credentials/ApolloApi.credentials.ts

Class Setup

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
baseURL: '<https://api.apollo.io/api/v1>',
url: '/organizations/enrich',
method: 'GET',
params: { domain: 'apollo.io' },
},
};
}

⸻

🔩 Node Definition

Defined in nodes/Apollo/Apollo.node.ts. [View logic and full code above in full spec.]

⸻

📑 Metadata

Stored in nodes/Apollo/Apollo.node.json. [View example JSON above in full spec.]

⸻

🔁 Pagination & Batching
• Handle "returnAll" using do...while or while loops
• Split input into batches for bulk operations
• Respect Apollo rate limits (X-RateLimit-\* headers)

⸻

🛡 Error Handling

Use NodeOperationError or NodeApiError
Check error.response?.status for handling:
• 401/403: Invalid API key
• 429: Rate limit
• 400/422: Validation issues
• 5xx: Server errors

⸻

🔧 Dev & Test Best Practices

🧠 Your n8n instance is inside ~/n8n-nodes-apolloio/test-n8n/

1. Install Dependencies

cd ~/n8n-nodes-apolloio
npm install

2. Build Node

npm run build

3. Link Node Project Globally

npm link

4. Prepare the Custom Node Folder (Inside Your n8n Instance)

cd ~/n8n-nodes-apolloio/test-n8n/
mkdir -p custom
cd custom
npm init -y
npm link n8n-nodes-apolloio

5. Restart n8n

If you’re running n8n locally from the same directory:

cd ~/n8n-nodes-apolloio/test-n8n/
n8n

Or restart your Docker container, if applicable:

docker restart <container-name>

6. Test
   • Visit <http://localhost:5678>
   • Create a new workflow
   • Add “Apollo.io” node
   • Configure credentials and test operations

7. Debugging
   • Add console.log() statements in .node.ts
   • View logs in your terminal or use:

docker logs <n8n_container_name> -f

8. Rebuild After Changes

cd ~/n8n-nodes-apolloio
npm run build

You usually don’t need to re-link unless you change the package.json name.

⸻

🚀 Workflow Use Cases
• Prospecting & Enrichment
• Data Hygiene
• Account-Based Marketing (ABM)
[See detailed steps above.]

⸻

📚 Docs & Reference
• Apollo API Docs
• n8n Node Dev Docs
• n8n Starter
• n8n Source Code

⸻

Let me know if you’d like this converted into a downloadable .md file or Notion format.
