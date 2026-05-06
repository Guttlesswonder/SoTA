import type {
  FieldNoteAnalysis,
  FieldNoteInput,
  OutputType,
  ReviewStatus,
  Sentiment,
  Urgency,
} from '../types/fieldNote'

const reviewStatus: ReviewStatus = 'Needs human review'

const outputTypeSignals: Record<
  OutputType,
  {
    urgency: Urgency
    sentiment: Sentiment
    summaryTemplate: (accountName: string, productArea: string) => string
    painPoints: string[]
    businessImpact: string[]
    revenueOpportunity: string
    implementationRisk: string[]
    missingInformation: string[]
    recommendedNextSteps: string[]
  }
> = {
  'Opportunity Intake': {
    urgency: 'Medium',
    sentiment: 'Positive',
    summaryTemplate: (accountName, productArea) =>
      `${accountName} appears to have an active ${productArea.toLowerCase()} opportunity. The note suggests a business sponsor is exploring value, fit, and timing, but the buying process and success criteria still need reviewer validation.`,
    painPoints: [
      'Current discovery notes are fragmented across customer-facing conversations.',
      'Stakeholder goals, decision criteria, and timeline need to be normalized before handoff.',
      'Potential value drivers are present but not yet mapped to measurable outcomes.',
    ],
    businessImpact: [
      'Cleaner opportunity documentation can improve forecast confidence.',
      'A structured intake record can reduce repeated discovery across sales, product, and services.',
      'Capturing success criteria early can improve downstream implementation planning.',
    ],
    revenueOpportunity:
      'Potential new or expansion opportunity; estimate amount, close date, and buying stage after human review.',
    implementationRisk: [
      'Implementation assumptions are not yet confirmed with technical stakeholders.',
      'Integration scope may expand if source systems or data owners are unclear.',
    ],
    missingInformation: [
      'Budget owner and buying committee',
      'Target close date and decision process',
      'Required integrations or data dependencies',
    ],
    recommendedNextSteps: [
      'Schedule discovery follow-up with the business sponsor and technical lead.',
      'Confirm measurable outcomes and priority use cases.',
      'Update opportunity notes after reviewer validates the structured intake.',
    ],
  },
  'Escalation Brief': {
    urgency: 'High',
    sentiment: 'Concerned',
    summaryTemplate: (accountName, productArea) =>
      `${accountName} may need an escalation brief for ${productArea.toLowerCase()}. The note points to customer concern, open ownership questions, and a need for concise internal alignment before follow-up.`,
    painPoints: [
      'Customer concern appears unresolved and needs a clear internal owner.',
      'The current note does not separate symptoms, root cause hypotheses, and requested outcomes.',
      'Cross-functional visibility may be inconsistent without a concise escalation summary.',
    ],
    businessImpact: [
      'Faster escalation summaries can reduce time to internal alignment.',
      'Consistent owner and next-step documentation can improve customer confidence.',
      'Leadership-facing updates become easier when impact and ask are captured consistently.',
    ],
    revenueOpportunity:
      'Protect existing relationship value by resolving the issue quickly; expansion should wait until the escalation is stable.',
    implementationRisk: [
      'Issue ownership may span support, services, product, or integrations.',
      'Customer expectations may be misaligned if follow-up timing is not explicitly confirmed.',
      'Root cause is not validated in this mock analysis.',
    ],
    missingInformation: [
      'Customer severity and deadline',
      'Internal owner and escalation path',
      'Confirmed customer impact and affected users or workflows',
    ],
    recommendedNextSteps: [
      'Assign a single escalation owner and response deadline.',
      'Confirm the customer-facing message before the next follow-up.',
      'Document known facts, open questions, and next checkpoint after human review.',
    ],
  },
  'Implementation Handoff': {
    urgency: 'Medium',
    sentiment: 'Neutral',
    summaryTemplate: (accountName, productArea) =>
      `${accountName} needs an implementation handoff for ${productArea.toLowerCase()}. The note indicates enough context for a draft handoff, but scope, dependencies, and success measures should be confirmed before delivery planning.`,
    painPoints: [
      'Implementation context is embedded in unstructured notes instead of a consistent handoff format.',
      'Dependencies and owner responsibilities need to be made explicit.',
      'Success criteria may be understood conversationally but are not yet review-ready.',
    ],
    businessImpact: [
      'Structured handoffs can reduce project kickoff friction.',
      'Services and customer success teams get a clearer view of scope and risks.',
      'Earlier risk capture can prevent avoidable implementation delays.',
    ],
    revenueOpportunity:
      'Supports delivery quality and retention; expansion potential depends on successful implementation milestones.',
    implementationRisk: [
      'Timeline risk if customer data owners or technical contacts are missing.',
      'Scope risk if product configuration assumptions are not validated.',
      'Adoption risk if success criteria are not translated into launch milestones.',
    ],
    missingInformation: [
      'Implementation owner and customer technical contact',
      'Target kickoff date and milestone dates',
      'Data, integration, or configuration prerequisites',
    ],
    recommendedNextSteps: [
      'Confirm implementation scope and required customer resources.',
      'Translate success criteria into kickoff agenda and milestones.',
      'Share the reviewed handoff with services and customer success.',
    ],
  },
}

