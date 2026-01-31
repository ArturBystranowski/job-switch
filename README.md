# JobSwitch

AI-powered assistant helping people switch into IT by generating the best-matching roles and actionable learning roadmaps.

![Project Status](https://img.shields.io/badge/status-MVP%20in%20progress-yellow)
![Node Version](https://img.shields.io/badge/node-22.x-026e00)
![License](https://img.shields.io/badge/license-MIT-blue)

## Table of contents

- [1. Project name](#1-project-name)
- [2. Project description](#2-project-description)
- [3. Tech stack](#3-tech-stack)
- [4. Getting started locally](#4-getting-started-locally)
- [5. Available scripts](#5-available-scripts)
- [6. Project scope](#6-project-scope)
- [7. Project status](#7-project-status)
- [8. License](#8-license)

## 1. Project name

**JobSwitch** – AI-assisted career switch companion for people entering the IT industry.

## 2. Project description

JobSwitch is a web application that analyzes a user's CV together with a short preference form and then generates **two IT roles that best match the user**, each with a **concise, structured justification**.  
After choosing one of the roles, the user receives a **10-step learning roadmap**, where each step contains **specific tasks** to complete, providing clear and actionable guidance.

The main goals of the product are:

- Help career switchers quickly understand **which IT roles are realistic and well-matched** to their background.
- Provide **clear, practical and finite roadmaps** instead of infinite learning resources.
- Use **AI-generated content** that is then **manually validated** to ensure quality and consistency.

For a full product definition, user stories and success metrics, see the detailed PRD in `.ai/prd.md`.

## 3. Tech stack

The project is implemented as a modern TypeScript + React application with a backend based on Supabase and Edge Functions.

### 3.1 Frontend

From `.ai/tech-stack.md` and `package.json`:

| Technology            | Role / Usage                                                          |
| --------------------- | --------------------------------------------------------------------- |
| **React 19**          | Building interactive views and components.                            |
| **Vite**              | Dev server and bundler with fast HMR and optimized production builds. |
| **TypeScript 5**      | Static typing for safer, more maintainable frontend code.             |
| **Material UI (MUI)** | Primary UI component library, theming and responsive layout.          |
| **ESLint + Prettier** | Linting and formatting for consistent code style.                     |

### 3.2 Backend / Data layer

From `.ai/tech-stack.md`:

| Technology                  | Role / Usage                                                                     |
| --------------------------- | -------------------------------------------------------------------------------- |
| **Supabase (PostgreSQL)**   | Primary database for users, profiles, recommendations and roadmap progress.      |
| **Supabase Auth**           | Authentication (email + password, JWT-based access).                             |
| **Supabase Storage**        | Secure storage of uploaded CV files (PDF/DOCX, max 1 MB).                        |
| **Supabase Edge Functions** | Server-side logic for AI orchestration and secure communication with OpenRouter. |

### 3.3 AI / Recommendation engine

| Technology             | Role / Usage                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| **OpenRouter.ai**      | Access to LLM models used for generating roles, justifications and learning roadmaps.       |
| **Supabase Functions** | Intermediate layer that validates input, calls OpenRouter and returns normalized responses. |

### 3.4 CI/CD, hosting and testing

| Technology                  | Role / Usage                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| **GitHub Actions**          | CI/CD pipelines for build and tests (planned as part of MVP).                              |
| **Netlify**                 | Target hosting platform for the production environment (React app + serverless functions). |
| **Vitest**                  | Unit tests for core logic and components.                                                  |
| **React Testing Library**   | Testing user interactions and rendering of React components.                               |
| **1 E2E test (Playwright)** | Minimal end-to-end test for the main user journey (MVP requirement).                       |

For a more visual overview of the architecture, see `.ai/tech-stack.md`.

## 4. Getting started locally

### 4.1 Prerequisites

- **Node.js 22.x** (see `.nvmrc`)
- **npm** (comes with Node.js)

> Yarn is not required; the project uses npm by default.

### 4.2 Installation

Clone the repository and install dependencies:

```powershell
git clone <your-repo-url>
cd job-switch
npm install
```

If you use `nvm`, you can align with the project Node version:

```powershell
nvm use
```

### 4.3 Running the app in development mode

Start the Vite dev server:

```powershell
npm run dev
```

By default the application will be available at:

```text
http://localhost:3000
```

### 4.4 Production build

Create an optimized production build:

```powershell
npm run build
```

### 4.5 Previewing the production build

Serve and preview the production build locally:

```powershell
npm run preview
```

> Note: Supabase and OpenRouter integration and environment variables are part of the backend setup and will be documented once the corresponding features are implemented. For now, the focus of this repository is the frontend MVP.

## 5. Available scripts

All scripts are defined in `package.json`:

- **`npm run dev`** – starts the Vite development server.
- **`npm run build`** – runs TypeScript project build (`tsc -b`) and then builds the production bundle with Vite.
- **`npm run preview`** – serves the production build locally for manual testing.
- **`npm run lint`** – runs ESLint over the project to ensure code quality.
- **`npm run format`** – formats all supported files in `src/` using Prettier.
- **`npm run format:check`** – checks formatting without writing changes (useful for CI).

## 6. Project scope

The MVP scope is defined in `.ai/prd.md`. Key functional areas include:

- **User authentication**
  - Registration and login with email + password.
  - Secure authentication using hashed passwords and JWT (via Supabase Auth).

- **User inputs**
  - Preference form capturing soft skills, working style, contact with clients, teamwork, aesthetics and more.
  - Single CV upload (`PDF` / `DOCX`, max **1 MB**, one-time only, no re-upload in MVP).

- **AI-based recommendations**
  - Analysis of both **CV** and **form**; form is more important for soft skills.
  - Generation of **two IT roles** and **structured justifications** (4–6 sentences, consistent template).
  - Clear UI showing 2 role cards plus explanation that the choice is final in MVP.

- **Role selection and roadmap**
  - User chooses **one** role (confirmed via a popup, no change possible afterwards).
  - Rendering of a **10-step roadmap** for the selected role.
  - Each step contains **specific tasks** to complete, providing clear and actionable guidance.

- **Progress tracking**
  - Marking steps or tasks as completed.
  - Automatic progress calculation (e.g. progress bar).
  - Persisting user progress on the backend so that it is available after logout/login.

- **Error handling & UX**
  - Clear error messages for CV upload issues (size, format, duplicates).
  - Human-readable messages for network/AI errors.

### 6.1 In scope (MVP)

- No re-analysis of CV after the first upload.
- No editing or changing the chosen role after confirmation.
- No analytics dashboard (KPI tracked on backend or external tools).
- No sharing of roadmaps with other users.
- No AI-driven updates of the roadmap once generated.
- No CV editor.
- No OCR or support for image-based CVs.

### 6.2 Out of scope (beyond MVP)

- Advanced predictive career models.
- Dynamic updates to roadmap steps based on user behavior.
- Integrations with educational platforms.
- Personalized paths based on detailed activity history.
- Gamification system (badges, points, leaderboards, etc.).

## 7. Project status

The project is currently in **MVP development** phase.

Planned high-level milestones (non-exhaustive):

- [x] Define product requirements and tech stack (`.ai/prd.md`, `.ai/tech-stack.md`).
- [x] Set up React + TypeScript + Vite + MUI frontend scaffold.
- [x] Implement Supabase Auth, DB schema and Storage for CVs.
- [x] Implement Supabase Edge Functions for AI integration via OpenRouter.
- [x] Implement main user flow: registration → form → CV upload → role recommendations → roadmap.
- [x] Add unit tests (Vitest + React Testing Library) and at least one E2E test.
- [x] Configure CI/CD (GitHub Actions + Netlify deployment).

This checklist is indicative and may evolve as the MVP is refined.

## 8. License

This project is licensed under the **MIT License**.
