import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ApolloApi implements ICredentialType {
	name = 'apolloApi';
	displayName = 'Apollo.io API';
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-not-http-url
	documentationUrl = 'httpsKnowledgeApolloIoHcEnUsArticles_4413696872859SetUpApiAccess';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as const, // Ensure type is correctly inferred
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	// Authentication method: Send API Key in 'X-Api-Key' header
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	// Test request: Attempt to enrich a known public domain
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.apollo.io/api/v1', // Base URL for Apollo API
			url: '/organizations/enrich', // Use Organization Enrich endpoint
			method: 'GET',
			qs: { // Use qs for query string parameters in GET requests
				 domain: 'apollo.io', // Use a public domain for testing
			},
			// Headers are automatically applied by the 'authenticate' property
		},
	};
}