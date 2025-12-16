/*
 * Copyright (c) 2024
 * Apollo.io Node for n8n
 * MIT License (see LICENSE file in repo root)
 */

import {
	INodeType,
	INodeExecutionData,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { nodeDescription } from './description';
import { router } from './functions/router';
import { apiRequest } from './transport';

export class ApolloIo implements INodeType {
	description = nodeDescription;

	methods = {
		loadOptions: {
			async getSequences(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await apiRequest.call(this, 'POST', '/emailer_campaigns/search', {
					per_page: 100,
				});
				return response.emailer_campaigns.map((seq: any) => ({
					name: seq.name,
					value: seq.id,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await router.call(this);
	}
}
