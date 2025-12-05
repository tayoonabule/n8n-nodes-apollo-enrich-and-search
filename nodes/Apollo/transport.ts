import { IDataObject, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';

const APOLLO_API_BASE_URL = 'https://api.apollo.io/api/v1';

export async function apiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	url: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	return await this.helpers.requestWithAuthentication.call(this, 'apolloApi', {
		method,
		baseURL: APOLLO_API_BASE_URL,
		url,
		body,
		qs,
		json: true,
	});
}
