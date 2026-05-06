# Notes for Build

## Current Repo Setup

- The repo does not currently contain an application framework or starter scaffold.
- The only project documentation file at the root is `PROJECT_BRIEF.md`.
- A `.gitkeep` file is present, which suggests the repo was initialized as an otherwise empty placeholder before the project brief was added.

## Current Folder Structure

```text
.
├── .gitkeep
└── PROJECT_BRIEF.md
```

## package.json

- `package.json` does not currently exist.

## Available Scripts

- No package scripts are available because there is no `package.json`.

## Recommended Next Implementation Step

Do not build the full app yet. The recommended next step is to choose and scaffold a minimal web app foundation for the MVP, such as a Vite + React + TypeScript starter or another lightweight frontend setup.

After choosing the framework, the first implementation slice should focus on a static, local-only prototype shell:

1. A paste area for messy field notes.
2. Basic context fields for account name, contact name, source type, product area, and desired output type.
3. A placeholder structured JSON preview area.
4. Clear copy explaining that only synthetic or anonymized demo data should be used.

This keeps the repo aligned with the project brief while avoiding premature Salesforce, ingestion, or production data-handling work.
