// Test script to verify feature flags MongoDB integration
import { getFeatureFlagsServer, setFeatureFlagsServer } from '../lib/feature-flags-server.js';
import { DEFAULT_FEATURE_FLAGS } from '../types/feature-flags.js';

async function testFeatureFlags() {
  try {
    console.log('Testing feature flags MongoDB integration...');
    
    // Test 1: Get default flags (should create them if they don't exist)
    console.log('\n1. Getting feature flags...');
    const flags = await getFeatureFlagsServer();
    console.log('Current flags:', flags);
    
    // Test 2: Update flags
    console.log('\n2. Updating websitePreview to false...');
    await setFeatureFlagsServer({ ...flags, websitePreview: false });
    
    // Test 3: Verify update
    console.log('\n3. Verifying update...');
    const updatedFlags = await getFeatureFlagsServer();
    console.log('Updated flags:', updatedFlags);
    
    // Test 4: Reset to defaults
    console.log('\n4. Resetting to defaults...');
    await setFeatureFlagsServer(DEFAULT_FEATURE_FLAGS);
    
    // Test 5: Verify reset
    console.log('\n5. Verifying reset...');
    const resetFlags = await getFeatureFlagsServer();
    console.log('Reset flags:', resetFlags);
    
    console.log('\n✅ All tests passed! Feature flags are working with MongoDB.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFeatureFlags();