export function createMockAnalysis(input: FieldNoteInput): FieldNoteAnalysis {
  const accountName = input.accountName.trim() || 'Demo Account'
  const contactName = input.contactName.trim() || 'Demo Contact'
  const rawNotes = input.rawNotes.trim()
  const signals = outputTypeSignals[input.outputType]
  const createdAt = new Date().toISOString()
  const summary = rawNotes
    ? `${signals.summaryTemplate(accountName, input.productArea)} Source note signal: "${rawNotes.slice(0, 220)}${rawNotes.length > 220 ? '...' : ''}"`
    : `${signals.summaryTemplate(accountName, input.productArea)} Add synthetic raw notes before using this as a demo artifact.`

  const analysis: FieldNoteAnalysis = {
    id: `field-note-${Date.now()}`,
    createdAt,
    classification: {
      sourceType: input.sourceType,
      productArea: input.productArea,
      outputType: input.outputType,
      urgency: signals.urgency,
      sentiment: signals.sentiment,
    },
    summary,
    stakeholders: [contactName, 'Account owner', 'Customer success manager'],
    painPoints: signals.painPoints,
    businessImpact: signals.businessImpact,
    revenueOpportunity: signals.revenueOpportunity,
    implementationRisk: signals.implementationRisk,
    missingInformation: signals.missingInformation,
    recommendedNextSteps: signals.recommendedNextSteps,
    salesforceFields: {
      Name: `${accountName} - ${input.outputType}`,
      Account_Name__c: accountName,
      Contact_Name__c: contactName,
      Source_Type__c: input.sourceType,
      Product_Area__c: input.productArea,
      Output_Type__c: input.outputType,
      Summary__c: summary,
      Stakeholders__c: [
        contactName,
        'Account owner',
        'Customer success manager',
      ].join('\n'),
      Urgency__c: signals.urgency,
      Sentiment__c: signals.sentiment,
      Pain_Points__c: signals.painPoints.join('\n'),
      Business_Impact__c: signals.businessImpact.join('\n'),
      Revenue_Opportunity__c: signals.revenueOpportunity,
      Implementation_Risk__c: signals.implementationRisk.join('\n'),
      Missing_Information__c: signals.missingInformation.join('\n'),
      Recommended_Next_Steps__c: signals.recommendedNextSteps.join('\n'),
      Review_Status__c: reviewStatus,
      Raw_Input__c: input.rawNotes,
    },
    rawInput: {
      ...input,
      accountName,
      contactName,
    },
    reviewStatus,
  }

  return analysis
}
