# Admin Account Setup

## Quick Setup

To add the admin account (`admin@75fluent.com` / `admin123`), follow these steps:

### Option 1: Using Supabase Dashboard (Recommended)

1. **Create the user in Supabase Auth:**
   - Go to your Supabase Dashboard
   - Navigate to **Authentication** → **Users**
   - Click **"Add user"** → **"Create new user"**
   - Enter:
     - **Email**: `admin@75fluent.com`
     - **Password**: `admin123`
     - **Auto Confirm User**: ON (toggle this on)
   - Click **"Create user"**

2. **Run the migration:**
   - Go to **SQL Editor** in Supabase Dashboard
   - Run the migration file: `supabase/migrations/005_add_admin_user.sql`
   - Or execute this SQL:
     ```sql
     INSERT INTO admin_users (id, email)
     SELECT id, email
     FROM auth.users
     WHERE email = 'admin@75fluent.com'
     ON CONFLICT (id) DO NOTHING;
     ```

3. **Verify:**
   - Check that the user appears in the `admin_users` table
   - Try logging in at `/admin/login` with the credentials

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Apply all migrations (including the admin user migration)
supabase db push

# Or apply just the admin migration
supabase migration up
```

**Note:** You still need to create the user in Supabase Auth first (Step 1 above).

### Option 3: Using the Script (Requires Service Role Key)

If you have the Supabase Service Role Key:

1. Create a `.env.local` file with:
   ```
   SUPABASE_URL=https://ttkytuvgnyyzreyzpapa.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install dotenv
   ```

3. Run the script:
   ```bash
   node scripts/create-admin-user.js
   ```

## Verification

After setup, you should be able to:
- Log in at `/admin/login` with `admin@75fluent.com` / `admin123`
- Access the admin dashboard at `/admin`
- View analytics and user statistics

## Troubleshooting

- **User not found error**: Make sure you created the user in Supabase Auth first
- **Permission denied**: Ensure you're using the service role key or have proper database permissions
- **Migration fails**: Check that the `admin_users` table exists (run `004_admin_schema.sql` first)
