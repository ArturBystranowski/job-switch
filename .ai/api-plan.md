# REST API Plan - JobSwitch MVP

## Overview

This document outlines the REST API architecture for JobSwitch, a career guidance application for IT job transitions. The API leverages Supabase's infrastructure with PostgreSQL database, Row Level Security (RLS), and Edge Functions for AI operations.

**Architecture Pattern:**
- Direct Supabase client queries for standard CRUD operations
- Supabase Edge Functions for AI-powered business logic
- Supabase Auth for authentication
- Supabase Storage for CV file handling

---

## 1. Resources

| Resource | Database Table | Description |
|----------|---------------|-------------|
| **Auth** | `auth.users` (Supabase) | User authentication and session management |
| **Profiles** | `profiles` | User business data, questionnaire responses, AI recommendations |
| **Roles** | `roles` | IT role dictionary (predefined data) |
| **Roadmap Steps** | `roadmap_steps` | Development path steps for each role |
| **Step Variants** | `step_variants` | Alternative learning paths for each step |
| **User Progress** | `user_step_progress` | User's completed variants tracking |
| **CV Storage** | Supabase Storage | CV file storage (PDF/DOCX) |

---

## 2. Endpoints

### 2.1. Authentication Endpoints - TO BE IMPLEMENTAD AT LATER STAGE
<!-- 
Authentication is handled by Supabase Auth SDK. These are the logical operations rather than custom endpoints.

#### 2.1.1. Register User

