export const SOURCE_TYPES = [
  'Meeting recap',
  'Field note',
  'Email thread',
  'Transcript',
  'Support summary',
] as const

export const PRODUCT_AREAS = [
  'Care coordination',
  'Analytics',
  'Implementation',
  'Integrations',
  'Platform',
] as const

export const OUTPUT_TYPES = [
  'Opportunity Intake',
  'Escalation Brief',
  'Implementation Handoff',
] as const

export const URGENCY_LEVELS = ['Low', 'Medium', 'High', 'Critical'] as const
export const SENTIMENT_LEVELS = ['Positive', 'Neutral', 'Concerned', 'Negative'] as const
export const REVIEW_STATUSES = [
  'Needs human review',
  'In review',
  'Approved',
  'Rejected',
] as const

export type SourceType = (typeof SOURCE_TYPES)[number]
export type ProductArea = (typeof PRODUCT_AREAS)[number]
export type OutputType = (typeof OUTPUT_TYPES)[number]
export type Urgency = (typeof URGENCY_LEVELS)[number]
export type Sentiment = (typeof SENTIMENT_LEVELS)[number]
export type ReviewStatus = (typeof REVIEW_STATUSES)[number]

export type FieldNoteInput = {
  accountName: string
  contactName: string
  sourceType: SourceType
  productArea: ProductArea
  outputType: OutputType
  rawNotes: string
}

export type SalesforceFieldMap = {
  /** Field_Note__c.Name */
  Name: string
  Account_Name__c: string
  Contact_Name__c: string
  Source_Type__c: SourceType
  Product_Area__c: ProductArea
  Output_Type__c: OutputType
  Summary__c: string
  Stakeholders__c: string
  Urgency__c: Urgency
  Sentiment__c: Sentiment
  Pain_Points__c: string
  Business_Impact__c: string
  Revenue_Opportunity__c: string
  Implementation_Risk__c: string
  Missing_Information__c: string
  Recommended_Next_Steps__c: string
  Review_Status__c: ReviewStatus
  Raw_Input__c: string
}

export type FieldNoteAnalysis = {
  id: string
  createdAt: string
  classification: {
    sourceType: SourceType
    productArea: ProductArea
    outputType: OutputType
    urgency: Urgency
    sentiment: Sentiment
  }
  summary: string
  stakeholders: string[]
  painPoints: string[]
  businessImpact: string[]
  revenueOpportunity: string
  implementationRisk: string[]
  missingInformation: string[]
  recommendedNextSteps: string[]
  salesforceFields: SalesforceFieldMap
  rawInput: FieldNoteInput
  reviewStatus: ReviewStatus
}
