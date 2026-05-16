# Verity TypeScript SDK

Official TypeScript and JavaScript client for the [Verity API](https://verity.backworkai.com): Medicare coverage policies, medical code intelligence, prior authorization checks, claim validation, compliance review, and drug formulary evidence.

The SDK is Promise-based, fully typed, and uses native `fetch` with an Effect-backed request layer for response parsing, timeouts, and safe retries.

## Installation

```bash
npm install verity-api
```

Requires Node.js 18 or newer, or a modern browser runtime with `fetch`.

## Quick Start

```typescript
import { VerityClient } from 'verity-api';

const client = new VerityClient(process.env.VERITY_API_KEY!);

const code = await client.lookupCode({
  code: '76942',
  include: ['rvu', 'policies'],
});

console.log(code.data?.description);

const priorAuth = await client.checkPriorAuth({
  procedureCodes: ['76942'],
  diagnosisCodes: ['M54.5'],
  state: 'TX',
  payer: 'medicare',
});

console.log(priorAuth.data?.pa_required);
```

Get an API key from the [Verity dashboard](https://verity.backworkai.com/dashboard).

## Core Workflows

### Code Lookup

```typescript
const result = await client.lookupCode({
  code: '76942',
  codeSystem: 'CPT',
  jurisdiction: 'JM',
  include: ['rvu', 'policies', 'rates'],
  fuzzy: true,
});
```

### Policy Search and Retrieval

```typescript
const policies = await client.listPolicies({
  q: 'ultrasound guidance',
  mode: 'keyword',
  policyType: 'LCD',
  status: 'active',
  limit: 25,
});

const policy = await client.getPolicy('L33831', {
  include: ['criteria', 'codes'],
});
```

### Prior Authorization and Claim Validation

```typescript
const priorAuth = await client.checkPriorAuth({
  procedureCodes: ['76942'],
  diagnosisCodes: ['M54.5'],
  state: 'TX',
  payer: 'medicare',
});

const claim = await client.validateClaim({
  procedureCodes: ['99213'],
  diagnosisCodes: ['E11.9'],
  payer: 'Medicare',
  state: 'TX',
});

console.log(claim.data?.coverage_status, claim.data?.denial_risk);
```

### Coverage, Spending, and Compliance

```typescript
const criteria = await client.searchCriteria({
  q: 'diabetes',
  section: 'indications',
  limit: 10,
});

const spending = await client.getSpendingByCode({
  codes: ['T1019', 'T1020'],
  year: 2023,
});

const changes = await client.listUnreviewedChanges({ limit: 10 });
const stats = await client.getComplianceStats();
```

### Drug Formulary Evidence

```typescript
const formulary = await client.searchDrugFormularyEvidence({
  q: 'ozempic',
  payer: 'all',
  limit: 5,
});
```

## Error Handling

```typescript
import {
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ValidationError,
  VerityError,
} from 'verity-api';

try {
  const result = await client.lookupCode({ code: '76942' });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof ValidationError) {
    console.error('Invalid request:', error.message);
  } else if (error instanceof NotFoundError) {
    console.error('Resource not found');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded:', error.reset);
  } else if (error instanceof VerityError) {
    console.error('Verity API error:', error.message);
  }
}
```

## Configuration

```typescript
const client = new VerityClient({
  apiKey: process.env.VERITY_API_KEY!,
  baseUrl: 'https://verity.backworkai.com/api/v1',
  timeout: 30_000,
});
```

## Browser Usage

```html
<script type="module">
  import { VerityClient } from 'https://cdn.skypack.dev/verity-api';

  const client = new VerityClient('vrt_live_YOUR_API_KEY');
  const result = await client.lookupCode({ code: '76942' });
  console.log(result.data);
</script>
```

## Development

```bash
npm install
npm run lint
npm run format:check
npm run build
npm test
```

`npm test` runs a structure check by default. Set `VERITY_API_KEY` to run live API smoke checks.

## Support

- Documentation: https://verity.backworkai.com/docs
- Issues: https://github.com/backworkai/verity-ts/issues
- Email: support@verity.backworkai.com

## License

MIT