- **Method:** `POST`
- **Path:** `/auth/v1/signup`
- **Description:** Create new user account with email and password
- **Request Payload:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
- **Response Payload (201 Created):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "created_at": "2025-01-26T12:00:00Z",
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```
- **Success Codes:**
  - `201 Created` - User successfully registered
- **Error Codes:**
  - `400 Bad Request` - Invalid email format or weak password
  - `409 Conflict` - Email already exists
  - `422 Unprocessable Entity` - Validation failed

#### 2.1.2. Login User

- **Method:** `POST`
- **Path:** `/auth/v1/token?grant_type=password`
- **Description:** Authenticate user and obtain JWT token
- **Request Payload:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
- **Response Payload (200 OK):**
```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```
- **Success Codes:**
  - `200 OK` - Login successful
- **Error Codes:**
  - `400 Bad Request` - Invalid credentials
  - `401 Unauthorized` - Authentication failed

#### 2.1.3. Logout User

- **Method:** `POST`
- **Path:** `/auth/v1/logout`
- **Description:** Invalidate user session
- **Headers:** `Authorization: Bearer {access_token}`
- **Response:** `204 No Content`
- **Success Codes:**
  - `204 No Content` - Logout successful
- **Error Codes:**
  - `401 Unauthorized` - Invalid or expired token

#### 2.1.4. Refresh Token

- **Method:** `POST`
- **Path:** `/auth/v1/token?grant_type=refresh_token`
- **Description:** Refresh access token using refresh token
- **Request Payload:**
```json
{
  "refresh_token": "refresh_token"
}
```
- **Response Payload (200 OK):**
```json
{
  "access_token": "new_jwt_token",
  "refresh_token": "new_refresh_token",
  "token_type": "bearer",
  "expires_in": 3600
}
```
- **Success Codes:**
  - `200 OK` - Token refreshed successfully
- **Error Codes:**
  - `400 Bad Request` - Invalid refresh token
  - `401 Unauthorized` - Refresh token expired

--- -->

### 2.2. Profile Endpoints

#### 2.2.1. Get Current User Profile

- **Method:** `GET`
- **Path:** `/rest/v1/profiles?select=*,roles(*)`
- **Description:** Retrieve authenticated user's profile with selected role details
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `select` - Fields to return (supports nested relations)
- **Response Payload (200 OK):**
```json
{
  "id": "uuid",
  "questionnaire_responses": {
    "work_style": "independent",
    "client_interaction": "minimal",
    "aesthetic_focus": "high",
    "teamwork_preference": "medium",
    "problem_solving_approach": "analytical"
  },
  "cv_uploaded_at": "2025-01-26T12:00:00Z",
  "ai_recommendations": {
    "recommendations": [
      {
        "role_id": 1,
        "role_name": "Frontend Developer",
        "justification": "Based on your CV and preferences..."
      },
      {
        "role_id": 2,
        "role_name": "UX/UI Designer",
        "justification": "Your experience indicates..."
      }
    ],
    "generated_at": "2025-01-26T12:00:00Z"
  },
  "selected_role_id": null,
  "created_at": "2025-01-26T10:00:00Z",
  "roles": null
}
```
- **Success Codes:**
  - `200 OK` - Profile retrieved successfully
- **Error Codes:**
  - `401 Unauthorized` - Invalid or missing token
  - `404 Not Found` - Profile not found

#### 2.2.2. Update Questionnaire Responses

- **Method:** `PATCH`
- **Path:** `/rest/v1/profiles?id=eq.{user_id}`
- **Description:** Save user's questionnaire responses
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Payload:**
```json
{
  "questionnaire_responses": {
    "work_style": "independent",
    "client_interaction": "minimal",
    "aesthetic_focus": "high",
    "teamwork_preference": "medium",
    "problem_solving_approach": "analytical"
  }
}
```
- **Response Payload (200 OK):**
```json
{
  "id": "uuid",
  "questionnaire_responses": {
    "work_style": "independent",
    "client_interaction": "minimal",
    "aesthetic_focus": "high",
    "teamwork_preference": "medium",
    "problem_solving_approach": "analytical"
  },
  "cv_uploaded_at": null,
  "ai_recommendations": null,
  "selected_role_id": null,
  "created_at": "2025-01-26T10:00:00Z"
}
```
- **Success Codes:**
  - `200 OK` - Questionnaire saved successfully
- **Error Codes:**
  - `400 Bad Request` - Invalid questionnaire structure
  - `401 Unauthorized` - Invalid or missing token
  - `422 Unprocessable Entity` - Validation failed

#### 2.2.3. Select Final Role

- **Method:** `PATCH`
- **Path:** `/rest/v1/profiles?id=eq.{user_id}`
- **Description:** Set user's final role selection (irreversible in MVP)
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Payload:**
```json
{
  "selected_role_id": 1
}
```
- **Response Payload (200 OK):**
```json
{
  "id": "uuid",
  "questionnaire_responses": {...},
  "cv_uploaded_at": "2025-01-26T12:00:00Z",
  "ai_recommendations": {...},
  "selected_role_id": 1,
  "created_at": "2025-01-26T10:00:00Z"
}
```
- **Success Codes:**
  - `200 OK` - Role selected successfully
- **Error Codes:**
  - `400 Bad Request` - Invalid role_id or role already selected
  - `401 Unauthorized` - Invalid or missing token
  - `404 Not Found` - Role not found
  - `409 Conflict` - Role already selected (cannot change in MVP)

---

### 2.3. CV Upload Endpoints

#### 2.3.1. Upload CV File

- **Method:** `POST`
- **Path:** `/storage/v1/object/cv/{user_id}/cv.pdf`
- **Description:** Upload user's CV file (one-time operation)
- **Headers:**
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/pdf` or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Request Body:** Binary file data
- **Query Parameters:** None
- **Response Payload (200 OK):**
```json
{
  "Key": "cv/{user_id}/cv.pdf",
  "Id": "uuid"
}
```
- **Success Codes:**
  - `200 OK` - File uploaded successfully
- **Error Codes:**
  - `400 Bad Request` - Invalid file type (must be PDF/DOCX)
  - `401 Unauthorized` - Invalid or missing token
  - `409 Conflict` - CV already uploaded
  - `413 Payload Too Large` - File exceeds 1 MB limit

#### 2.3.2. Get CV Download URL

- **Method:** `POST`
- **Path:** `/storage/v1/object/sign/cv/{user_id}/cv.pdf`
- **Description:** Get signed URL for CV download
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Payload:**
```json
{
  "expiresIn": 3600
}
```
- **Response Payload (200 OK):**
```json
{
  "signedURL": "https://..."
}
```
- **Success Codes:**
  - `200 OK` - Signed URL generated
