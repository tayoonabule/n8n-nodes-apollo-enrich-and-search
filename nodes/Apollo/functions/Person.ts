import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../transport';

export async function enrichPerson(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const email = this.getNodeParameter('personEmail', i) as string;
			const linkedinUrl = this.getNodeParameter('personLinkedInUrl', i) as string;
			const personId = this.getNodeParameter('personId', i) as string;
			const firstName = this.getNodeParameter('personFirstName', i) as string;
			const lastName = this.getNodeParameter('personLastName', i) as string;
			const domain = this.getNodeParameter('personDomain', i) as string;

			if (!email && !linkedinUrl && !personId && !(firstName && lastName && domain)) {
				throw new NodeOperationError(this.getNode(), 'Missing required identifier fields', {
					itemIndex: i,
				});
			}

			const body: any = {};
			if (email) body.email = email;
			if (linkedinUrl) body.linkedin_url = linkedinUrl;
			if (personId) body.id = personId;
			if (firstName) body.first_name = firstName;
			if (lastName) body.last_name = lastName;
			if (domain) body.domain = domain;

			const response = await apiRequest.call(this, 'POST', '/people/match', body);
			returnData.push({ json: response.person } as INodeExecutionData);
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

export async function bulkEnrichPeople(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
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

	const response = await apiRequest.call(this, 'POST', '/people/bulk_match', {
		details: peopleArray,
	});
	return this.helpers.returnJsonArray(response.people);
}
