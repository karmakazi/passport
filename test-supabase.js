// Test script to verify Supabase connection and setup
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('\n🧪 Testing Supabase Connection...\n')

// Check if credentials are set
if (!supabaseUrl || supabaseUrl === 'YOUR_PROJECT_URL_HERE') {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL not set in .env.local')
  process.exit(1)
}

if (!supabaseKey || supabaseKey === 'YOUR_PUBLISHABLE_KEY_HERE') {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY not set in .env.local')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log(`📍 Project URL: ${supabaseUrl}`)
console.log(`🔑 API Key: ${supabaseKey.substring(0, 20)}...`)

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)
console.log('✅ Supabase client created\n')

// Test function
async function runTests() {
  try {
    // Test 1: Create a test user
    console.log('📝 Test 1: Creating test user...')
    const testPostalCode = 'L4C'
    const testDeviceId = `test-device-${Date.now()}`
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        postal_code: testPostalCode,
        device_id: testDeviceId
      })
      .select()
      .single()

    if (userError) {
      console.error('❌ Failed to create user:', userError.message)
      console.error('   Details:', userError)
      return false
    }

    console.log('✅ Test user created successfully!')
    console.log(`   User ID: ${userData.id}`)
    console.log(`   Postal Code: ${userData.postal_code}`)
    console.log(`   Device ID: ${userData.device_id}\n`)

    // Test 2: Read the user back
    console.log('📖 Test 2: Reading user data...')
    const { data: readUser, error: readError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userData.id)
      .single()

    if (readError) {
      console.error('❌ Failed to read user:', readError.message)
      return false
    }

    console.log('✅ User data retrieved successfully!\n')

    // Test 3: Add a collected stamp
    console.log('📝 Test 3: Creating collected stamp...')
    const { data: stampData, error: stampError } = await supabase
      .from('collected_stamps')
      .insert({
        user_id: userData.id,
        location_id: 'loc1'
      })
      .select()
      .single()

    if (stampError) {
      console.error('❌ Failed to create stamp:', stampError.message)
      console.error('   Details:', stampError)
      return false
    }

    console.log('✅ Stamp created successfully!')
    console.log(`   Stamp ID: ${stampData.id}`)
    console.log(`   Location: ${stampData.location_id}`)
    console.log(`   Collected at: ${stampData.collected_at}\n`)

    // Test 4: Read stamps for user
    console.log('📖 Test 4: Reading user stamps...')
    const { data: stamps, error: stampsError } = await supabase
      .from('collected_stamps')
      .select('*')
      .eq('user_id', userData.id)

    if (stampsError) {
      console.error('❌ Failed to read stamps:', stampsError.message)
      return false
    }

    console.log(`✅ Found ${stamps.length} stamp(s) for user\n`)

    // Test 5: Create contest entry
    console.log('📝 Test 5: Creating contest entry...')
    const { data: contestData, error: contestError } = await supabase
      .from('contest_entries')
      .insert({
        user_id: userData.id
      })
      .select()
      .single()

    if (contestError) {
      console.error('❌ Failed to create contest entry:', contestError.message)
      return false
    }

    console.log('✅ Contest entry created successfully!\n')

    // Cleanup: Delete test data
    console.log('🧹 Cleaning up test data...')
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userData.id)

    if (deleteError) {
      console.error('⚠️  Failed to cleanup test data:', deleteError.message)
      console.log('   You may need to manually delete the test user from Supabase')
    } else {
      console.log('✅ Test data cleaned up successfully\n')
    }

    return true

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return false
  }
}

// Run the tests
runTests().then(success => {
  if (success) {
    console.log('✅ ✅ ✅ All tests passed! Supabase is ready to use! ✅ ✅ ✅\n')
    process.exit(0)
  } else {
    console.log('\n❌ Tests failed. Please check the errors above.\n')
    console.log('Common issues:')
    console.log('  1. Make sure you ran the SQL setup script to create tables')
    console.log('  2. Check that Row Level Security policies are set up')
    console.log('  3. Verify your API credentials are correct\n')
    process.exit(1)
  }
})

