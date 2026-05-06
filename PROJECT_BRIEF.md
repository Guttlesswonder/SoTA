# Project Brief

## Project Name

**SoTA: Source of Truth Assistant**

## Purpose

SoTA is a hackathon prototype that turns messy customer-facing field notes into structured, reviewable internal records that can later be copied, exported, or synced into Salesforce.

The project focuses on helping customer-facing teams convert unstructured inputs such as field notes, transcripts, email threads, and meeting recaps into consistent Salesforce-ready records.

## MVP Workflow

1. User pastes a messy field note, transcript, email thread, or meeting recap.
2. User enters basic context such as account name, contact name, source type, product area, and desired output type.
3. App sends the note to an AI analysis endpoint.
4. AI returns structured JSON.
5. User reviews and edits the structured result.
6. User can save the result locally.
7. User can eventually sync the reviewed result to a Salesforce Developer Edition custom object called `Field_Note__c`.

## Initial Output Modes

1. Opportunity Intake
2. Escalation Brief
3. Implementation Handoff

## Out of Scope

1. Corporate Salesforce access
2. Real customer data
3. PHI, patient data, payment card data, or confidential contract terms
4. Slack, Gong, email, or ticket ingestion
5. Multi-object Salesforce writes
6. Automatic record creation without human review

## Demo Goal

Show that a messy field note can become a structured Salesforce-ready record in under 60 seconds.

## Primary Users

Customer-facing employees in Sales, Account Management, Customer Success, Professional Services, Support, Product, and leadership-facing roles.

## Business Value

SoTA is intended to create business value through:

- Cleaner documentation
- Better Salesforce hygiene
- Better implementation handoffs
- Faster escalation summaries
- More consistent cross-functional visibility

## Security and Data Handling Notes

- The MVP should use only synthetic, anonymized, or non-sensitive demo data.
- Real customer data is out of scope for the prototype.
- PHI, patient data, payment card data, and confidential contract terms must not be entered into the app.
- Human review is required before any record is saved, copied, exported, or synced.
- The Salesforce sync target for future demos is a Salesforce Developer Edition custom object named `Field_Note__c`, not a corporate Salesforce org.
- Local saves should be treated as prototype convenience storage, not as a production system of record.

## Future Roadmap

Potential future enhancements include:

- Syncing reviewed records to the Salesforce Developer Edition `Field_Note__c` custom object.
- Adding copy/export options for reviewed structured records.
- Expanding output modes beyond Opportunity Intake, Escalation Brief, and Implementation Handoff.
- Adding stronger validation, required-field checks, and confidence indicators before save or sync.
- Supporting configurable schemas by team, product area, or workflow.
- Introducing role-based access controls and audit logging for production use.
- Evaluating future integrations with Slack, Gong, email, support tickets, or other source systems after the MVP.
