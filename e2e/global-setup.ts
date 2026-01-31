import path from 'path';
import { fileURLToPath } from 'url';
import { config as loadEnv } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env.test');

loadEnv({ path: envPath, override: true });

async function globalSetup() {
  console.log('🚀 Starting E2E test setup...');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      '⚠️  Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.test'
    );
    console.warn(
      '   Copy from .env.test.example and fill in your test Supabase credentials'
    );
  } else {
    console.log('✅ Test database config loaded from .env.test');
  }

  console.log('✅ Global setup completed');
}

export default globalSetup;
