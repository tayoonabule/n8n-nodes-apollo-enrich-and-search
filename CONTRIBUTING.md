# Contributing to n8n-nodes-apolloio

Thank you for your interest in contributing to the Apollo.io node for n8n! This guide details the development standards, architecture, and best practices we follow to ensure the node remains robust, maintainable, and AI-agent friendly.

## 📂 Project Structure

- **`nodes/Apollo/ApolloIo.node.ts`**: The main entry point class for the node. It generally just delegates execution to the router.
- **`nodes/Apollo/description.ts`**: Contains the JSON-like schema defining the node's UI, inputs, outputs, and properties. **Crucial for AI agent compatibility.**
- **`nodes/Apollo/functions/`**: Contains the implementation logic, separated by resource (e.g., `Person.ts`, `Organization.ts`, `Sequence.ts`).
- **`nodes/Apollo/functions/router.ts`**: Routes the execution to the correct function based on the selected `resource` and `operation`.
- **`nodes/Apollo/utils.ts`**: Shared utility functions.
- **`nodes/Apollo/transport.ts`**: Handles the authenticated API requests to Apollo.io.

## 🛠 Development Workflow

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Build the Project**
    ```bash
    npm run build
    ```

3.  **Lint & Format**
    We enforce strict linting rules. Always run this before committing:
    ```bash
    npm run lint
    ```

## ✨ Adding New Functionality

To add a new resource or operation (e.g., "Enrich Contact"), follow these steps:

### 1. Update `nodes/Apollo/description.ts`
Define the new operation and its fields.

*   **Standard Fields**: Use standard n8n types (`string`, `number`, `json`, `multiOptions`).
*   **Separators**: For list inputs, we standardise on **semicolon (`;`)** separators (e.g., locations, titles).
*   **Descriptions**: See [AI Agent Compatibility](#-ai-agent-compatibility) below.

### 2. Implement Logic in `nodes/Apollo/functions/`
Create or update the relevant resource file (e.g., `Person.ts`).

*   **Input Parsing**: Use the shared `splitAndTrim` helper from `../utils.ts` for any list-based input.
    ```typescript
    import { splitAndTrim } from '../utils';
    // ...
    if (locations) {
        body.person_locations = splitAndTrim(locations);
    }
    ```
    *This helper splits by semicolon, trims whitespace, and removes empty entries.*

### 3. Update Router (`nodes/Apollo/functions/router.ts`)
Map the new resource/operation pair to your function.

```typescript
const routes = {
    newResource: {
        newOperation: myNewFunction,
    },
    // ...
};
```

## 🤖 AI Agent Compatibility

This node is designed to be "usable as a tool" by AI agents (e.g., LangChain in n8n). To maintain this support:

1.  **Enable Tool Usage**: Ensure `usableAsTool: true` is present in `nodeDescription`.
2.  **Verbose Descriptions**: Field descriptions must be explicit. Don't just say "Locations". Say:
    > "A list of locations (cities, states, countries) to filter people by. Separate multiple locations with semicolons."
3.  **Context**: Include units (e.g., "in USD"), formats (e.g., "JSON array"), and examples in the description text. This helps the LLM generate the correct input format without hallucinating.

## 📏 Coding Standards

- **Error Handling**: Wrap logic in `try/catch`. Use `this.continueOnFail()` logic to allow workflows to proceed if a single item fails (standard n8n pattern).
- **Type Safety**: Use TypeScript interfaces where possible. Avoid `any` unless dealing with strict API payloads where types are excessive overhead.
- **Imports**: Use relative imports.

## 🚀 Release Process

1.  **Bump Version**: Update `version` in `package.json`.
2.  **Update Changelog**: Add a new entry in `CHANGELOG.md` following the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.
3.  **Commit**: `git commit -m "feat(scope): message vX.Y.Z"`
4.  **Tag**: `git tag vX.Y.Z`
5.  **Push**: `git push && git push --tags`
6.  **Release**: Create a GitHub release from the tag.
7.  **Publish**: `npm publish`
