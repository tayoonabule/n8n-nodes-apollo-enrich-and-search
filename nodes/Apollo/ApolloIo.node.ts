import {
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
  IExecuteFunctions,
  NodeOperationError,
} from 'n8n-workflow';

// Define the base URL for the Apollo API
const APOLLO_API_BASE_URL = 'https://api.apollo.io/api/v1';

export class Apollo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Apollo.io',
		name: 'apolloIo',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:Apollo.svg', // Corrected icon file reference to renamed SVG
		group: ['resource'],
		version: 1,
		description: 'Interact with the Apollo.io API',
		defaults: {
			name: 'Apollo.io',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'apolloApi',
				required: true,
			},
		],
			properties: [
				{
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					options: [
						{ name: 'Sequence', value: 'sequence' },
						{ name: 'Person', value: 'person' },
						{ name: 'Organization', value: 'organization' },
					],
					default: 'sequence',
					noDataExpression: true,
				},
				// Operation dropdown for Sequence
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					displayOptions: { show: { resource: ['sequence'] } },
					options: [
						{ name: 'Search',       value: 'search',      action: 'Search a sequence'},
						{ name: 'Add Contacts', value: 'addContacts', action: 'Add contacts a sequence'},
					],
					default: 'search',
					noDataExpression: true,
					required: true,
				},
				// Operation dropdown for Person
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					displayOptions: { show: { resource: ['person'] } },
					options: [
						{ name: 'Enrich', value: 'enrich', action: 'Enrich a person'},
						{ name: 'Bulk Enrich', value: 'bulkEnrich', action: 'Bulk enrich a person'},
					],
					default: 'enrich',
					noDataExpression: true,
					required: true,
				},
				// Operation dropdown for Organization
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					displayOptions: { show: { resource: ['organization'] } },
					options: [
						{ name: 'Enrich', value: 'enrich', action: 'Enrich an organization',},
						{ name: 'Bulk Enrich', value: 'bulkEnrich', action: 'Bulk enrich an organization',},
					],
					default: 'enrich',
					noDataExpression: true,
					required: true,
				},
				// Sequence: Search parameters
				{
					displayName: 'Sequence Name Contains',
					name: 'sequenceName',
					type: 'string',
					default: '',
					description: 'Filter sequences by name containing this text',
					placeholder: '',
					displayOptions: { show: { resource: ['sequence'], operation: ['search'] } },
				},
				{
					displayName: 'Page',
					name: 'page',
					type: 'number',
					default: 1,
					description: 'Page number of results',
					typeOptions: { minValue: 1 },
					displayOptions: { show: { resource: ['sequence'], operation: ['search'] } },
				},
				{
					displayName: 'Per Page',
					name: 'perPage',
					type: 'number',
					default: 25,
					description: 'Results per page (max 100)',
					typeOptions: { minValue: 1, maxValue: 100 },
					displayOptions: { show: { resource: ['sequence'], operation: ['search'] } },
				},
				// Sequence: Add Contacts parameters
				{
					displayName: 'Sequence ID',
					name: 'sequenceId',
					type: 'string',
					default: '',
					description: 'ID of the sequence to add contacts to',
					required: true,
					displayOptions: { show: { resource: ['sequence'], operation: ['addContacts'] } },
				},
				{
					displayName: 'Contact IDs',
					name: 'contactIds',
					type: 'string',
					default: '',
					description: 'Comma-separated list or JSON array of Apollo Contact IDs',
					placeholder: '5f...,6a... or ["5f...","6a..."]',
					required: true,
					displayOptions: { show: { resource: ['sequence'], operation: ['addContacts'] } },
				},
				// Person: Enrich parameters
				{
					displayName: 'Requirements',
					type: 'notice',
					name: 'personEnrichNotice',
					default: '',
					description: 'Provide Email, LinkedIn URL, Apollo Person ID, or First Name + Last Name + Company Domain',
					displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
				},
				{
					displayName: 'Email',
					name: 'personEmail',
					type: 'string',
					default: '',
					placeholder: 'name@example.com',
					description: 'Email of the person to enrich',
					displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
				},
				{
					displayName: 'LinkedIn URL',
					name: 'personLinkedInUrl',
					type: 'string',
					default: '',
					placeholder: 'https://www.linkedin.com/in/...',
					description: 'LinkedIn profile URL of the person',
					displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
				},
				{
					displayName: 'Apollo Person ID',
					name: 'personId',
					type: 'string',
					default: '',
					displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
				},
				{
					displayName: 'First Name',
					name: 'personFirstName',
					type: 'string',
					default: '',
					description: 'First name of the person',
					displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
				},
				{
					displayName: 'Last Name',
					name: 'personLastName',
					type: 'string',
					default: '',
					description: 'Last name of the person',
					displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
				},
				{
					displayName: 'Company Domain',
					name: 'personDomain',
					type: 'string',
					default: '',
					description: 'Domain of the person’s company',
					displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
				},
				// Person: Bulk Enrich parameters
				{
					displayName: 'People Details (JSON Array)',
					name: 'peopleDetailsJson',
					type: 'json',
					default: '[{"email":"name@example.com"}]',
					description: 'JSON array of up to 10 people objects with required identifiers',
					required: true,
                    displayOptions: {
                        show: { resource: ['person'], operation: ['bulkEnrich'] },
                    },
				},
				// Organization: Enrich parameters
				{
					displayName: 'Website Domain',
					name: 'organizationDomain',
					type: 'string',
					default: '',
					required: true,
					description: 'Company website domain to enrich',
						placeholder: 'example.com',
						displayOptions: {
							show: { resource: ['organization'], operation: ['enrich'] },
						},
				},
				{
					displayName: 'Apollo Organization ID',
					name: 'organizationId',
					type: 'string',
					default: '',
					displayOptions: { show: { resource: ['organization'], operation: ['enrich'] } },
				},
				// Organization: Bulk Enrich parameters
				{
					displayName: 'Domains (JSON Array)',
					name: 'organizationDomainsJson',
					type: 'json',
					default: '["example.com"]',
					description: 'JSON array of up to 10 domains',
					required: true,
					displayOptions: { show: { resource: ['organization'], operation: ['bulkEnrich'] } },
				},
			],
	};

	// The core execution method of the node
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const returnData: INodeExecutionData[] = [];
		try {
				// Sequence: Search
				if (resource === 'sequence' && operation === 'search') {
					// grab UI params once (runs outside the items loop)
					const sequenceName = this.getNodeParameter('sequenceName', 0) as string;
					const page         = this.getNodeParameter('page',         0) as number;
					const perPage      = this.getNodeParameter('perPage',      0) as number;

					// build body only if sequenceName was provided
					const body: { q_campaign_name?: string } = {};
					if (sequenceName) {
						body.q_campaign_name = sequenceName;
					}

					// call Apollo: POST /emailer_campaigns/search?page=&per_page=
					const response = await this.helpers.requestWithAuthentication.call(
						this,
						'apolloApi',
						{
							method:  'POST',
							baseURL: APOLLO_API_BASE_URL,
							url:     '/emailer_campaigns/search',
							body,
							qs:      { page, per_page: perPage },
							json:    true,
						},
					);

					// return the array of campaigns
					return [ this.helpers.returnJsonArray(response.emailer_campaigns) ];
				}
			// Sequence: Add Contacts
			if (resource === 'sequence' && operation === 'addContacts') {
				for (let i = 0; i < items.length; i++) {
					try {
						const sequenceId = this.getNodeParameter('sequenceId', i) as string;
						const contactIdsStr = this.getNodeParameter('contactIds', i) as string;
						let contactIds: string[];
						try {
							const parsed = JSON.parse(contactIdsStr);
							if (Array.isArray(parsed)) {
								contactIds = parsed.map((id: any) => String(id).trim());
							} else {
								throw new NodeOperationError(this.getNode(), 'Not an array', { itemIndex: i });
							}
						} catch {
							contactIds = contactIdsStr
								.split(',')
								.map((id) => id.trim())
								.filter((id) => id);
						}
						if (!contactIds.length) {
							throw new NodeOperationError(this.getNode(), 'No valid contact IDs provided', { itemIndex: i });
						}
						const response = await this.helpers.requestWithAuthentication.call(
							this,
							'apolloApi',
							{
								method: 'POST',
								baseURL: APOLLO_API_BASE_URL,
								url: `/emailer_campaigns/${sequenceId}/add_contact_ids`,
								body: { contact_ids: contactIds },
								json: true,
							},
						);
						returnData.push({ json: response } as INodeExecutionData);
					} catch (error) {
						if (this.continueOnFail()) {
							returnData.push({ json: { error: (error as Error).message } } as INodeExecutionData);
							continue;
						}
						throw error;
					}
				}
				return [returnData];
			}
			// Person: Enrich
			if (resource === 'person' && operation === 'enrich') {
				for (let i = 0; i < items.length; i++) {
					try {
						const email = this.getNodeParameter('personEmail', i) as string;
						const linkedinUrl = this.getNodeParameter('personLinkedInUrl', i) as string;
						const personId = this.getNodeParameter('personId', i) as string;
						const firstName = this.getNodeParameter('personFirstName', i) as string;
						const lastName = this.getNodeParameter('personLastName', i) as string;
						const domain = this.getNodeParameter('personDomain', i) as string;
						if (!email && !linkedinUrl && !personId && !(firstName && lastName && domain)) {
							throw new NodeOperationError(this.getNode(), 'Missing required identifier fields', { itemIndex: i });
						}
						const body: any = {};
						if (email) body.email = email;
						if (linkedinUrl) body.linkedin_url = linkedinUrl;
						if (personId) body.id = personId;
						if (firstName) body.first_name = firstName;
						if (lastName) body.last_name = lastName;
						if (domain) body.domain = domain;
						const response = await this.helpers.requestWithAuthentication.call(
							this,
							'apolloApi',
							{
								method: 'POST',
								baseURL: APOLLO_API_BASE_URL,
								url: '/people/match',
								body,
								json: true,
							},
						);
						returnData.push({ json: response.person } as INodeExecutionData);
					} catch (error) {
						if (this.continueOnFail()) {
							returnData.push({ json: { error: (error as Error).message } } as INodeExecutionData);
							continue;
						}
						throw error;
					}
				}
				return [returnData];
			}
			// Person: Bulk Enrich
			if (resource === 'person' && operation === 'bulkEnrich') {
				const peopleJson = this.getNodeParameter('peopleDetailsJson', 0) as string;
				let peopleArray: any[];
				try {
					peopleArray = JSON.parse(peopleJson);
				} catch {
					throw new NodeOperationError(this.getNode(), 'Invalid JSON for people details');
				}
				if (!Array.isArray(peopleArray) || peopleArray.length < 1 || peopleArray.length > 10) {
					throw new NodeOperationError(this.getNode(), 'People details array must contain 1 to 10 items');
				}
				const response = await this.helpers.requestWithAuthentication.call(
					this,
					'apolloApi',
					{
						method: 'POST',
						baseURL: APOLLO_API_BASE_URL,
						url: '/people/bulk_match',
						body: { details: peopleArray },
						json: true,
					},
				);
				return [this.helpers.returnJsonArray(response.people)];
			}
			// Organization: Enrich
			if (resource === 'organization' && operation === 'enrich') {
				for (let i = 0; i < items.length; i++) {
					try {
						const domain = this.getNodeParameter('organizationDomain', i) as string;
						const orgId = this.getNodeParameter('organizationId', i) as string;
						if (!domain) {
							throw new NodeOperationError(this.getNode(), 'Organization domain is required', { itemIndex: i });
						}
						const qs: any = { domain };
						if (orgId) qs.id = orgId;
						const response = await this.helpers.requestWithAuthentication.call(
							this,
							'apolloApi',
							{
								method: 'GET',
								baseURL: APOLLO_API_BASE_URL,
								url: '/organizations/enrich',
								qs,
								json: true,
							},
						);
						returnData.push({ json: response.organization } as INodeExecutionData);
					} catch (error) {
						if (this.continueOnFail()) {
							returnData.push({ json: { error: (error as Error).message } } as INodeExecutionData);
							continue;
						}
						throw error;
					}
				}
				return [returnData];
			}
			// Organization: Bulk Enrich
			if (resource === 'organization' && operation === 'bulkEnrich') {
				const domainsJson = this.getNodeParameter('organizationDomainsJson', 0) as string;
				let domainsArray: string[];
				try {
					domainsArray = JSON.parse(domainsJson);
				} catch {
					throw new NodeOperationError(this.getNode(), 'Invalid JSON for organization domains');
				}
				// Validate array length
				if (!Array.isArray(domainsArray) || domainsArray.length < 1 || domainsArray.length > 10) {
					throw new NodeOperationError(
						this.getNode(),
						'Organization domains array must contain between 1 and 10 items',
					);
				}
				// Validate all entries are strings
				if (!domainsArray.every(domain => typeof domain === 'string')) {
					throw new NodeOperationError(
						this.getNode(),
						'Organization domains array must contain only strings',
					);
				}
				const response = await this.helpers.requestWithAuthentication.call(
					this,
					'apolloApi',
					{
						method: 'POST',
						baseURL: APOLLO_API_BASE_URL,
						url: '/organizations/bulk_enrich',
						body: { domains: domainsArray },
						json: true,
					},
				);
				return [this.helpers.returnJsonArray(response.organizations)];
			}
			// Unsupported combination
			throw new NodeOperationError(this.getNode(),
				`The operation "${operation}" for resource "${resource}" is not supported!`,
			);
		} catch (error) {
			if (this.continueOnFail()) {
				return [[{ json: { error: (error as Error).message } } as INodeExecutionData]];
			}
			throw error;
		}
	}
}
