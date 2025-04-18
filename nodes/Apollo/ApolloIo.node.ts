import {
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
  IExecuteFunctions,
  // INodeProperties, // Keep this commented or remove if truly unused for now, or uncomment if used below
} from 'n8n-workflow';

// Define the base URL for the Apollo API
const APOLLO_API_BASE_URL = 'https://api.apollo.io/api/v1';

export class Apollo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Apollo.io',
		name: 'apolloIo',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:ApolloIo.svg', // Update icon file reference
		group: ['resource'],
		version: 1,
		description: 'Interact with the Apollo.io API',
		defaults: {
			name: 'Apollo.io',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'apolloApi',
				required: true,
			},
		],
		properties: [
			// Properties will be added here later
		],
	};

	// The function below is called when the node is executed and has permission to execute.
	// Your node's functionality and logic goes here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Return the data simply unchanged for now
		return [this.getInputData()];
	}
}
