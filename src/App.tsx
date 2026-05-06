import { FormEvent, useMemo, useState } from 'react'
import { createMockAnalysis } from './lib/mockAnalysis'
import {
  OUTPUT_TYPES,
  PRODUCT_AREAS,
  SOURCE_TYPES,
  type FieldNoteAnalysis,
  type FieldNoteInput,
} from './types/fieldNote'

type NavItem = 'New Field Note' | 'Review Output' | 'History' | 'Settings'

const navItems: NavItem[] = [
  'New Field Note',
  'Review Output',
  'History',
  'Settings',
]

const initialFormState: FieldNoteInput = {
  accountName: '',
  contactName: '',
  sourceType: SOURCE_TYPES[0],
  productArea: PRODUCT_AREAS[0],
  outputType: OUTPUT_TYPES[0],
  rawNotes: '',
}

function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('New Field Note')
  const [formState, setFormState] = useState<FieldNoteInput>(initialFormState)
  const [analysis, setAnalysis] = useState<FieldNoteAnalysis | null>(null)

  const previewJson = useMemo(
    () =>
      JSON.stringify(
        analysis ?? {
          recordType: 'Awaiting analysis',
          reviewStatus: 'Draft not generated',
          message:
            'Complete the field note form and click Analyze Note to generate a typed mock analysis.',
        },
        null,
        2,
      ),
    [analysis],
  )

  const updateField = <Key extends keyof FieldNoteInput>(
    field: Key,
    value: FieldNoteInput[Key],
  ) => {
    setFormState((current) => ({ ...current, [field]: value }))
  }

  const handleAnalyze = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAnalysis(createMockAnalysis(formState))
    setActiveNav('Review Output')
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-indigo-600 px-4 py-2 text-lg font-black tracking-tight text-white shadow-sm">
                  SoTA
                </span>
                <span className="text-xl font-semibold text-slate-800">
                  Source of Truth Assistant
                </span>
              </div>
              <p className="mt-4 max-w-2xl text-lg text-slate-600">
                Turn messy customer context into structured action.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
              Prototype only. Do not enter PHI, patient data, payment card
              data, or confidential contract terms.
            </div>
          </div>
        </header>

        <div className="mt-6 grid flex-1 gap-6 lg:grid-cols-[260px_1fr]">
          <nav
            aria-label="Prototype navigation"
            className="rounded-3xl border border-white/70 bg-white/90 p-3 shadow-sm"
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeNav === item
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                  key={item}
                  onClick={() => setActiveNav(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </nav>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,1fr)]">
            <article className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm">
              {activeNav === 'New Field Note' ? (
                <FieldNoteForm
                  formState={formState}
                  onAnalyze={handleAnalyze}
                  onFieldChange={updateField}
                />
              ) : (
                <PlaceholderScreen activeNav={activeNav} />
              )}
            </article>

            <AnalysisPreview analysis={analysis} previewJson={previewJson} />
          </section>
        </div>
      </div>
    </main>
  )
}

type FieldNoteFormProps = {
  formState: FieldNoteInput
  onAnalyze: (event: FormEvent<HTMLFormElement>) => void
  onFieldChange: <Key extends keyof FieldNoteInput>(
    field: Key,
    value: FieldNoteInput[Key],
  ) => void
}

function FieldNoteForm({
  formState,
  onAnalyze,
  onFieldChange,
}: FieldNoteFormProps) {
  return (
    <form className="space-y-6" onSubmit={onAnalyze}>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
          New Field Note
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Capture customer context
        </h1>
        <p className="mt-3 text-slate-600">
          Add basic context and paste synthetic demo notes to generate a typed,
          reviewable mock analysis. No AI, backend, or Salesforce calls are made
          in this prototype shell.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          id="accountName"
          label="Account Name"
          onChange={(value) => onFieldChange('accountName', value)}
          placeholder="Example Health System"
          value={formState.accountName}
        />
        <TextInput
          id="contactName"
          label="Contact Name"
          onChange={(value) => onFieldChange('contactName', value)}
          placeholder="Jordan Lee"
          value={formState.contactName}
        />
        <SelectInput
          id="sourceType"
          label="Source Type"
          onChange={(value) => onFieldChange('sourceType', value)}
          options={SOURCE_TYPES}
          value={formState.sourceType}
        />
        <SelectInput
          id="productArea"
          label="Product Area"
          onChange={(value) => onFieldChange('productArea', value)}
          options={PRODUCT_AREAS}
          value={formState.productArea}
        />
        <SelectInput
          id="outputType"
          label="Output Type"
          onChange={(value) => onFieldChange('outputType', value)}
          options={OUTPUT_TYPES}
          value={formState.outputType}
        />
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Raw Notes</span>
        <textarea
          className="mt-2 min-h-64 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          onChange={(event: { target: { value: string } }) =>
            onFieldChange('rawNotes', event.target.value)
          }
          placeholder="Paste a messy field note, transcript excerpt, email thread, or meeting recap here. Use synthetic or anonymized demo data only."
          value={formState.rawNotes}
        />
      </label>

      <button
        className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        type="submit"
      >
        Analyze Note
      </button>
    </form>
  )
}

