import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../transport';

const splitAndTrim = (str: string) =>
	str
		.split(';')
		.map((s) => s.trim())
		.filter((s) => s);

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

export async function searchPeople(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const personTitles = this.getNodeParameter('personTitles', i) as string;
			const qKeywords = this.getNodeParameter('qKeywords', i) as string;
			const personLocations = this.getNodeParameter('personLocations', i) as string;
			const personSeniorities = this.getNodeParameter('personSeniorities', i) as string[];
			const organizationLocations = this.getNodeParameter('organizationLocations', i) as string;
			const organizationDomains = this.getNodeParameter('organizationDomains', i) as string;
			const contactEmailStatus = this.getNodeParameter('contactEmailStatus', i) as string[];
			const organizationIds = this.getNodeParameter('organizationIds', i) as string;
			const organizationNumEmployeesRanges = this.getNodeParameter(
				'organizationNumEmployeesRanges',
				i,
			) as string;
			const revenueRangeMin = this.getNodeParameter('revenueRangeMin', i) as number;
			const revenueRangeMax = this.getNodeParameter('revenueRangeMax', i) as number;
			const page = this.getNodeParameter('page', i) as number;
			const perPage = this.getNodeParameter('perPage', i) as number;

			const body: any = {
				page,
				per_page: perPage,
			};

			if (personTitles) {
				body.person_titles = splitAndTrim(personTitles);
			}
			if (qKeywords) {
				body.q_keywords = qKeywords;
			}
			if (personLocations) {
				body.person_locations = splitAndTrim(personLocations);
			}
			if (personSeniorities && personSeniorities.length > 0) {
				body.person_seniorities = personSeniorities;
			}
			if (organizationLocations) {
				body.organization_locations = splitAndTrim(organizationLocations);
			}
			if (organizationDomains) {
				body.q_organization_domains_list = splitAndTrim(organizationDomains);
			}
			if (contactEmailStatus && contactEmailStatus.length > 0) {
				body.contact_email_status = contactEmailStatus;
			}
			if (organizationIds) {
				body.organization_ids = splitAndTrim(organizationIds);
			}
			if (organizationNumEmployeesRanges) {
				body.organization_num_employees_ranges = splitAndTrim(organizationNumEmployeesRanges);
			}
			if (revenueRangeMin) {
				body.revenue_range = { ...body.revenue_range, min: revenueRangeMin };
			}
			if (revenueRangeMax) {
				body.revenue_range = { ...body.revenue_range, max: revenueRangeMax };
			}

			const response = await apiRequest.call(this, 'POST', '/mixed_people/api_search', body);

			for (const person of response.people) {
				returnData.push({ json: person } as INodeExecutionData);
			}
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
