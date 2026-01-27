# Supabase Integration Guide - JobSwitch

## 📋 Overview

This document provides a complete guide for integrating Supabase with the JobSwitch React + Vite application, following the 10xDevs course workflow.

---

## 🗂️ File Structure

```
job-switch/
├── src/
│   ├── db/
│   │   ├── index.ts                    # Barrel exports
│   │   ├── supabase.client.ts          # Supabase client initialization
│   │   └── SupabaseProvider.tsx        # React Context Provider
│   ├── types/
│   │   └── database.types.ts           # Auto-generated DB types
│   └── vite-env.d.ts                   # Environment variables types
├── .env.local                          # Local environment variables (not in git)
├── SUPABASE_ENV_SETUP.md              # Environment setup instructions
└── docs/
    └── SUPABASE_INTEGRATION.md         # This file
```

---

## 🚀 Setup Steps

### 1. Generate TypeScript Types

Generate types from your local Supabase database:

```powershell
npm run db:types
```

This creates `src/types/database.types.ts` with full type definitions for all tables, views, functions, and enums.

**Script definition in `package.json`:**
```json
"db:types": "supabase gen types typescript --local > src/types/database.types.ts"
```

### 2. Install Supabase Client

```powershell
npm install @supabase/supabase-js
```

### 3. Configure Environment Variables

Create `.env.local` file in project root:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_anon_key_from_supabase_status
```

**To get your credentials:**
```powershell
npx supabase status -o env
```

Look for `API_URL` and `ANON_KEY`.

### 4. Created Files

All necessary files have been created:

✅ `src/db/supabase.client.ts` - Supabase client with type safety
✅ `src/db/SupabaseProvider.tsx` - React Context Provider
✅ `src/db/index.ts` - Barrel exports
✅ `src/vite-env.d.ts` - Environment variable types

---

## 💻 Usage

### Option 1: Direct Client Import (Simple)

```typescript
import { supabaseClient } from '@/db/supabase.client';

// Fetch roles
const { data: roles, error } = await supabaseClient
  .from('roles')
  .select('*')
  .order('id');

// Type-safe response!
// roles is type: Array<{ id: number; name: string; description: string; created_at: string }>
```

### Option 2: React Context Provider (Recommended)

**Step 1:** Wrap your app with `SupabaseProvider` in `main.tsx`:

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SupabaseProvider } from './db';
import App from './App.tsx';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </StrictMode>
);
```

**Step 2:** Use the hook in any component:

```typescript
import { useSupabase } from '@/db';

function RolesList() {
  const supabase = useSupabase();
  
  const fetchRoles = async () => {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('id');
    
    if (error) console.error('Error fetching roles:', error);
    return data;
  };

  // ... rest of component
}
```

---

## 🎯 Type-Safe Database Queries

Thanks to generated types, all queries are fully type-safe:

### Select Queries

```typescript
import { supabaseClient } from '@/db';

// Fetch all roles
const { data: roles } = await supabaseClient
  .from('roles')
  .select('*');
// roles: Array<{ id: number; name: string; description: string; created_at: string }>

// Fetch roadmap steps for a role
const { data: steps } = await supabaseClient
  .from('roadmap_steps')
  .select('*')
  .eq('role_id', 1)
  .order('order_number');
// steps: Array<RoadmapStep>

// Complex join query
const { data: roadmap } = await supabaseClient
  .from('roadmap_steps')
  .select(`
    *,
    role:roles(*),
    tasks:step_tasks(*)
  `)
  .eq('role_id', 1);
```

### Insert Queries

```typescript
// Mark step task as completed
const { data, error } = await supabaseClient
  .from('user_step_progress')
  .insert({
    user_id: userId,
    step_task_id: taskId,
    completed_at: new Date().toISOString()
  });
```

### Update Queries

