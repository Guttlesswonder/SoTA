# SoTA: Source of Truth Assistant

SoTA is a hackathon prototype that turns messy customer-facing field notes into structured, reviewable internal records that can later be copied, exported, or synced into Salesforce.

The current implementation is a local-only Vite + React + TypeScript prototype shell with Tailwind CSS styling. It does not call an AI API, connect to Salesforce, or use a backend.

## Prototype Features

- Header with the SoTA product name and short positioning statement.
- Simple React state-based navigation for:
  - New Field Note
  - Review Output
  - History
  - Settings
- New Field Note form with account, contact, source type, product area, output type, and raw notes fields.
- Prototype warning that prohibits PHI, patient data, payment card data, and confidential contract terms.
- Mock structured output preview generated locally after clicking **Analyze Note**.

## Local Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Safety Notes

This prototype is for synthetic or anonymized demo data only. Do not enter real customer data, PHI, patient data, payment card data, or confidential contract terms.

## Current Scope

Included:

- Frontend-only prototype shell
- Local mock structured output generation
- Tailwind CSS styling

Not included yet:

- AI API calls
- Salesforce integration
- Backend services
- Slack, Gong, email, or ticket ingestion
- Automatic record creation without human review