type AnalysisPreviewProps = {
  analysis: FieldNoteAnalysis | null
  previewJson: string
}

function AnalysisPreview({ analysis, previewJson }: AnalysisPreviewProps) {
  return (
    <aside className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-50 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-300">
            Structured Output Preview
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {analysis ? analysis.classification.outputType : 'Waiting for analysis'}
          </h2>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
          Mock/local
        </span>
      </div>

      {analysis ? (
        <div className="mt-6 space-y-4">
          <PreviewSection title="Classification">
            <div className="grid gap-2 sm:grid-cols-2">
              <Fact label="Source" value={analysis.classification.sourceType} />
              <Fact label="Product" value={analysis.classification.productArea} />
              <Fact label="Output" value={analysis.classification.outputType} />
              <Fact label="Urgency" value={analysis.classification.urgency} />
              <Fact label="Sentiment" value={analysis.classification.sentiment} />
              <Fact label="Review" value={analysis.reviewStatus} />
            </div>
          </PreviewSection>

          <PreviewSection title="Summary">
            <p className="text-sm leading-6 text-slate-200">{analysis.summary}</p>
          </PreviewSection>

          <PreviewList title="Pain Points" items={analysis.painPoints} />
          <PreviewList title="Business Impact" items={analysis.businessImpact} />
          <PreviewList title="Risks" items={analysis.implementationRisk} />
          <PreviewList
            title="Missing Information"
            items={analysis.missingInformation}
          />
          <PreviewList
            title="Recommended Next Steps"
            items={analysis.recommendedNextSteps}
          />

          <PreviewSection title="Salesforce Field Map">
            <dl className="space-y-3">
              {Object.entries(analysis.salesforceFields).map(([field, value]) => (
                <div
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-3"
                  key={field}
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">
                    {field}
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-200">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </PreviewSection>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-5 text-sm leading-6 text-slate-300">
          Complete the New Field Note form and click Analyze Note to create a
          typed mock analysis. The preview changes based on the selected output
          type.
        </div>
      )}

      <details className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-indigo-200">
          Raw JSON debug view
        </summary>
        <pre className="mt-4 max-h-96 overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-emerald-100 ring-1 ring-slate-800">
          {previewJson}
        </pre>
      </details>
    </aside>
  )
}

function PreviewSection({
  children,
  title,
}: {
  children: unknown
  title: string
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function PreviewList({ items, title }: { items: string[]; title: string }) {
  return (
    <PreviewSection title={title}>
      <ul className="space-y-2 text-sm leading-6 text-slate-200">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </PreviewSection>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  )
}

type TextInputProps = {
  id: keyof FieldNoteInput
  label: string
  onChange: (value: string) => void
  placeholder: string
  value: string
}

function TextInput({ id, label, onChange, placeholder, value }: TextInputProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        id={id}
        onChange={(event: { target: { value: string } }) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </label>
  )
}

type SelectInputProps<Value extends string> = {
  id: keyof FieldNoteInput
  label: string
  onChange: (value: Value) => void
  options: readonly Value[]
  value: Value
}

function SelectInput<Value extends string>({
  id,
  label,
  onChange,
  options,
  value,
}: SelectInputProps<Value>) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        id={id}
        onChange={(event: { target: { value: Value } }) =>
          onChange(event.target.value)
        }
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function PlaceholderScreen({ activeNav }: { activeNav: NavItem }) {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
        {activeNav}
      </p>
      <h1 className="mt-3 text-3xl font-bold text-slate-950">
        Prototype section placeholder
      </h1>
      <p className="mt-3 max-w-xl text-slate-600">
        This MVP shell intentionally uses simple React state instead of routing.
        Build out this section after the New Field Note workflow is validated.
      </p>
    </div>
  )
}

export default App
