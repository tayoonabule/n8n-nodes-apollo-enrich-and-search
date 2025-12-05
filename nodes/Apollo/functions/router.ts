import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { searchSequences, addContactsToSequence } from './Sequence';
import { enrichPerson, bulkEnrichPeople } from './Person';
import { enrichOrganization, bulkEnrichOrganizations } from './Organization';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const resource = this.getNodeParameter('resource', 0) as string;
	const operation = this.getNodeParameter('operation', 0) as string;

	const routes = {
		sequence: {
			search: searchSequences,
			addContacts: addContactsToSequence,
		},
		person: {
			enrich: enrichPerson,
			bulkEnrich: bulkEnrichPeople,
		},
		organization: {
			enrich: enrichOrganization,
			bulkEnrich: bulkEnrichOrganizations,
		},
	};

	try {
		// @ts-ignore
		const action = routes[resource]?.[operation];

		if (!action) {
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" for resource "${resource}" is not supported!`,
			);
		}

		const executionData = await action.call(this);
		return [executionData];
	} catch (error) {
		throw error;
	}
}
