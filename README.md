# Verity TypeScript SDK

TypeScript/JavaScript client library for the [Verity API](https://verity.backworkai.com) - Medicare coverage policies, prior authorization requirements, and medical code lookups.

## Installation

```bash
npm install verity-sdk
# or
yarn add verity-sdk
# or
pnpm add verity-sdk
```

## Quick Start

```typescript
import { VerityClient } from 'verity-sdk';

// Initialize the client
const client = new VerityClient('vrt_live_YOUR_API_KEY');

// Look up a medical code
const result = await client.lookupCode({
  code: '76942',
  include: ['rvu', 'policies'],
});
console.log(result.data?.description);
// Output: "Ultrasonic guidance for needle placement"

// Check prior authorization requirements
const paCheck = await client.checkPriorAuth({
  procedureCodes: ['76942'],
  diagnosisCodes: ['M54.5'],
  state: 'TX',
});
console.log(`PA Required: ${paCheck.data?.pa_required}`);

// Search policies
const policies = await client.listPolicies({
  q: 'ultrasound guidance',
  policyType: 'LCD',
  limit: 10,
});

// Get specific policy details
const policy = await client.getPolicy('L33831', {
  include: ['criteria', 'codes'],
});
```

## Features

- **Full TypeScript support** - Complete type definitions included
- **Works everywhere** - Node.js, browser, and edge runtimes
- **Tree-shakeable** - ES modules for optimal bundle size
- **Zero dependencies** - Uses native fetch API
- **Promise-based** - Modern async/await API

## Authentication

Get your API key from the [Verity Dashboard](https://verity.backworkai.com/dashboard).

```typescript
const client = new VerityClient('vrt_live_YOUR_API_KEY');

// Or with custom config
const client = new VerityClient({
  apiKey: 'vrt_live_YOUR_API_KEY',
  baseUrl: 'https://verity.backworkai.com/api/v1',
  timeout: 30000, // 30 seconds
});
```

## Usage Examples

### Code Lookup

```typescript
// Basic lookup
const result = await client.lookupCode({
  code: '76942',
});

// With additional data
const result = await client.lookupCode({
  code: '76942',
  codeSystem: 'HCPCS',
  jurisdiction: 'JM',
  include: ['rvu', 'policies'],
  fuzzy: true,
});
```

### Policy Search

```typescript
// Keyword search
const policies = await client.listPolicies({
  q: 'ultrasound guidance',
  mode: 'keyword',
  policyType: 'LCD',
  status: 'active',
  limit: 50,
});

// Semantic search
const policies = await client.listPolicies({
  q: 'imaging guidance for procedures',
  mode: 'semantic',
});

// Pagination
if (policies.meta?.pagination?.has_more) {
  const nextPage = await client.listPolicies({
    cursor: policies.meta.pagination.cursor || undefined,
  });
}
```

### Prior Authorization

```typescript
const result = await client.checkPriorAuth({
  procedureCodes: ['76942', '76937'],
  diagnosisCodes: ['M54.5', 'G89.29'],
  state: 'TX',
  payer: 'medicare',
});

if (result.data?.pa_required) {
  console.log('Prior authorization required!');
  console.log('Documentation needed:', result.data.documentation_checklist);
}
```

### Policy Comparison

```typescript
const comparison = await client.comparePolicies({
  procedureCodes: ['76942'],
  policyType: 'LCD',
  jurisdictions: ['JM', 'JH', 'JK'],
});

comparison.data?.comparison?.forEach((juris) => {
  console.log(`${juris.jurisdiction}: ${juris.policies?.length || 0} policies`);
});
```

### Coverage Criteria Search

```typescript
const criteria = await client.searchCriteria({
  q: 'diabetes',
  section: 'indications',
  policyType: 'LCD',
  limit: 25,
});
```

### Jurisdictions

```typescript
const jurisdictions = await client.listJurisdictions();
jurisdictions.data?.forEach((j) => {
  console.log(`${j.jurisdiction_code}: ${j.mac_name} (${j.states?.join(', ')})`);
});
```

## Error Handling

```typescript
import {
  VerityClient,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  VerityError,
} from 'verity-sdk';

try {
  const result = await client.lookupCode({ code: '76942' });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof ValidationError) {
    console.error('Invalid parameters:', error.message);
  } else if (error instanceof NotFoundError) {
    console.error('Resource not found');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded. Resets at:', error.reset);
  } else if (error instanceof VerityError) {
    console.error('API error:', error.message);
  }
}
```

## Browser Usage

```html
<script type="module">
  import { VerityClient } from 'https://cdn.skypack.dev/verity-sdk';
  
  const client = new VerityClient('vrt_live_YOUR_API_KEY');
  const result = await client.lookupCode({ code: '76942' });
  console.log(result.data);
</script>
```

## Requirements

- Node.js 14+ or modern browser with fetch API
- TypeScript 4.5+ (for TypeScript projects)

## License

MIT License - see LICENSE file for details.

## Support

- Documentation: https://verity.backworkai.com/docs
- Issues: https://github.com/tylerbryy/verity-ts/issues
- Email: support@verity.backworkai.com
