# Supabase Environment Configuration

## Setup Instructions

Create a file `.env.local` in the project root with the following content:

```env
# Supabase Local Development Configuration
# Get these values by running: npx supabase status -o env

VITE_SUPABASE_URL=your_api_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## How to Get These Values

To get your current local Supabase credentials, run:

```powershell
npx supabase status -o env
```

Look for:
- `API_URL` → use as `VITE_SUPABASE_URL`
- `ANON_KEY` → use as `VITE_SUPABASE_ANON_KEY`

## Production Setup

When deploying to production (Supabase Cloud):

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - Project API keys → anon/public → `VITE_SUPABASE_ANON_KEY`

## Important Notes

⚠️ **NEVER commit `.env.local` to git!** It's already in `.gitignore`.

✅ The `.env.local` file is automatically loaded by Vite during development.

✅ Environment variables prefixed with `VITE_` are exposed to the client-side code.

🔒 Never expose `SERVICE_ROLE_KEY` in frontend code - use it only in backend/Edge Functions!

## Verification

After creating `.env.local`, restart your dev server:

```powershell
npm run dev
```

The Supabase client should now connect successfully!
