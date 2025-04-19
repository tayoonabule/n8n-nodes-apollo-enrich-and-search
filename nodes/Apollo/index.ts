/**
 * Entry point for custom n8n nodes for npm publishing.
 * Exports an array of all node classes to be loaded by n8n.
 */
import { ApolloIo } from './ApolloIo.node';
export const nodes = [ApolloIo];