```typescript
// Update user profile
const { error } = await supabaseClient
  .from('profiles')
  .update({
    selected_role_id: 1,
    ai_recommendations: {
      recommendations: [/* ... */],
      generated_at: new Date().toISOString()
    }
  })
  .eq('id', userId);
```

---

## 🔐 Authentication

### Basic Auth Flow

```typescript
import { supabaseClient } from '@/db';

// Sign up
const { data, error } = await supabaseClient.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword123'
});

// Sign in
const { data, error } = await supabaseClient.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword123'
});

// Get current user
const { data: { user } } = await supabaseClient.auth.getUser();

// Sign out
await supabaseClient.auth.signOut();
```

### Auth Hook (recommended)

Create `src/hooks/useAuth.ts`:

```typescript
import { useState, useEffect } from 'react';
import { useSupabase } from '@/db';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  return { user, loading };
}
```

---

## 📦 Storage (CV Upload)

### Upload CV File

```typescript
import { supabaseClient } from '@/db';

async function uploadCV(userId: string, file: File) {
  const filePath = `${userId}/cv.pdf`;
  
  const { data, error } = await supabaseClient
    .storage
    .from('user-cvs')
    .upload(filePath, file, {
      upsert: true // Replace if exists
    });

  if (!error) {
    // Update profile
    await supabaseClient
      .from('profiles')
      .update({ cv_uploaded_at: new Date().toISOString() })
      .eq('id', userId);
  }

  return { data, error };
}
```

### Get CV URL

```typescript
const { data } = supabaseClient
  .storage
  .from('user-cvs')
  .getPublicUrl(`${userId}/cv.pdf`);

console.log('CV URL:', data.publicUrl);
```

---

## 🔄 Real-time Subscriptions

```typescript
import { useEffect } from 'react';
import { useSupabase } from '@/db';

function ProgressTracker({ userId }: { userId: string }) {
  const supabase = useSupabase();

  useEffect(() => {
    // Subscribe to user progress changes
    const channel = supabase
      .channel('progress-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_step_progress',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('New progress:', payload.new);
          // Update UI
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  return <div>Progress tracking...</div>;
}
```

---

## 🧪 Testing Connection

Create a test component to verify everything works:

```typescript
// src/components/SupabaseTest.tsx
import { useEffect, useState } from 'react';
import { useSupabase } from '@/db';

export function SupabaseTest() {
  const supabase = useSupabase();
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('roles')
      .select('*')
      .then(({ data, error }) => {
        if (error) console.error('Error:', error);
        else setRoles(data || []);
      });
  }, [supabase]);

  return (
    <div>
      <h2>Roles from Supabase:</h2>
      <ul>
        {roles.map((role) => (
          <li key={role.id}>
            {role.name} - {role.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🔧 Useful Commands

```powershell
# Start local Supabase
npm run supabase:start

# Stop local Supabase
npm run supabase:stop

# Check Supabase status
npm run supabase:status

# Regenerate types after schema changes
npm run db:types

# Get environment variables
npx supabase status -o env

# Reset database (WARNING: deletes all data!)
npm run supabase:reset
```

---

## 📚 Additional Resources

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [React Integration Guide](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)

---

## ✅ Checklist

- [x] TypeScript types generated from database
- [x] @supabase/supabase-js installed
- [x] Supabase client created with type safety
- [x] React Context Provider setup
- [x] Environment variables configured
- [x] .gitignore includes .env.local
- [ ] Wrap App with SupabaseProvider in main.tsx
- [ ] Test connection with SupabaseTest component
- [ ] Create auth hooks
- [ ] Setup Storage bucket for CVs

---

## 🎉 Next Steps (from Course)

1. **Test Connection** - Add SupabaseProvider to main.tsx and test with SupabaseTest component
2. **Create API Contracts** - Define TypeScript interfaces for API requests/responses
3. **Build Edge Functions** - Implement AI recommendation logic
4. **Develop UI Components** - Auth screens, questionnaire, roadmap views

You're now ready to start building the application! 🚀
