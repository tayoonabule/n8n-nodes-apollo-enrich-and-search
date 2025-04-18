/**
 * Apollo.io API credentials for n8n
 * Uses API Key authentication (X-Api-Key header).
 * @see https://apolloio.github.io/api-docs/
 */

import {
	ICredentialType,
	INodeProperties,
	IAuthenticateGeneric,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class ApolloApi implements ICredentialType {
	name = 'apolloApi';
	displayName = 'Apollo.io API';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
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
			qs: {
				domain: 'apollo.io',
			},
		},
	};
}