- **Error Codes:**
  - `401 Unauthorized` - Invalid or missing token
  - `404 Not Found` - CV file not found

---

### 2.4. Roles Endpoints

#### 2.4.1. List All Roles

- **Method:** `GET`
- **Path:** `/rest/v1/roles`
- **Description:** Retrieve all available IT roles
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `select` - Fields to return (default: `*`)
  - `order` - Sort order (e.g., `name.asc`)
- **Response Payload (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Frontend Developer",
    "description": "Build interactive user interfaces using HTML, CSS, JavaScript and modern frameworks like React.",
    "created_at": "2025-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Backend Developer",
    "description": "Build robust APIs and server logic using Node.js, Python or Java.",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```
- **Success Codes:**
  - `200 OK` - Roles retrieved successfully
- **Error Codes:**
  - `401 Unauthorized` - Invalid or missing token

#### 2.4.2. Get Role by ID

- **Method:** `GET`
- **Path:** `/rest/v1/roles?id=eq.{role_id}`
- **Description:** Retrieve specific role details
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `select` - Fields to return
- **Response Payload (200 OK):**
```json
{
  "id": 1,
  "name": "Frontend Developer",
  "description": "Build interactive user interfaces using HTML, CSS, JavaScript and modern frameworks like React.",
  "created_at": "2025-01-01T00:00:00Z"
}
```
- **Success Codes:**
  - `200 OK` - Role retrieved successfully
- **Error Codes:**
  - `401 Unauthorized` - Invalid or missing token
  - `404 Not Found` - Role not found

---

### 2.5. Roadmap Endpoints

#### 2.5.1. Get Roadmap for Role

- **Method:** `GET`
- **Path:** `/rest/v1/roadmap_steps?role_id=eq.{role_id}&select=*,step_variants(*)`
- **Description:** Retrieve complete roadmap with all steps and variants for a role
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `role_id` - Filter by role ID (required)
  - `select` - Fields to return (supports nested relations)
  - `order` - Sort order (default: `order_number.asc`)
- **Response Payload (200 OK):**
```json
[
  {
    "id": 1,
    "role_id": 1,
    "order_number": 1,
    "title": "HTML and CSS Fundamentals",
    "description": "Learn HTML document structure and CSS styling. Understand box model, flexbox and grid.",
    "created_at": "2025-01-01T00:00:00Z",
    "step_variants": [
      {
        "id": 1,
        "step_id": 1,
        "order_number": 1,
        "title": "Video Course",
        "description": "Complete online video course covering HTML/CSS basics.",
        "estimated_hours": 20,
        "resources": {
          "links": [
            {
              "title": "MDN Web Docs - HTML",
              "url": "https://developer.mozilla.org/en-US/docs/Web/HTML",
              "type": "documentation"
            }
          ]
        },
        "created_at": "2025-01-01T00:00:00Z"
      },
      {
        "id": 2,
        "step_id": 1,
        "order_number": 2,
        "title": "Interactive Tutorial",
        "description": "Learn by doing with interactive exercises.",
        "estimated_hours": 15,
        "resources": {
          "links": [
            {
              "title": "FreeCodeCamp - Responsive Web Design",
              "url": "https://www.freecodecamp.org/learn/responsive-web-design/",
              "type": "course"
            }
          ]
        },
        "created_at": "2025-01-01T00:00:00Z"
      }
    ]
  },
  {
    "id": 2,
    "role_id": 1,
    "order_number": 2,
    "title": "JavaScript - Fundamentals",
    "description": "Master JavaScript basics: variables, functions, loops, objects and DOM manipulation.",
    "created_at": "2025-01-01T00:00:00Z",
    "step_variants": [...]
  }
]
```
- **Success Codes:**
  - `200 OK` - Roadmap retrieved successfully
- **Error Codes:**
  - `401 Unauthorized` - Invalid or missing token
  - `404 Not Found` - Role not found

#### 2.5.2. Get Single Step with Variants

- **Method:** `GET`
- **Path:** `/rest/v1/roadmap_steps?id=eq.{step_id}&select=*,step_variants(*)`
- **Description:** Retrieve single roadmap step with its variants
- **Headers:** `Authorization: Bearer {access_token}`
- **Response Payload (200 OK):**
```json
{
  "id": 1,
  "role_id": 1,
  "order_number": 1,
  "title": "HTML and CSS Fundamentals",
  "description": "Learn HTML document structure and CSS styling.",
  "created_at": "2025-01-01T00:00:00Z",
  "step_variants": [...]
}
```
- **Success Codes:**
  - `200 OK` - Step retrieved successfully
- **Error Codes:**
  - `401 Unauthorized` - Invalid or missing token
  - `404 Not Found` - Step not found

---

### 2.6. User Progress Endpoints

#### 2.6.1. Get User Progress

- **Method:** `GET`
- **Path:** `/rest/v1/user_step_progress?user_id=eq.{user_id}&select=*,step_variants(*, roadmap_steps(*))`
- **Description:** Retrieve all completed variants for authenticated user
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `select` - Fields to return (supports nested relations)
  - `order` - Sort order (default: `completed_at.desc`)
- **Response Payload (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": "uuid",
    "step_variant_id": 1,
    "completed_at": "2025-01-26T14:00:00Z",
    "step_variants": {
      "id": 1,
      "step_id": 1,
      "order_number": 1,
      "title": "Video Course",
      "roadmap_steps": {
        "id": 1,
        "role_id": 1,
        "order_number": 1,
        "title": "HTML and CSS Fundamentals"
      }
    }
  }
]
```
- **Success Codes:**
  - `200 OK` - Progress retrieved successfully
- **Error Codes:**
  - `401 Unauthorized` - Invalid or missing token

#### 2.6.2. Mark Variant as Completed

- **Method:** `POST`
- **Path:** `/rest/v1/user_step_progress`
- **Description:** Mark a step variant as completed
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Payload:**
```json
{
  "user_id": "uuid",
  "step_variant_id": 1
}
```
- **Response Payload (201 Created):**
```json
{
  "id": 1,
  "user_id": "uuid",
  "step_variant_id": 1,
  "completed_at": "2025-01-26T14:00:00Z"
}
```
- **Success Codes:**
  - `201 Created` - Variant marked as completed
  - `200 OK` - Variant already completed (idempotent)
- **Error Codes:**
  - `400 Bad Request` - Invalid step_variant_id
  - `401 Unauthorized` - Invalid or missing token
  - `404 Not Found` - Step variant not found
  - `409 Conflict` - Variant already completed (if not using ON CONFLICT)

#### 2.6.3. Unmark Variant as Completed

- **Method:** `DELETE`
- **Path:** `/rest/v1/user_step_progress?user_id=eq.{user_id}&step_variant_id=eq.{variant_id}`
- **Description:** Remove completion mark from a variant
- **Headers:** `Authorization: Bearer {access_token}`
- **Response:** `204 No Content`
- **Success Codes:**
  - `204 No Content` - Completion mark removed
- **Error Codes:**
  - `401 Unauthorized` - Invalid or missing token
  - `404 Not Found` - Progress record not found

#### 2.6.4. Get Progress Statistics

- **Method:** `GET`
- **Path:** `/functions/v1/get-progress-stats`
- **Description:** Calculate user's progress percentage for selected role
- **Headers:** `Authorization: Bearer {access_token}`
- **Response Payload (200 OK):**
```json
{
  "total_variants": 30,
  "completed_variants": 5,
  "progress_percentage": 16.67,
  "steps_summary": [
    {
      "step_id": 1,
      "step_title": "HTML and CSS Fundamentals",
      "total_variants": 3,
      "completed_variants": 2,
      "is_step_completed": false
    }
  ]
}
```
- **Success Codes:**
  - `200 OK` - Statistics calculated successfully
- **Error Codes:**
  - `401 Unauthorized` - Invalid or missing token
  - `400 Bad Request` - No role selected

---

### 2.7. AI Edge Function Endpoints

#### 2.7.1. Generate AI Recommendations

- **Method:** `POST`
- **Path:** `/functions/v1/generate-recommendations`
- **Description:** Analyze CV and questionnaire to generate two role recommendations with justifications
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Payload:**
```json
{
  "user_id": "uuid"
}
```
- **Response Payload (200 OK):**
```json
{
  "recommendations": [
    {
      "role_id": 1,
      "role_name": "Frontend Developer",
      "justification": "Based on your CV and preferences, Frontend Development is an excellent match. Your background in design and attention to detail aligns with creating user interfaces. Your preference for independent work and high aesthetic focus suggests you would excel in crafting visual experiences. The analytical problem-solving approach you mentioned will help you debug and optimize web applications effectively."
    },
    {
      "role_id": 5,
      "role_name": "UX/UI Designer",
      "justification": "Your experience indicates strong potential for UX/UI Design. The combination of aesthetic sensibility and user-focused thinking shown in your responses matches this role well. Your minimal client interaction preference works well as UX designers often work through product managers. The medium teamwork preference aligns with collaborative design processes while allowing independent creative work."
    }
  ],
  "generated_at": "2025-01-26T12:00:00Z"
}
```
- **Success Codes:**
  - `200 OK` - Recommendations generated successfully
- **Error Codes:**
  - `400 Bad Request` - Questionnaire not completed or CV not uploaded
  - `401 Unauthorized` - Invalid or missing token
  - `409 Conflict` - Recommendations already generated
  - `422 Unprocessable Entity` - Invalid questionnaire data
  - `500 Internal Server Error` - AI service error
  - `503 Service Unavailable` - OpenRouter API unavailable

#### 2.7.2. Get CV Analysis Status

- **Method:** `GET`
- **Path:** `/functions/v1/cv-analysis-status`
- **Description:** Check if user can generate recommendations (validation endpoint)
- **Headers:** `Authorization: Bearer {access_token}`
- **Response Payload (200 OK):**
```json
{
  "questionnaire_completed": true,
  "cv_uploaded": true,
  "recommendations_generated": false,
  "role_selected": false,
  "can_generate_recommendations": true,
  "missing_requirements": []
}
```
- **Response Payload when not ready (200 OK):**
```json
{
  "questionnaire_completed": false,
  "cv_uploaded": true,
  "recommendations_generated": false,
  "role_selected": false,
  "can_generate_recommendations": false,
  "missing_requirements": ["questionnaire_responses"]
}
```
- **Success Codes:**
  - `200 OK` - Status retrieved successfully
- **Error Codes:**
  - `401 Unauthorized` - Invalid or missing token

---

## 3. Authentication and Authorization

### 3.1. Authentication Mechanism

**Technology:** Supabase Auth with JWT tokens

**Flow:**
1. User registers or logs in via Supabase Auth endpoints
2. Supabase returns JWT access token and refresh token
3. Client includes JWT in `Authorization: Bearer {token}` header for all requests
4. Supabase validates JWT and extracts user ID (`auth.uid()`)
5. RLS policies use `auth.uid()` to filter data access

### 3.2. Token Management

| Token Type | Lifetime | Storage | Purpose |
|------------|----------|---------|---------|
| Access Token | 1 hour | Memory/Secure storage | API authentication |
| Refresh Token | 7 days | Secure storage | Token renewal |

### 3.3. Row Level Security (RLS) Implementation

All data access is controlled by RLS policies at the database level:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `profiles` | Own only | Own only | Own only | - |
| `roles` | All authenticated | service_role only | - | - |
| `roadmap_steps` | All authenticated | service_role only | - | - |
| `step_variants` | All authenticated | service_role only | - | - |
| `user_step_progress` | Own only | Own only | - | Own only |

### 3.4. Edge Function Authorization

Edge Functions verify JWT tokens and have access to:
- `service_role` key for administrative operations
- User context via validated JWT
- OpenRouter API key (server-side only, never exposed to client)

---

## 4. Validation and Business Logic

### 4.1. Validation Rules by Resource

#### 4.1.1. Profile Validation

| Field | Validation Rules |
|-------|-----------------|
| `questionnaire_responses` | Required JSONB object with specific schema |
| `questionnaire_responses.work_style` | Enum: `independent`, `collaborative`, `mixed` |
| `questionnaire_responses.client_interaction` | Enum: `minimal`, `moderate`, `extensive` |
| `questionnaire_responses.aesthetic_focus` | Enum: `low`, `medium`, `high` |
| `questionnaire_responses.teamwork_preference` | Enum: `low`, `medium`, `high` |
| `questionnaire_responses.problem_solving_approach` | Enum: `analytical`, `creative`, `practical` |
| `selected_role_id` | Must reference valid role, cannot be changed once set |

#### 4.1.2. CV Upload Validation

| Validation | Rule |
|------------|------|
| File size | Maximum 1 MB |
| File type | PDF (`.pdf`) or DOCX (`.docx`) only |
| Upload count | One-time upload per user |
| File naming | Stored as `{user_id}/cv.{extension}` |

#### 4.1.3. Roadmap Steps Validation

| Field | Validation Rules |
|-------|-----------------|
| `order_number` | Integer 1-10, unique per role |
| `title` | Required, non-empty string |
| `description` | Required, non-empty string |

#### 4.1.4. Step Variants Validation

| Field | Validation Rules |
|-------|-----------------|
| `order_number` | Integer 1-3, unique per step |
| `title` | Required, non-empty string |
| `description` | Required, non-empty string |
| `estimated_hours` | Optional positive integer |
| `resources` | Optional JSONB with valid link structure |

#### 4.1.5. User Progress Validation

| Field | Validation Rules |
|-------|-----------------|
| `step_variant_id` | Must reference existing variant |
| `user_id` | Must match authenticated user |
| Uniqueness | User cannot complete same variant twice |

### 4.2. Business Logic Implementation

#### 4.2.1. User Journey Flow

```
1. Registration
   └─> Profile auto-created (trigger)

2. Questionnaire Completion
   └─> Validate all required fields
   └─> Save to profiles.questionnaire_responses

3. CV Upload
   └─> Validate file (size, type)
   └─> Upload to Storage
   └─> Update profiles.cv_uploaded_at

4. Generate Recommendations (Edge Function)
   └─> Verify questionnaire completed
   └─> Verify CV uploaded
   └─> Verify recommendations not already generated
   └─> Extract CV text content
   └─> Call OpenRouter AI with questionnaire + CV
   └─> Parse AI response (2 roles + justifications)
   └─> Save to profiles.ai_recommendations

5. Role Selection
   └─> Verify recommendations exist
   └─> Verify no role already selected
   └─> Validate role_id is from recommendations
   └─> Update profiles.selected_role_id

6. Progress Tracking
   └─> Verify role selected
   └─> Verify variant belongs to selected role
   └─> Insert/delete progress records
   └─> Calculate progress percentage on-demand
```

#### 4.2.2. AI Recommendation Logic (Edge Function)

**Input Processing:**
1. Retrieve user's questionnaire responses from `profiles`
2. Download CV from Storage
3. Extract text content from CV (PDF/DOCX parsing)

**AI Prompt Construction:**
```
System: You are a career advisor specializing in IT roles.

Context:
- User questionnaire: {questionnaire_responses}
- CV content: {cv_text}
- Available roles: {roles_list}

Task:
Analyze the user's background and preferences to recommend the 2 most suitable IT roles.
For each role, provide a 4-6 sentence justification explaining why it's a good match.
Focus on connecting their experience and preferences to role requirements.

Output format:
{
  "recommendations": [
    {"role_id": X, "role_name": "...", "justification": "..."},
    {"role_id": Y, "role_name": "...", "justification": "..."}
  ]
}
```

**Response Processing:**
1. Parse AI JSON response
2. Validate role IDs exist in database
3. Save to `profiles.ai_recommendations`
4. Return formatted recommendations to client

#### 4.2.3. Progress Calculation Logic

**Client-side calculation (recommended for MVP):**
```typescript
function calculateProgress(
  totalVariants: number,
  completedVariants: number
): number {
  if (totalVariants === 0) return 0;
  return Math.round((completedVariants / totalVariants) * 100 * 100) / 100;
}
```

**Edge Function calculation (optional):**
```sql
WITH role_variants AS (
  SELECT COUNT(sv.id) AS total
  FROM step_variants sv
  JOIN roadmap_steps rs ON sv.step_id = rs.id
  WHERE rs.role_id = (SELECT selected_role_id FROM profiles WHERE id = auth.uid())
),
completed AS (
  SELECT COUNT(usp.id) AS count
  FROM user_step_progress usp
  JOIN step_variants sv ON usp.step_variant_id = sv.id
  JOIN roadmap_steps rs ON sv.step_id = rs.id
  WHERE usp.user_id = auth.uid()
    AND rs.role_id = (SELECT selected_role_id FROM profiles WHERE id = auth.uid())
)
SELECT 
  rv.total,
  c.count AS completed,
  ROUND((c.count::DECIMAL / rv.total) * 100, 2) AS percentage
FROM role_variants rv, completed c;
```

### 4.3. Error Handling Strategy

#### 4.3.1. HTTP Status Code Usage

| Code | Usage |
|------|-------|
| `200 OK` | Successful GET, PATCH operations |
| `201 Created` | Successful POST creating new resource |
| `204 No Content` | Successful DELETE |
| `400 Bad Request` | Validation error, malformed request |
| `401 Unauthorized` | Missing or invalid authentication |
| `403 Forbidden` | Authenticated but not authorized |
| `404 Not Found` | Resource doesn't exist |
| `409 Conflict` | Resource state conflict (e.g., already exists) |
| `413 Payload Too Large` | File size exceeds limit |
| `422 Unprocessable Entity` | Semantic validation error |
| `500 Internal Server Error` | Server-side error |
| `503 Service Unavailable` | External service unavailable |

#### 4.3.2. Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Questionnaire responses are incomplete",
    "details": {
      "missing_fields": ["work_style", "aesthetic_focus"]
    }
  }
}
```

#### 4.3.3. Business Logic Error Codes

| Code | Description |
|------|-------------|
| `QUESTIONNAIRE_INCOMPLETE` | Questionnaire not filled before CV analysis |
| `CV_NOT_UPLOADED` | CV not uploaded before generating recommendations |
| `CV_ALREADY_UPLOADED` | Attempting to upload CV twice |
| `RECOMMENDATIONS_EXIST` | Attempting to regenerate recommendations |
| `ROLE_ALREADY_SELECTED` | Attempting to change selected role |
| `ROLE_NOT_IN_RECOMMENDATIONS` | Selecting role not in AI recommendations |
| `ROLE_NOT_SELECTED` | Attempting to track progress without selected role |
| `VARIANT_NOT_IN_ROLE` | Marking variant not in selected role's roadmap |
| `AI_SERVICE_ERROR` | OpenRouter API error |
| `CV_PARSE_ERROR` | Unable to extract text from CV file |

---

## 5. Rate Limiting and Security

### 5.1. Rate Limits

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| Authentication | 10 requests | 1 minute |
| CV Upload | 1 request | 24 hours |
| AI Generation | 3 requests | 1 hour |
| Standard CRUD | 100 requests | 1 minute |

### 5.2. Security Measures

1. **JWT Validation:** All requests require valid JWT token
2. **RLS Policies:** Database-level access control
3. **API Key Protection:** OpenRouter key stored server-side only
4. **File Validation:** Strict file type and size checks
5. **Input Sanitization:** All user inputs sanitized before storage
6. **CORS Configuration:** Restrict to allowed origins only
7. **HTTPS Only:** All traffic encrypted in transit

---

## 6. API Versioning

The API follows Supabase's versioning pattern:
- REST endpoints: `/rest/v1/`
- Auth endpoints: `/auth/v1/`
- Storage endpoints: `/storage/v1/`
- Edge Functions: `/functions/v1/`

Future breaking changes will increment the version number.
