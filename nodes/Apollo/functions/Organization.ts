import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../transport';
import { splitAndTrim } from '../utils';

export async function enrichOrganization(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const domain = this.getNodeParameter('organizationDomain', i) as string;
			const orgId = this.getNodeParameter('organizationId', i) as string;

			if (!domain) {
				throw new NodeOperationError(this.getNode(), 'Organization domain is required', {
					itemIndex: i,
				});
			}

			const qs: any = { domain };
			if (orgId) qs.id = orgId;

			const response = await apiRequest.call(this, 'GET', '/organizations/enrich', {}, qs);
			returnData.push({ json: response.organization } as INodeExecutionData);
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

export async function bulkEnrichOrganizations(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const domainsJson = this.getNodeParameter('organizationDomainsJson', 0) as string;
	let domainsArray: string[];

	try {
		domainsArray = JSON.parse(domainsJson);
	} catch {
		throw new NodeOperationError(this.getNode(), 'Invalid JSON for organization domains');
	}

	if (!Array.isArray(domainsArray) || domainsArray.length < 1 || domainsArray.length > 10) {
		throw new NodeOperationError(
			this.getNode(),
			'Organization domains array must contain between 1 and 10 items',
		);
	}

	if (!domainsArray.every((domain) => typeof domain === 'string')) {
		throw new NodeOperationError(
			this.getNode(),
			'Organization domains array must contain only strings',
		);
	}

	const response = await apiRequest.call(this, 'POST', '/organizations/bulk_enrich', {
		domains: domainsArray,
	});
	return this.helpers.returnJsonArray(response.organizations);
}

export async function searchOrganizations(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const organizationNumEmployeesRanges = this.getNodeParameter(
				'organizationNumEmployeesRanges',
				i,
			) as string;
			const organizationLocations = this.getNodeParameter('organizationLocations', i) as string;
			const organizationNotLocations = this.getNodeParameter(
				'organizationNotLocations',
				i,
			) as string;
			const revenueRangeMin = this.getNodeParameter('revenueRangeMin', i) as number;
			const revenueRangeMax = this.getNodeParameter('revenueRangeMax', i) as number;
			const qOrganizationKeywordTags = this.getNodeParameter(
				'qOrganizationKeywordTags',
				i,
			) as string;
			const qOrganizationName = this.getNodeParameter('qOrganizationName', i) as string;
			const organizationIds = this.getNodeParameter('organizationIds', i) as string;
			const latestFundingAmountRangeMin = this.getNodeParameter(
				'latestFundingAmountRangeMin',
				i,
			) as number;
			const latestFundingAmountRangeMax = this.getNodeParameter(
				'latestFundingAmountRangeMax',
				i,
			) as number;
			const totalFundingRangeMin = this.getNodeParameter('totalFundingRangeMin', i) as number;
			const totalFundingRangeMax = this.getNodeParameter('totalFundingRangeMax', i) as number;
			const latestFundingDateRangeMin = this.getNodeParameter(
				'latestFundingDateRangeMin',
				i,
			) as string;
			const latestFundingDateRangeMax = this.getNodeParameter(
				'latestFundingDateRangeMax',
				i,
			) as string;
			const qOrganizationJobTitles = this.getNodeParameter('qOrganizationJobTitles', i) as string;
			const organizationJobLocations = this.getNodeParameter(
				'organizationJobLocations',
				i,
			) as string;
			const organizationNumJobsRangeMin = this.getNodeParameter(
				'organizationNumJobsRangeMin',
				i,
			) as number;
			const organizationNumJobsRangeMax = this.getNodeParameter(
				'organizationNumJobsRangeMax',
				i,
			) as number;
			const organizationJobPostedAtRangeMin = this.getNodeParameter(
				'organizationJobPostedAtRangeMin',
				i,
			) as string;
			const organizationJobPostedAtRangeMax = this.getNodeParameter(
				'organizationJobPostedAtRangeMax',
				i,
			) as string;
			const page = this.getNodeParameter('page', i) as number;
			const perPage = this.getNodeParameter('perPage', i) as number;

			const body: any = {
				page,
				per_page: perPage,
			};

			if (organizationNumEmployeesRanges) {
				body.organization_num_employees_ranges = splitAndTrim(organizationNumEmployeesRanges);
			}
			if (organizationLocations) {
				body.organization_locations = splitAndTrim(organizationLocations);
			}
			if (organizationNotLocations) {
				body.organization_not_locations = splitAndTrim(organizationNotLocations);
			}
			if (revenueRangeMin) {
				body.revenue_range = { ...body.revenue_range, min: revenueRangeMin };
			}
			if (revenueRangeMax) {
				body.revenue_range = { ...body.revenue_range, max: revenueRangeMax };
			}
			if (qOrganizationKeywordTags) {
				body.q_organization_keyword_tags = splitAndTrim(qOrganizationKeywordTags);
			}
			if (qOrganizationName) {
				body.q_organization_name = qOrganizationName;
			}
			if (organizationIds) {
				body.organization_ids = splitAndTrim(organizationIds);
			}
			if (latestFundingAmountRangeMin) {
				body.latest_funding_amount_range = {
					...body.latest_funding_amount_range,
					min: latestFundingAmountRangeMin,
				};
			}
			if (latestFundingAmountRangeMax) {
				body.latest_funding_amount_range = {
					...body.latest_funding_amount_range,
					max: latestFundingAmountRangeMax,
				};
			}
			if (totalFundingRangeMin) {
				body.total_funding_range = { ...body.total_funding_range, min: totalFundingRangeMin };
			}
			if (totalFundingRangeMax) {
				body.total_funding_range = { ...body.total_funding_range, max: totalFundingRangeMax };
			}
			if (latestFundingDateRangeMin) {
				body.latest_funding_date_range = {
					...body.latest_funding_date_range,
					min: latestFundingDateRangeMin,
				};
			}
			if (latestFundingDateRangeMax) {
				body.latest_funding_date_range = {
					...body.latest_funding_date_range,
					max: latestFundingDateRangeMax,
				};
			}
			if (qOrganizationJobTitles) {
				body.q_organization_job_titles = splitAndTrim(qOrganizationJobTitles);
			}
			if (organizationJobLocations) {
				body.organization_job_locations = splitAndTrim(organizationJobLocations);
			}
			if (organizationNumJobsRangeMin) {
				body.organization_num_jobs_range = {
					...body.organization_num_jobs_range,
					min: organizationNumJobsRangeMin,
				};
			}
			if (organizationNumJobsRangeMax) {
				body.organization_num_jobs_range = {
					...body.organization_num_jobs_range,
					max: organizationNumJobsRangeMax,
				};
			}
			if (organizationJobPostedAtRangeMin) {
				body.organization_job_posted_at_range = {
					...body.organization_job_posted_at_range,
					min: organizationJobPostedAtRangeMin,
				};
			}
			if (organizationJobPostedAtRangeMax) {
				body.organization_job_posted_at_range = {
					...body.organization_job_posted_at_range,
					max: organizationJobPostedAtRangeMax,
				};
			}

			const response = await apiRequest.call(this, 'POST', '/mixed_companies/search', body);

			for (const org of response.organizations) {
				returnData.push({ json: org } as INodeExecutionData);
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
