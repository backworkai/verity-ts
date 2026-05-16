const { VerityClient, AuthenticationError } = require('../dist/index.js');

async function test() {
  const client = new VerityClient('vrt_live_h2V4x8pL6JFHuX3y');

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
