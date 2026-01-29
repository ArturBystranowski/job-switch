import { createClient } from '@supabase/supabase-js';

export async function cleanupTestUser(userId: string) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
      'Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.test - skipping cleanup'
    );
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    await supabase.from('user_progress').delete().eq('user_id', userId);
    await supabase.from('profiles').delete().eq('id', userId);
    console.log(`Cleaned up data for user: ${userId}`);
  } catch (error) {
    console.error('Error cleaning up test user:', error);
  }
}

export async function deleteTestUserByEmail(email: string) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Missing Supabase credentials - skipping cleanup');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { data: users } = await supabase.auth.admin.listUsers();
    const testUser = users?.users.find((u) => u.email === email);

    if (testUser) {
      await supabase.from('user_progress').delete().eq('user_id', testUser.id);
      await supabase.from('profiles').delete().eq('id', testUser.id);
      await supabase.auth.admin.deleteUser(testUser.id);
      console.log(`Deleted test user: ${email}`);
    }
  } catch (error) {
    console.error('Error deleting test user:', error);
  }
}

const TEST_USER_EMAIL_PATTERN = /^test-.*@example\.com$/;

export async function deleteAllTestUsers() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
      'Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.test - skipping teardown cleanup'
    );
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { data } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const users = data?.users ?? [];
    const testUsers = users.filter(
      (u) => u.email != null && TEST_USER_EMAIL_PATTERN.test(u.email)
    );

    for (const user of testUsers) {
      await supabase.from('user_progress').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.auth.admin.deleteUser(user.id);
      console.log(`Teardown: deleted test user ${user.email}`);
    }

    if (testUsers.length > 0) {
      console.log(`Teardown: cleaned ${testUsers.length} test user(s)`);
    }
  } catch (error) {
    console.error('Error during teardown cleanup:', error);
  }
}
