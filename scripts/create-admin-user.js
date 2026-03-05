/**
 * Script to create admin user in Supabase
 * Run this with: node scripts/create-admin-user.js
 * 
 * Make sure to set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment
 * or create a .env.local file with these values
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') })
dotenv.config({ path: join(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing required environment variables')
  console.error('Please set VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nYou can find the Service Role Key in:')
  console.error('Supabase Dashboard → Project Settings → API → service_role key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const ADMIN_EMAIL = 'admin@75fluent.com'
const ADMIN_PASSWORD = 'admin123'

async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === ADMIN_EMAIL)
    
    if (existingUser) {
      console.log(`User ${ADMIN_EMAIL} already exists with ID: ${existingUser.id}`)
      
      // Check if already in admin_users table
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', existingUser.id)
        .single()
      
      if (adminUser) {
        console.log('User is already in admin_users table')
        return
      }
      
      // Add to admin_users table
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: existingUser.id,
          email: ADMIN_EMAIL,
        })
      
      if (insertError) {
        console.error('Error adding user to admin_users:', insertError)
        process.exit(1)
      }
      
      console.log('✅ Successfully added user to admin_users table')
      return
    }
    
    // Create new user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // Auto-confirm email
    })
    
    if (createError) {
      console.error('Error creating user:', createError)
      process.exit(1)
    }
    
    console.log(`✅ Created user ${ADMIN_EMAIL} with ID: ${newUser.user.id}`)
    
    // Add to admin_users table
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert({
        id: newUser.user.id,
        email: ADMIN_EMAIL,
      })
    
    if (insertError) {
      console.error('Error adding user to admin_users:', insertError)
      process.exit(1)
    }
    
    console.log('✅ Successfully added user to admin_users table')
    console.log('\nAdmin credentials:')
    console.log(`Email: ${ADMIN_EMAIL}`)
    console.log(`Password: ${ADMIN_PASSWORD}`)
    
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

createAdminUser()
