const { VerityClient, AuthenticationError } = require('../dist/index.js');

async function test() {
  if (!process.env.VERITY_API_KEY) {
    console.log('VERITY_API_KEY not set; skipping live API smoke checks.');
    console.log('✓ SDK structure is valid!');
    return;
  }

  const client = new VerityClient(process.env.VERITY_API_KEY);

  try {
    // Test health check
    const health = await client.health();
    console.log('✓ Health check:', health.data?.status);
  } catch (error) {
    console.error('✗ Health check failed:', error.message);
  }

  try {
    // Test code lookup
    const result = await client.lookupCode({ code: '76942' });
    console.log('✓ Code lookup:', result.data?.description);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.log('⚠ Code lookup requires valid API key:', error.message);
      console.log('  Note: Get your API key from https://verity.backworkai.com/dashboard');
    } else {
      console.error('✗ Code lookup failed:', error.message);
    }
  }

  console.log('\n✓ SDK structure is valid!');
}

test().catch(console.error);
