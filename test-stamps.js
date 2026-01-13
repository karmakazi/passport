// Diagnostic test to check stamp syncing
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testStampCollection() {
  console.log('\n🔍 Testing Stamp Collection\n')
  
  try {
    // Create a test user
    console.log('1️⃣ Creating test user...')
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        postal_code: 'TST',
        device_id: `test-${Date.now()}`
      })
      .select()
      .single()
    
    if (userError) {
      console.error('❌ Failed to create user:', userError)
      return
    }
    console.log('✅ User created:', user.id)
    
    // Collect 3 stamps
    console.log('\n2️⃣ Collecting 3 stamps...')
    const locations = ['loc1', 'loc2', 'loc3']
    
    for (const locationId of locations) {
      console.log(`   Collecting stamp for ${locationId}...`)
      const { data: stamp, error: stampError } = await supabase
        .from('collected_stamps')
        .insert({
          user_id: user.id,
          location_id: locationId
        })
        .select()
        .single()
      
      if (stampError) {
        console.error(`   ❌ Failed to collect ${locationId}:`, stampError.message)
        console.error('   Details:', stampError)
      } else {
        console.log(`   ✅ Collected ${locationId}:`, stamp.id)
      }
    }
    
    // Query all stamps for this user
    console.log('\n3️⃣ Querying collected stamps...')
    const { data: stamps, error: queryError } = await supabase
      .from('collected_stamps')
      .select('*')
      .eq('user_id', user.id)
    
    if (queryError) {
      console.error('❌ Failed to query stamps:', queryError)
      return
    }
    
    console.log(`✅ Found ${stamps.length} stamps:`)
    stamps.forEach(stamp => {
      console.log(`   - ${stamp.location_id} (collected at: ${stamp.collected_at})`)
    })
    
    // Query ALL stamps in database
    console.log('\n4️⃣ Querying ALL stamps in database...')
    const { data: allStamps, error: allError } = await supabase
      .from('collected_stamps')
      .select('*, users(postal_code, device_id)')
      .order('collected_at', { ascending: false })
      .limit(20)
    
    if (allError) {
      console.error('❌ Failed to query all stamps:', allError)
    } else {
      console.log(`\n📊 Recent stamps in database (showing last 20):`)
      allStamps.forEach(stamp => {
        console.log(`   - User: ${stamp.users?.postal_code} / Location: ${stamp.location_id} / Time: ${stamp.collected_at}`)
      })
    }
    
    // Cleanup
    console.log('\n5️⃣ Cleaning up test data...')
    await supabase.from('users').delete().eq('id', user.id)
    console.log('✅ Test data cleaned up')
    
    console.log('\n✅ Test completed successfully!\n')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Check for YOUR actual data
async function checkYourData() {
  console.log('\n🔎 Checking YOUR actual data in Supabase...\n')
  
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError)
      return
    }
    
    console.log(`📝 Found ${users.length} user(s) in database:\n`)
    
    for (const user of users) {
      console.log(`👤 User: ${user.postal_code}`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Device: ${user.device_id.substring(0, 15)}...`)
      console.log(`   Created: ${user.created_at}`)
      
      // Get stamps for this user
      const { data: stamps } = await supabase
        .from('collected_stamps')
        .select('*')
        .eq('user_id', user.id)
      
      console.log(`   Stamps: ${stamps?.length || 0} collected`)
      if (stamps && stamps.length > 0) {
        stamps.forEach(stamp => {
          console.log(`      - ${stamp.location_id}`)
        })
      }
      console.log('')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run both tests
async function runAll() {
  await testStampCollection()
  await checkYourData()
}

runAll()

