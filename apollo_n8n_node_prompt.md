# Apollo.io n8n Node Specification

📌 Purpose

Develop a full-featured n8n node for the Apollo.io API inside the n8n-nodes-apolloio starter project, enabling search, enrichment, and campaign operations for sales intelligence workflows.

⸻

✅ Project Setup

🧹 Clean Up
 • Delete default example files:
 • nodes/*
 • credentials/*

📦 package.json Configuration

{
  "name": "n8n-nodes-apolloio",
  "keywords": ["n8n-community-node-package"],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "nodes": ["dist/nodes/Apollo/Apollo.node.js"],
    "credentials": ["dist/credentials/ApolloApi.credentials.js"]
  }
}

📁 File Structure

n8n-nodes-apolloio/
├── credentials/
│   └── ApolloApi.credentials.ts
├── nodes/
│   └── Apollo/
│       ├── Apollo.node.ts
│       └── Apollo.svg
├── package.json
├── tsconfig.json

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

🧠 Node: nodes/Apollo/Apollo.node.ts

Description (INodeTypeDescription)
 • displayName: "Apollo.io"
 • name: "apolloIo"
 • icon: "file:Apollo.svg"
 • group: ['resource']
 • version: 1
 • credentials: [{ name: 'apolloApi', required: true }]

Constants

const APOLLO_API_BASE_URL = '<https://api.apollo.io/api/v1>';

⸻

🎛 Properties (UI Controls)

Top-Level
 • resource: dropdown: "sequence" | "person" | "organization"
 • operation: dropdown, options dependent on resource

Parameters by Resource & Operation

Resource Operation Params
Sequence search sequenceName (opt), page (default 1), perPage (default 25, max 100)
 addContacts sequenceId (req), contactIds (req, comma-separated or JSON)
Person enrich email, LinkedIn, id, first name, last name, domain (require at least one combo)
 bulkEnrich peopleDetailsJson (JSON array of up to 10 entries)
Organization enrich domain (req), id (opt)
 bulkEnrich organizationDomainsJson (JSON array, max 10 domains)

⸻

⚙️ Execute Method

High-Level Logic

async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const returnData: INodeExecutionData[] = [];
  const resource = this.getNodeParameter('resource', 0) as string;
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('apolloApi') as { apiKey: string };
  const apiKey = credentials.apiKey;
  const baseUrl = APOLLO_API_BASE_URL;
  
  for (let i = 0; i < items.length; i++) {
    try {
      // Build API call
      const options: IHttpRequestOptions = { /*based on resource/operation*/ };
      const response = await this.helpers.request.call(this, options);

      // Format result
      returnData.push({ json: response, pairedItem: { item: i } });
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
        continue;
      }
      throw error;
    }
  }

  return [returnData];
}

⸻

🔁 Pagination & Batching

“Return All” Option
 • Fetch all pages internally using Apollo’s page and per_page params.
 • Use delay (e.g. setTimeout) if needed to avoid hitting rate limits.

Bulk Handling
 • Batch items in groups of 10 for bulk enrichment.
 • Parse input JSON into structured objects.
 • Map and validate input fields before request.

⸻

🛡 Error Handling

Use NodeOperationError or NodeApiError with status-code-specific messages:

if (error.response?.status === 429) {
  throw new NodeOperationError(this.getNode(), 'Rate limit exceeded. Try again later.', { itemIndex });
}

⸻

🔧 Dev & Test Best Practices
 • Use npm run build after changes.
 • For Docker: mount dist/ into ~/.n8n/custom/node_modules/n8n-nodes-apolloio.
 • Use docker-compose logs -f to debug loading issues.
 • Test all node operations via n8n UI (localhost:5678).

⸻

🚀 Workflow Use Cases

1. Prospect → Enrich → CRM
 • Trigger: Schedule or form submission
 • Node: Search Companies → Search Contacts
 • Enrich contact → Push to CRM (e.g., Salesforce, HubSpot)

2. Data Hygiene
 • Trigger: New CRM Contact or Google Sheet Row
 • Apollo Enrich (Bulk)
 • Update CRM or Sheet with enriched fields (email, phone, role)

⸻

📚 Docs & Reference
 • API Docs: apolloio.github.io/apollo-api-docs
 • Rate Limits: Vary by endpoint and plan; check headers like x-minute-requests-left

⸻

Let me know if you want this turned into a downloadable .md file or broken into GitHub issues/tasks.
