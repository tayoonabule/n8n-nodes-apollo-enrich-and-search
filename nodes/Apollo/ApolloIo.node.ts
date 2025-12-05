/*
 * Copyright (c) 2024
 * Apollo.io Node for n8n
 * MIT License (see LICENSE file in repo root)
 */

import { INodeType, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { nodeDescription } from './description';
import { router } from './functions/router';

export class ApolloIo implements INodeType {
	description = nodeDescription;

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await router.call(this);
	}
}
