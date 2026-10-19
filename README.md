# Credit Card Approval Predictor

A simulation platform that models retail banking underwriting policies, credit limit allocation, dynamic risk-based APR pricing, and TransUnion CIBIL credit score factors on a 300 to 900 scale.

---

## Table of Contents

- [Overview](#overview)
- [Underwriting Architecture](#underwriting-architecture)
  - [TransUnion CIBIL 5-Pillar Scoring Model](#transunion-cibil-5-pillar-scoring-model)
  - [CIBIL Score Classification Bands](#cibil-score-classification-bands)
  - [6-Stage Banking Verification Audit](#6-stage-banking-verification-audit)
  - [Card Variants and Dynamic APR](#card-variants-and-dynamic-apr)
- [AI Integration](#ai-integration)
  - [Architecture and Safety Boundaries](#architecture-and-safety-boundaries)
  - [Privacy](#privacy)
- [Application Flow](#application-flow)
- [Preloaded Underwriting Presets](#preloaded-underwriting-presets)
- [Portfolio Benchmark Dataset](#portfolio-benchmark-dataset)
- [Project Directory Structure](#project-directory-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Available Scripts](#available-scripts)
  - [Windows Launcher (run.cmd)](#windows-launcher-runcmd)
- [Project Assets](#project-assets)
- [Change Log](#change-log)
- [Author](#author)

---

## Overview

An interactive credit-card underwriting simulator with deterministic risk scoring, policy audits, and optional Gemini risk explanations. It is designed as a portfolio project that demonstrates product-oriented frontend engineering, rule-based decisioning, API integration, privacy-aware data minimisation, and clear risk communication.

This application simulates the full institutional evaluation process directly in the browser:
- Calculates a simulated TransUnion CIBIL score (300-900) based on weighted risk pillars.
- Runs a 6-stage underwriting audit to detect derogatory remarks, ECS/NACH mandate bounces, and credit hunger.
- Enforces Fixed Obligation to Income Ratio (FOIR) caps.
- Assigns card tiers (Classic/Millennial, Select, Wealth, or Secured FD-Backed).
- Calculates dynamic APR starting from 9.0% p.a.
- Provides a sensitivity curve showing the impact of income surplus and debt reduction on credit scores.
- Generates an optional Gemini-powered risk explanation from a privacy-minimised underwriting summary.

> **Educational simulation only:** This project does not contact TransUnion CIBIL, Account Aggregator, banks, employers, or card issuers. It cannot retrieve a real credit score or issue a real approval. The rules engine and all portfolio data are synthetic educational models.

---

## Underwriting Architecture

### TransUnion CIBIL 5-Pillar Scoring Model

The credit score is computed on a scale from 300 to 900. A baseline score of 300 points is combined with up to 600 points distributed across five weighted pillars:

| Pillar | Weight | Max Points | Description and Scoring Rules |
| :--- | :--- | :--- | :--- |
| Payment History | 35% | 210 | Rewards flawless on-time repayments (+210 pts). Deducts points for late payment cycles, recent 3-month ECS/NACH bounces (-160 pts), and written-off/settled tradelines (-195 pts). |
| Credit Exposure and FOIR | 30% | 180 | Evaluates debt-to-income burden. Full points for FOIR <= 20% (+180 pts), scaling down to +20 pts when FOIR exceeds 50%. |
| Credit Vintage and History Duration | 15% | 90 | Measures length of active credit history. 5+ years earns full points (+90 pts), scaling down for newer or thin credit files. |
| Credit Mix | 10% | 60 | Rewards a balanced portfolio of secured loans (home, auto) and unsecured credit lines (+60 pts). |
| Recent Inquiries and Velocity | 10% | 60 | Penalizes credit hunger. Applications with 3+ inquiries in 30 days or 5+ in 6 months receive 0 points. |

### CIBIL Score Classification Bands

| Score Range | Category | Market Context | Underwriting Treatment |
| :--- | :--- | :--- | :--- |
| 750 - 900 | Excellent (Prime) | 79% of all credit cards approved in India belong to this band | Instant automated approval |
| 700 - 749 | Good (Standard) | Standard credit risk profile | Approved subject to clean banking checks |
| 650 - 699 | Fair (Marginal) | Elevated credit risk | Referred for manual underwriter scrutiny |
| 300 - 649 | Poor (High Risk) | Subprime risk profile | Auto-declined for unsecured cards |
| NH / NA | New to Credit | Thin file (no credit history) | Starter credit limit or Secured FD card route |

### 6-Stage Banking Verification Audit

Every application is evaluated against 6 sequential verification stages:

1. Stage 1: Bureau History and TransUnion CIBIL Scrub
   - Verifies bureau score is at or above 650.
   - Rejects accounts with settled, written-off, or restructured loan remarks.
2. Stage 2: Bank Statement and Mandate Verification (Account Aggregator)
   - Checks for inward cheque, ECS, or NACH mandate bounces within the last 3-6 months.
   - Any active mandate bounce triggers an automated rejection.
3. Stage 3: Income Trail and Salary Mode Check
   - Verifies direct bank transfer (NEFT/RTGS/IMPS).
   - Cheque salary requires manual clearance verification. Cash salary triggers an immediate knockout.
4. Stage 4: Employer Category and Income Sufficiency
   - Classifies employers into Tier 1 (Super Corporate / MNC / Listed), Tier 2 (Mid Corporate), Small Firm / Startup, or Proprietorship.
   - Enforces minimum monthly income requirements (Rs 25,000 for salaried, Rs 35,000 for self-employed and small firms).
5. Stage 5: Inquiry Velocity (Credit Hunger Check)
   - Evaluates hard inquiries logged in the last 30 days and 6 months.
   - 3 or more inquiries within 30 days flags credit hunger and fails automated underwriting.
6. Stage 6: FOIR Repayment Capacity Analysis
   - Calculates the ratio of total monthly EMIs against net income adjusted for dependents.
   - Enforces a maximum FOIR ceiling of 50% (55% for monthly incomes exceeding Rs 75,000).

### Card Variants and Dynamic APR

Approved applicants are matched to a card tier based on verified monthly income and credit score:

- Wealth Card: Net monthly income >= Rs 1,50,000 and CIBIL >= 760. Premium tier with enhanced credit lines.
- Select Card: Net monthly income >= Rs 50,000 and CIBIL >= 730. Mid-tier premium lifestyle card.
- Classic / Millennial Card: Standard approved card tier for prime salaried applicants and credit starters.
- Secured (FD-Backed) Card: 100% guaranteed approval card backed by a Fixed Deposit (minimum Rs 10,000 deposit). Requires zero income proof, zero salary slips, and zero CIBIL checks. Suitable for rejected or new-to-credit applicants.

Dynamic Risk-Based APR:
- Prime applicants (CIBIL 800+, low FOIR, Tier 1 corporate): APR starts from 9.0% p.a. (0.75% per month).
- Standard approved tiers: 12.0% to 24.0% p.a.
- Referred or marginal profiles: 32.0% p.a.
- Maximum subprime rate: 36.0% p.a.

Standard Card Features:
- Lifetime Free: Rs 0 joining fee and Rs 0 annual renewal fee.
- Up to 48 days interest-free cash withdrawals at ATMs.
- Reward points that do not expire.
- Zero lost card liability with 24/7 instant freeze.

---

## AI Integration

The application now contains a genuine generative-AI feature rather than labelling its deterministic calculator as AI. On the results screen, **AI Risk Analyst** sends a deliberately minimised summary of the local simulation outcome to a server-side Gemini endpoint. Gemini returns a concise explanation with decision drivers, potential risk-reduction actions, and a disclaimer.

### Architecture and Safety Boundaries

| Layer | Responsibility |
| :--- | :--- |
| React rules engine | Calculates the synthetic score, FOIR, audit checks, decision, limit, and APR. This remains the sole source of truth for every numerical result. |
| Express API (`server.ts`) | Keeps the Gemini key on the server, validates the request, and calls Google Gen AI. |
| Gemini `gemini-2.5-flash` | Explains the already-calculated simulation. It is explicitly instructed not to change figures, promise approval, or claim access to bank/bureau systems. |
| Browser UI | Shows the analysis only when the user requests it and surfaces configuration/API failures clearly. |

The AI endpoint is intentionally optional: the main simulation continues to work without an API key. When no key is configured, the AI panel explains how to enable it.

### Privacy

The browser sends only employment type, income, tenure, credit age, loan presence, and the already-generated simulation summary. It excludes the applicant's name, PAN, PIN code, and individual loan details. Do not add real applicant data to a demo deployment without an appropriate privacy, consent, and data-retention programme.

---

## Application Flow

1. Step 0: Overview and Portfolio Benchmark Analytics
   - Displays portfolio insights from 180 benchmark profiles using interactive Recharts charts.
   - Chart 1: Approval rate across employment categories.
   - Chart 2: Average approved credit limit across income brackets.
2. Step 1: Personal and Demographic Details
   - Captures applicant name, age (validated between 21 and 65 years), marital status, dependents count, education, housing status, and PIN code.
3. Step 2: Employment and Income Verification
   - Captures employment type, employer corporate category, net monthly income, job tenure, and salary payment mode.
4. Step 3: Bureau Standing and Bank Audit Verification
   - Captures CIBIL score band, Account Aggregator mandate bounce status, written-off loan remarks, inquiry frequency, and an active loan manager for multiple tradelines.
5. Step 4: Underwriting Pipeline Simulation
   - Displays an animated multi-phase underwriting scan simulating bureau scrub, bank statement fetch, employer validation, and credit decisioning.
6. Step 5: Risk and Approval Dashboard
   - Comprehensive dashboard showing approval status, approved credit limit, dynamic APR, calibrated SVG TransUnion CIBIL gauge needle, sensitivity curve, 5 bureau pillar scores, 6-stage bank audit checklist, and portfolio similarity rate.

---

## Preloaded Underwriting Presets

For testing and demonstration, three preset underwriting scenarios are available on the top bar:

1. Preset 1: Prime Corporate Approved
   - Tier 1 corporate employee, CIBIL 780+, zero bounces, zero inquiries.
   - Outcome: Instant approval for the Select card tier with all 6 stages passed.
2. Preset 2: Statement Bounce and Credit Hunger
   - Active personal loan with late payment, recent ECS bounce, 5 credit inquiries.
   - Outcome: Unsecured card declined; instant 100% guaranteed Secured Card alternative presented.
3. Preset 3: Unlisted Employer and High FOIR
   - Small startup employer, 40% FOIR, CIBIL 710-749.
   - Outcome: Referred for manual underwriter review and physical document submission.

---

## Portfolio Benchmark Dataset

The simulation uses an internal dataset of 180 synthetic profiles reflecting private-sector retail banking benchmarks:

| Employment Category | Sample Size | Approval Rate | Key Factors |
| :--- | :--- | :--- | :--- |
| Salaried | 95 | ~74% | Verifiable EPFO salary trails, steady tenure |
| Business Owner | 35 | ~52% | Audited ITR history, business stability |
| Self-Employed | 32 | ~38% | Variable cash flow, requires higher income buffer |
| Student | 10 | ~12% | Starter programs or routed to Secured Card |
| Unemployed | 8 | ~3% | Routed exclusively to 100% Guaranteed Secured Card |

---

## Project Directory Structure

```text
ai-credit-card-approval-predictor/
├── server.ts                        # Express API proxy for the Gemini-powered analysis

├── src/
│   ├── components/
│   │   ├── Header.tsx              # Navigation bar and underwriting preset buttons
│   │   ├── AiRiskAnalysis.tsx      # Optional Gemini analysis panel; sends a minimal payload
│   │   ├── Step0Landing.tsx        # Overview, explainer steps, and portfolio benchmark charts
│   │   ├── Step1Personal.tsx       # Personal demographic input with validation
│   │   ├── Step2Employment.tsx     # Employment and corporate categorization
│   │   ├── Step3Credit.tsx         # Bureau standing, loan tradelines, and bounce toggles
│   │   ├── Step4Pipeline.tsx       # Animated multi-stage underwriting pipeline simulation
│   │   └── Step5Results.tsx        # Approval dashboard, SVG gauge, audit cards, and what-if chart
│   ├── utils/
│   │   └── scoringEngine.ts        # TransUnion CIBIL scoring model, 6 audit checks, synthetic dataset
│   ├── types.ts                    # TypeScript interfaces for applicants, scores, and outcomes
│   ├── App.tsx                     # Main application state, step transitions, and layout
│   ├── main.tsx                    # React application entry point
│   └── index.css                   # Tailwind CSS imports and base styles
├── index.html                      # HTML template
├── package.json                    # Project metadata, dependencies, and build scripts
├── .env.example                    # Safe template for the server-side Gemini configuration
├── run.cmd                         # Interactive Windows launcher for dev, build, and git push
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite build configuration with Tailwind CSS plugin
```

---

## Tech Stack

- Framework: React 19
- Language: TypeScript 5.8
- Build Tool: Vite 6
- Styling: Tailwind CSS v4
- Charts and Visualizations: Recharts 3
- Icons: Lucide React
- Generative AI: Google Gen AI SDK with Gemini 2.5 Flash, accessed only from the Express server
- API Layer: Express 4 + dotenv

---

## Getting Started

### Prerequisites

- Node.js 20.0 or higher (required by the Google Gen AI SDK)
- npm (v9.0 or higher)

### Installation

1. Clone or open the repository:
   ```bash
   git clone https://github.com/RahmaniFaizan/ai-credit-card-approval-predictor.git
   cd ai-credit-card-approval-predictor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a local environment file and add a Google AI Studio API key:
   ```bash
   copy .env.example .env
   ```
   Set `GEMINI_API_KEY` in `.env`. The key is loaded only by `server.ts` and is ignored by Git. You can obtain an API key from [Google AI Studio](https://aistudio.google.com/apikey).

4. Start the API server in one terminal:
   ```bash
   npm run server
   ```

5. Start the development server in a second terminal:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

6. Complete a simulation and select **Generate AI analysis** on the result dashboard. The Vite development server proxies `/api` requests to the Express server at `http://localhost:3001`.

The frontend remains usable without Steps 3–4; only the optional AI analysis will be unavailable.

### Available Scripts

- `npm run dev`: Starts the local development server on port 3000.
- `npm run server`: Starts the Express AI API on port 3001. Reads `GEMINI_API_KEY` and optional `GEMINI_MODEL` from `.env`.
- `npm run build`: Compiles TypeScript and creates an optimized production bundle in `dist/`.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs TypeScript compiler (`tsc --noEmit`) to validate type safety.
- `npm run clean`: Cleans the build output directory.

### Windows Launcher (run.cmd)

On Windows systems, you can double-click or run `run.cmd` from the command line:

```bat
run.cmd
```

The launcher provides an interactive menu:
- [1] Start Development Server (runs `npm run dev` on `http://localhost:3000`)
- [2] Start AI API Server (runs `npm run server` on `http://localhost:3001`)
- [3] Build Production Bundle (runs `npm run build`)
- [4] Push Updates to GitHub (pushes to repository `main` branch)
- [5] Exit

For a production-style local run, first build the frontend with `npm run build`, then run `npm run server`. Express serves `dist/` as well as the `/api/risk-analysis` endpoint.

---

## Change Log

### AI Risk Analyst integration

- Added `server.ts`, an Express API that uses the existing `@google/genai` package to request Gemini analysis without exposing the key to the browser.
- Added `AiRiskAnalysis.tsx` to the results dashboard, with a user-triggered loading state, error handling, and explicit privacy notice.
- Added Vite development proxy support and a `npm run server` script.
- Added safe `.env.example` configuration for `GEMINI_API_KEY` and optional `GEMINI_MODEL`; real `.env` files remain Git-ignored.
- Updated the Windows launcher for the separate AI API process.
- Raised the documented and declared Node.js requirement to 20+ to match the Google Gen AI SDK.
- Removed unused animation and PostCSS dependencies, unused component imports/state, and unused score-engine destructuring; the portfolio media remains because it is an intentionally documented showcase asset.
- Added a public-repository description, GitHub metadata, and production-ready ignore rules for secrets, generated output, editor files, and deployment artifacts.
- Documented the deterministic-versus-generative boundary, the transmitted fields, security constraints, setup instructions, and production-style run procedure.

---

## Author

MOHD FAIZAN MOHD ANWAR RAHMANI
- Email: [rahmanifaizan1@gmail.com](mailto:rahmanifaizan1@gmail.com)
- GitHub: [RahmaniFaizan](https://github.com/RahmaniFaizan)
- Project Repository: [ai-credit-card-approval-predictor](https://github.com/RahmaniFaizan/ai-credit-card-approval-predictor)
