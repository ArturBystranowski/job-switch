import path from 'path';
import { config as loadEnv } from 'dotenv';
import { deleteAllTestUsers } from './utils/cleanup';

loadEnv({ path: path.resolve(process.cwd(), '.env.test') });

async function globalTeardown() {
  console.log('🧹 Starting E2E test teardown...');

  await deleteAllTestUsers();

  console.log('✅ Global teardown completed');
}

export default globalTeardown;
