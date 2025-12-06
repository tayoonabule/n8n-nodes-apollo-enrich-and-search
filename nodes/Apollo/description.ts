/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import { INodeTypeDescription } from 'n8n-workflow';

export const nodeDescription: INodeTypeDescription = {
	displayName: 'Apollo.io',
	name: 'apolloIo',
	icon: 'file:Apollo.svg',
	group: ['resource'],
	version: 1,
	description: 'Interact with the Apollo.io API',
	// @ts-ignore
	usableAsTool: true,
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
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			options: [
				{ name: 'Sequence', value: 'sequence' },
				{ name: 'Person', value: 'person' },
				{ name: 'Organization', value: 'organization' },
			],
			default: 'sequence',
			noDataExpression: true,
		},
		// Operations for Sequence
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			displayOptions: { show: { resource: ['sequence'] } },
			options: [
				{
					name: 'Search',
					value: 'search',
					action: 'Search a sequence',
					description: 'Find an existing sequence by name',
				},
				{
					name: 'Add Contacts',
					value: 'addContacts',
					action: 'Add contacts a sequence',
					description: 'Add one or more contacts to a sequence',
				},
			],
			default: 'search',
			noDataExpression: true,
			required: true,
		},
		// Operations for Person
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			displayOptions: { show: { resource: ['person'] } },
			options: [
				{
					name: 'Enrich',
					value: 'enrich',
					action: 'Enrich a person',
					description:
						'Retrieve detailed information about a person using their email or other identifiers',
				},
				{
					name: 'Bulk Enrich',
					value: 'bulkEnrich',
					action: 'Bulk enrich a person',
					description: 'Retrieve detailed information about up to 10 people at once',
				},
				{
					name: 'Search',
					value: 'search',
					action: 'Search for people',
					description:
						'Find net new people (prospects) using filters like title, location, and seniority',
				},
			],
			default: 'enrich',
			noDataExpression: true,
			required: true,
		},
		// Operations for Organization
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			displayOptions: { show: { resource: ['organization'] } },
			options: [
				{
					name: 'Enrich',
					value: 'enrich',
					action: 'Enrich an organization',
					description: 'Retrieve detailed information about a company using its domain',
				},
				{
					name: 'Bulk Enrich',
					value: 'bulkEnrich',
					action: 'Bulk enrich an organization',
					description: 'Retrieve detailed information about up to 10 companies at once',
				},
				{
					name: 'Search',
					value: 'search',
					action: 'Search for organizations',
					description:
						'Find net new organizations (companies) using filters like revenue, size, and location',
				},
			],
			default: 'enrich',
			noDataExpression: true,
			required: true,
		},
		// Fields for Sequence Search
		{
			displayName: 'Sequence Name Contains',
			name: 'sequenceName',
			type: 'string',
			default: '',
			description: 'The name (or partial name) of the sequence to search for',
			displayOptions: { show: { resource: ['sequence'], operation: ['search'] } },
		},
		{
			displayName: 'Page',
			name: 'page',
			type: 'number',
			default: 1,
			description: 'The specific page of results to retrieve. Useful for pagination.',
			typeOptions: { minValue: 1 },
			displayOptions: { show: { resource: ['sequence'], operation: ['search'] } },
		},
		{
			displayName: 'Per Page',
			name: 'perPage',
			type: 'number',
			default: 25,
			description: 'The number of records to return per page. Maximum is 100.',
			typeOptions: { minValue: 1, maxValue: 100 },
			displayOptions: { show: { resource: ['sequence'], operation: ['search'] } },
		},
		// Fields for Sequence Add Contacts
		{
			displayName: 'Sequence ID',
			name: 'sequenceId',
			type: 'string',
			default: '',
			description: 'The unique identifier of the Apollo sequence to which contacts will be added',
			required: true,
			displayOptions: { show: { resource: ['sequence'], operation: ['addContacts'] } },
		},
		{
			displayName: 'Contact IDs',
			name: 'contactIds',
			type: 'string',
			default: '',
			description:
				'A list of Apollo Contact IDs to add to the sequence. Accepts a comma-separated string or a JSON array of strings.',
			placeholder: '5f...,6a... or ["5f...","6a..."]',
			required: true,
			displayOptions: { show: { resource: ['sequence'], operation: ['addContacts'] } },
		},
		// Fields for Person Enrich
		{
			displayName: 'Requirements',
			type: 'notice',
			name: 'personEnrichNotice',
			default: '',
			description:
				'Provide Email, LinkedIn URL, Apollo Person ID, or First Name + Last Name + Company Domain',
			displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
		},
		{
			displayName: 'Email',
			name: 'personEmail',
			type: 'string',
			default: '',
			placeholder: 'name@example.com',
			description: 'The email address of the person you want to enrich data for',
			displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
		},
		{
			displayName: 'LinkedIn URL',
			name: 'personLinkedInUrl',
			type: 'string',
			default: '',
			placeholder: 'https://www.linkedin.com/in/...',
			description: 'The public LinkedIn profile URL of the person',
			displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
		},
		{
			displayName: 'Apollo Person ID',
			name: 'personId',
			type: 'string',
			default: '',
			description: 'The unique Apollo ID of the person',
			displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
		},
		{
			displayName: 'First Name',
			name: 'personFirstName',
			type: 'string',
			default: '',
			description: 'The first name of the person',
			displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
		},
		{
			displayName: 'Last Name',
			name: 'personLastName',
			type: 'string',
			default: '',
			description: 'The last name of the person',
			displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
		},
		{
			displayName: 'Company Domain',
			name: 'personDomain',
			type: 'string',
			default: '',
			description: 'The website domain of the company the person works for (e.g., "example.com")',
			displayOptions: { show: { resource: ['person'], operation: ['enrich'] } },
		},
		// Fields for Person Bulk Enrich
		{
			displayName: 'People Details (JSON Array)',
			name: 'peopleDetailsJson',
			type: 'json',
			default: '[{"email":"name@example.com"}]',
			description:
				'A JSON array containing details for up to 10 people to enrich in bulk. Each object should contain identifiers like email, first_name, last_name, etc.',
			required: true,
			displayOptions: {
				show: { resource: ['person'], operation: ['bulkEnrich'] },
			},
		},
		// Fields for Person Search
		{
			displayName: 'Person Titles',
			name: 'personTitles',
			type: 'string',
			default: '',
			description:
				'A list of job titles to filter people by. Multiple titles should be separated by semicolons (e.g., "Manager; Director").',
			displayOptions: { show: { resource: ['person'], operation: ['search'] } },
		},
		{
			displayName: 'Keywords',
			name: 'qKeywords',
			type: 'string',
			default: '',
			description: 'Keywords to filter people by. This searches across various fields.',
			displayOptions: { show: { resource: ['person'], operation: ['search'] } },
		},
		{
			displayName: 'Person Locations',
			name: 'personLocations',
			type: 'string',
			default: '',
			description:
				'A list of locations (cities, states, countries) to filter people by. Separate multiple locations with semicolons.',
			displayOptions: { show: { resource: ['person'], operation: ['search'] } },
		},
		{
			displayName: 'Seniorities',
			name: 'personSeniorities',
			type: 'multiOptions',
			options: [
				{ name: 'C-Suite', value: 'c_suite' },
				{ name: 'Director', value: 'director' },
				{ name: 'Entry', value: 'entry' },
				{ name: 'Founder', value: 'founder' },
				{ name: 'Head', value: 'head' },
				{ name: 'Intern', value: 'intern' },
				{ name: 'Manager', value: 'manager' },
				{ name: 'Owner', value: 'owner' },
				{ name: 'Partner', value: 'partner' },
				{ name: 'Senior', value: 'senior' },
				{ name: 'VP', value: 'vp' },
			],
			default: [],
			description: 'Filter people based on their job seniority level',
			displayOptions: { show: { resource: ['person'], operation: ['search'] } },
		},
		{
			displayName: 'Organization Locations',
			name: 'organizationLocations',
			type: 'string',
			default: '',
			description:
				"Filter based on the location of the organization's headquarters. Separate multiple locations with semicolons.",
			displayOptions: {
				show: {
					resource: ['person', 'organization'],
					operation: ['search'],
				},
			},
		},
		{
			displayName: 'Organization Domains',
			name: 'organizationDomains',
			type: 'string',
			default: '',
			description:
				"Filter based on the organization's website domain. Separate multiple domains with semicolons.",
			displayOptions: { show: { resource: ['person'], operation: ['search'] } },
		},
		{
			displayName: 'Email Status',
			name: 'contactEmailStatus',
			type: 'multiOptions',
			options: [
				{ name: 'Likely to Engage', value: 'likely to engage' },
				{ name: 'Unavailable', value: 'unavailable' },
				{ name: 'Unverified', value: 'unverified' },
				{ name: 'Verified', value: 'verified' },
			],
			default: [],
			description:
				'Filter people based on the status of their contact email (e.g., verified, likely to engage)',
			displayOptions: { show: { resource: ['person'], operation: ['search'] } },
		},
		{
			displayName: 'Organization IDs',
			name: 'organizationIds',
			type: 'string',
			default: '',
			description:
				'Filter based on specific Apollo Organization IDs. Separate multiple IDs with semicolons.',
			displayOptions: {
				show: {
					resource: ['person', 'organization'],
					operation: ['search'],
				},
			},
		},
		{
			displayName: 'Employee Count Ranges',
			name: 'organizationNumEmployeesRanges',
			type: 'string',
			default: '',
			description:
				'Filter based on the number of employees in the organization. Specify ranges separated by semicolons (e.g., "1,10; 11,50").',
			displayOptions: {
				show: {
					resource: ['person', 'organization'],
					operation: ['search'],
				},
			},
		},
		{
			displayName: 'Min Revenue',
			name: 'revenueRangeMin',
			type: 'number',
			default: 0,
			description: 'The minimum annual revenue of the organization (in USD)',
			displayOptions: {
				show: {
					resource: ['person', 'organization'],
					operation: ['search'],
				},
			},
		},
		{
			displayName: 'Max Revenue',
			name: 'revenueRangeMax',
			type: 'number',
			default: 0,
			description: 'The maximum annual revenue of the organization (in USD)',
			displayOptions: {
				show: {
					resource: ['person', 'organization'],
					operation: ['search'],
				},
			},
		},
		{
			displayName: 'Page',
			name: 'page',
			type: 'number',
			default: 1,
			description: 'The specific page of results to retrieve. Useful for pagination.',
			typeOptions: { minValue: 1 },
			displayOptions: {
				show: {
					resource: ['person', 'organization'],
					operation: ['search'],
				},
			},
		},
		{
			displayName: 'Per Page',
			name: 'perPage',
			type: 'number',
			default: 10,
			description: 'The number of records to return per page. Maximum is 100.',
			typeOptions: { minValue: 1, maxValue: 100 },
			displayOptions: {
				show: {
					resource: ['person', 'organization'],
					operation: ['search'],
				},
			},
		},
		// Fields for Organization Search
		{
			displayName: 'Excluded Locations',
			name: 'organizationNotLocations',
			type: 'string',
			default: '',
			description:
				'A list of locations to exclude from the search results. Separate multiple locations with semicolons.',
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Keyword Tags',
			name: 'qOrganizationKeywordTags',
			type: 'string',
			default: '',
			description:
				'Keywords or tags associated with the organization to filter by. Separate multiple tags with semicolons.',
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Organization Name',
			name: 'qOrganizationName',
			type: 'string',
			default: '',
			description: 'Filter organizations by their name (partial match supported)',
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Min Latest Funding',
			name: 'latestFundingAmountRangeMin',
			type: 'number',
			default: 0,
			description:
				"The minimum amount raised in the organization's most recent funding round (in USD)",
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Max Latest Funding',
			name: 'latestFundingAmountRangeMax',
			type: 'number',
			default: 0,
			description:
				"The maximum amount raised in the organization's most recent funding round (in USD)",
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Min Total Funding',
			name: 'totalFundingRangeMin',
			type: 'number',
			default: 0,
			description: 'The minimum total funding amount raised by the organization (in USD)',
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Max Total Funding',
			name: 'totalFundingRangeMax',
			type: 'number',
			default: 0,
			description: 'The maximum total funding amount raised by the organization (in USD)',
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Latest Funding Date Min',
			name: 'latestFundingDateRangeMin',
			type: 'dateTime',
			default: '',
			description: "The earliest date to consider for the organization's most recent funding round",
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Latest Funding Date Max',
			name: 'latestFundingDateRangeMax',
			type: 'dateTime',
			default: '',
			description: "The latest date to consider for the organization's most recent funding round",
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Job Titles',
			name: 'qOrganizationJobTitles',
			type: 'string',
			default: '',
			description:
				'Filter organizations that have active job postings matching these titles. Separate multiple titles with semicolons.',
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Job Locations',
			name: 'organizationJobLocations',
			type: 'string',
			default: '',
			description:
				'Filter organizations that have active job postings in these locations. Separate multiple locations with semicolons.',
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Min Active Jobs',
			name: 'organizationNumJobsRangeMin',
			type: 'number',
			default: 0,
			description: 'The minimum number of active job postings the organization has',
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Max Active Jobs',
			name: 'organizationNumJobsRangeMax',
			type: 'number',
			default: 0,
			description: 'The maximum number of active job postings the organization has',
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Job Posted At Min',
			name: 'organizationJobPostedAtRangeMin',
			type: 'dateTime',
			default: '',
			description: 'The earliest date to consider for when job postings were created',
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		{
			displayName: 'Job Posted At Max',
			name: 'organizationJobPostedAtRangeMax',
			type: 'dateTime',
			default: '',
			description: 'The latest date to consider for when job postings were created',
			displayOptions: { show: { resource: ['organization'], operation: ['search'] } },
		},
		// Fields for Organization Enrich
		{
			displayName: 'Website Domain',
			name: 'organizationDomain',
			type: 'string',
			default: '',
			required: true,
			description:
				'The website domain of the organization you want to enrich (e.g., "example.com")',
			placeholder: 'example.com',
			displayOptions: {
				show: { resource: ['organization'], operation: ['enrich'] },
			},
		},
		{
			displayName: 'Apollo Organization ID',
			name: 'organizationId',
			type: 'string',
			default: '',
			description: 'The unique Apollo ID of the organization',
			displayOptions: { show: { resource: ['organization'], operation: ['enrich'] } },
		},
		// Fields for Organization Bulk Enrich
		{
			displayName: 'Domains (JSON Array)',
			name: 'organizationDomainsJson',
			type: 'json',
			default: '["example.com"]',
			description:
				'A JSON array of strings, where each string is a company domain to enrich in bulk',
			required: true,
			displayOptions: { show: { resource: ['organization'], operation: ['bulkEnrich'] } },
		},
	],
};
