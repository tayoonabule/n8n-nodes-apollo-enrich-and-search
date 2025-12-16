import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../transport';
import { splitAndTrim } from '../utils';

export async function createContact(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const firstName = this.getNodeParameter('firstName', i) as string;
			const lastName = this.getNodeParameter('lastName', i) as string;
			const email = this.getNodeParameter('email', i) as string;
			const organizationName = this.getNodeParameter('organizationName', i) as string;
			const organizationId = this.getNodeParameter('organizationId', i) as string;
			const websiteUrl = this.getNodeParameter('websiteUrl', i) as string;
			const title = this.getNodeParameter('title', i) as string;
			const labelNames = this.getNodeParameter('labelNames', i) as string;
			const runDedupe = this.getNodeParameter('runDedupe', i) as boolean;

			if (!firstName && !lastName && !email) {
				throw new NodeOperationError(
					this.getNode(),
					'At least one of First Name, Last Name, or Email is required',
					{ itemIndex: i },
				);
			}

			const body: any = {
				first_name: firstName,
				last_name: lastName,
				email: email,
			};

			if (organizationName) body.organization_name = organizationName;
			if (organizationId) body.organization_id = organizationId;
			if (websiteUrl) body.website_url = websiteUrl;
			if (title) body.title = title;
			if (labelNames) body.label_names = splitAndTrim(labelNames);
			if (runDedupe !== undefined) body.run_dedupe = runDedupe;

			const response = await apiRequest.call(this, 'POST', '/contacts', body);
			returnData.push({ json: response.contact } as INodeExecutionData);
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message } } as INodeExecutionData);
				continue;
			}
			throw error;
		}
	}

	return returnData;
}

export async function updateContact(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const contactId = this.getNodeParameter('contactId', i) as string;
			const firstName = this.getNodeParameter('firstName', i) as string;
			const lastName = this.getNodeParameter('lastName', i) as string;
			const email = this.getNodeParameter('email', i) as string;
			const title = this.getNodeParameter('title', i) as string;
			const organizationName = this.getNodeParameter('organizationName', i) as string;
			const organizationId = this.getNodeParameter('organizationId', i) as string;
			const websiteUrl = this.getNodeParameter('websiteUrl', i) as string;
			const labelNames = this.getNodeParameter('labelNames', i) as string;

			if (!contactId) {
				throw new NodeOperationError(this.getNode(), 'Contact ID is required', { itemIndex: i });
			}

			const body: any = {};
			if (firstName) body.first_name = firstName;
			if (lastName) body.last_name = lastName;
			if (email) body.email = email;
			if (title) body.title = title;
			if (organizationName) body.organization_name = organizationName;
			if (organizationId) body.organization_id = organizationId;
			if (websiteUrl) body.website_url = websiteUrl;
			if (labelNames) body.label_names = splitAndTrim(labelNames);

			const response = await apiRequest.call(this, 'PATCH', `/contacts/${contactId}`, body);
			returnData.push({ json: response.contact } as INodeExecutionData);
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message } } as INodeExecutionData);
				continue;
			}
			throw error;
		}
	}

	return returnData;
}

export async function searchContacts(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const qKeywords = this.getNodeParameter('qKeywords', 0) as string;
	const contactStageIds = this.getNodeParameter('contactStageIds', 0) as string;
	const labelIds = this.getNodeParameter('labelIds', 0) as string;
	const sortByField = this.getNodeParameter('sortByField', 0) as string;
	const sortAscending = this.getNodeParameter('sortAscending', 0) as boolean;
	const page = this.getNodeParameter('page', 0) as number;
	const perPage = this.getNodeParameter('perPage', 0) as number;

	const body: any = {
		page,
		per_page: perPage,
		sort_ascending: sortAscending,
	};

	if (qKeywords) body.q_keywords = qKeywords;
	if (contactStageIds) body.contact_stage_ids = splitAndTrim(contactStageIds);
	if (labelIds) body.label_ids = splitAndTrim(labelIds);
	if (sortByField) body.sort_by_field = sortByField;

	const response = await apiRequest.call(this, 'POST', '/contacts/search', body);
	return this.helpers.returnJsonArray(response.contacts);
}
