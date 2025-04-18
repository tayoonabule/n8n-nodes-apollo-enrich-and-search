# n8n-nodes-apolloio

![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

Official n8n node for [Apollo.io](https://apollo.io) — providing robust search, enrichment, and campaign automation for sales intelligence workflows!

---

## ✨ Features

- **Full Apollo.io API Support:** Search sequences, enrich people and organizations, add contacts to sequences, and batch enrich via bulk endpoints.
- **Secure API Key Authentication** — keep your credentials safe using n8n’s credentials vault.
- **Strict Validation:** All required parameters and workflow inputs are checked and errors surfaced for misconfiguration.
- **Batch/Looping Support:** Use in both one-off enrichments and bulk workflows for CRM hygiene, lead generation, and more.

---

## 📦 Installation

With your custom nodes setup for n8n:

```bash
pnpm install n8n-nodes-apolloio
# or
npm install n8n-nodes-apolloio
# or
yarn add n8n-nodes-apolloio
```

> For local development, build your node and symlink or copy the `dist` folder into your custom node directory:
>
> ```bash
> pnpm build
> cp -R dist ~/.n8n/custom/node_modules/n8n-nodes-apolloio/dist
> ```
>
> Activate custom nodes in n8n. See [n8n docs](https://docs.n8n.io/integrations/creating-nodes/code/).

---

## 🔐 Authentication

1. Obtain your Apollo.io API Key from the [Apollo dashboard](https://apollo.io/api).
2. In your n8n instance, open the credentials manager and search for “Apollo.io API”.
3. Enter your API Key securely.

---

## 🎛 Node Operations Overview

This node supports the following resources and operations:

### Sequences

#### Search

- Search sequences by (partial) name.
- Paginated.

#### Add Contacts

- Add contacts (by Apollo contact IDs) to a specific sequence.

### Person

#### Enrich

- Get full Apollo data for a person using:
  - Email,
  - LinkedIn URL,
  - Apollo Person ID, or,
  - First name + last name + company domain
- Any single identifier or full name + domain required.

#### Bulk Enrich (People)

- Enrich up to 10 people at once (input as JSON array).

### Organization

#### Enrich

- Enrich by company domain (org ID supported as well).

#### Bulk Enrich (Organizations)

- Enrich up to 10 organizations at once (input as JSON array).

---

## 📝 Node Parameters

| Resource      | Operation       | Required Fields                                          |
|---------------|----------------|---------------------------------------------------------|
| Sequence      | Search         | `sequenceName` (optional), `page`, `perPage`            |
| Sequence      | Add Contacts   | `sequenceId` (required), `contactIds` (CSV or JSON)     |
| Person        | Enrich         | See [Person Enrich Identifiers](#person-enrich-identifiers)   |
| Person        | Bulk Enrich    | `peopleDetailsJson` (JSON array, 1-10 items)            |
| Organization  | Enrich         | `organizationDomain` (required), `organizationId` (opt) |
| Organization  | Bulk Enrich    | `organizationDomainsJson` (JSON array, 1-10 domains)    |

### Person Enrich Identifiers

- **Any ONE of:**
  - Email
  - LinkedIn URL
  - Apollo Person ID
  - (First Name + Last Name + Company Domain)

---

## 🚀 Example Workflows

### Enrich New CRM Contacts

1. **Trigger:** New sheet row/CRM webhook
2. **Apollo Node:** Resource=Person, Operation=Enrich, Email from Sheet
3. **Salesforce/HubSpot Node:** Update contact with response data

### Batch Company Enrichment

1. **Trigger:** Schedule/CSV Import
2. **Apollo Node:** Resource=Organization, Operation=Bulk Enrich, paste domain array
3. **Sheet/CRM Node:** Update organization records with enriched fields

---

## 🛠 Troubleshooting

- **Authentication failures:** Check your API Key, and if the problem persists, test the credential using the “Test Credential” button in n8n.
- **Rate limits:** Apollo.io may throttle requests based on your plan. Check API response headers for `x-minute-requests-left`.
- **Bulk Operations:** API maxes batches to 10 records. For more, loop in batches via n8n’s SplitInBatches node.
- **Debugging:** Use n8n’s node error handling; errors are descriptive and indicate which item failed.

---

## 📚 Resources

- [Apollo API Docs](https://apolloio.github.io/apollo-api-docs/)
- [n8n Docs](https://docs.n8n.io/)

---

## 🤝 Open Source & Issues

PRs and community contributions welcome! Please file issues with error output and usage example.

---

## License

MIT

---

## Maintainer

[Drewl](https://drewl.com) / [tayoonabule](https://github.com/tayoonabule)

---

Let me know if you’d like workflow screenshots, more advanced use-case templates, or NPM-ready formatting!
