import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../transport';

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
