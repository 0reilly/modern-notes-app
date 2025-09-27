// Simple test file for CI/CD verification
console.log('CI/CD test file loaded successfully');

// Export a simple function for testing
export function ciTest() {
  return 'CI/CD test passed';
}

// Run a quick test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('✅ CI/CD test executed successfully');
}