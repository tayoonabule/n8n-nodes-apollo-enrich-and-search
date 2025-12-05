import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../transport';

export async function searchSequences(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const sequenceName = this.getNodeParameter('sequenceName', 0) as string;
	const page = this.getNodeParameter('page', 0) as number;
	const perPage = this.getNodeParameter('perPage', 0) as number;

	const body: { q_campaign_name?: string } = {};
	if (sequenceName) {
		body.q_campaign_name = sequenceName;
	}

	const response = await apiRequest.call(this, 'POST', '/emailer_campaigns/search', body, {
		page,
		per_page: perPage,
	});
	return this.helpers.returnJsonArray(response.emailer_campaigns);
}

export async function addContactsToSequence(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

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
				throw new NodeOperationError(this.getNode(), 'No valid contact IDs provided', {
					itemIndex: i,
				});
			}

			const response = await apiRequest.call(
				this,
				'POST',
				`/emailer_campaigns/${sequenceId}/add_contact_ids`,
				{ contact_ids: contactIds },
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

	return returnData;
}
