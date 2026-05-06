import { FormEvent, useMemo, useState } from 'react'

type NavItem = 'New Field Note' | 'Review Output' | 'History' | 'Settings'

type FormState = {
  accountName: string
  contactName: string
  sourceType: string
  productArea: string
  outputType: string
  rawNotes: string
}

type StructuredOutput = {
  recordType: string
  accountName: string
  contactName: string
  sourceType: string
  productArea: string
  summary: string
  recommendedNextStep: string
  reviewStatus: string
  generatedFrom: {
    rawNoteCharacters: number
    mode: string
  }
}

const navItems: NavItem[] = [
  'New Field Note',
  'Review Output',
  'History',
  'Settings',
]

const sourceTypes = [
  'Meeting recap',
  'Field note',
  'Email thread',
  'Transcript',
  'Support summary',
]

const productAreas = [
  'Care coordination',
  'Analytics',
  'Implementation',
  'Integrations',
  'Platform',
]

const outputTypes = [
  'Opportunity Intake',
  'Escalation Brief',
  'Implementation Handoff',
]

const initialFormState: FormState = {
  accountName: '',
  contactName: '',
  sourceType: sourceTypes[0],
  productArea: productAreas[0],
  outputType: outputTypes[0],
  rawNotes: '',
}

function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('New Field Note')
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [structuredOutput, setStructuredOutput] = useState<StructuredOutput | null>(
    null,
  )

  const previewJson = useMemo(
    () =>
      structuredOutput
        ? JSON.stringify(structuredOutput, null, 2)
        : JSON.stringify(
            {
              recordType: 'Awaiting analysis',
              reviewStatus: 'Draft not generated',
              message:
                'Complete the field note form and click Analyze Note to generate a placeholder structured preview.',
            },
            null,
            2,
          ),
    [structuredOutput],
  )

  const updateField = (field: keyof FormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }))
  }

  const handleAnalyze = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const notesPreview = formState.rawNotes.trim()
      ? formState.rawNotes.trim().slice(0, 180)
      : 'No raw notes were entered. Add synthetic demo context before analysis.'

    setStructuredOutput({
      recordType: formState.outputType,
      accountName: formState.accountName.trim() || 'Demo Account',
      contactName: formState.contactName.trim() || 'Demo Contact',
      sourceType: formState.sourceType,
      productArea: formState.productArea,
      summary: notesPreview,
      recommendedNextStep:
        'Human reviewer should validate the fields before copying, exporting, or syncing.',
      reviewStatus: 'Needs human review',
      generatedFrom: {
        rawNoteCharacters: formState.rawNotes.length,
        mode: 'Prototype placeholder - no AI API call made',
      },
    })
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

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
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

            <aside className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-50 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-300">
                    Structured Output Preview
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    {structuredOutput
                      ? structuredOutput.recordType
                      : 'Waiting for analysis'}
                  </h2>
                </div>
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                  Mock JSON
                </span>
              </div>
              <pre className="mt-6 max-h-[620px] overflow-auto rounded-2xl bg-slate-900 p-4 text-sm leading-6 text-emerald-100 ring-1 ring-slate-800">
                {previewJson}
              </pre>
            </aside>
          </section>
        </div>
      </div>
    </main>
  )
}

type FieldNoteFormProps = {
  formState: FormState
  onAnalyze: (event: FormEvent<HTMLFormElement>) => void
  onFieldChange: (field: keyof FormState, value: string) => void
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
          Add basic context and paste synthetic demo notes to generate a
          reviewable placeholder output. No AI, backend, or Salesforce calls are
          made in this prototype shell.
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
          options={sourceTypes}
          value={formState.sourceType}
        />
        <SelectInput
          id="productArea"
          label="Product Area"
          onChange={(value) => onFieldChange('productArea', value)}
          options={productAreas}
          value={formState.productArea}
        />
        <SelectInput
          id="outputType"
          label="Output Type"
          onChange={(value) => onFieldChange('outputType', value)}
          options={outputTypes}
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

type TextInputProps = {
  id: keyof FormState
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

type SelectInputProps = {
  id: keyof FormState
  label: string
  onChange: (value: string) => void
  options: string[]
  value: string
}

function SelectInput({ id, label, onChange, options, value }: SelectInputProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        id={id}
        onChange={(event: { target: { value: string } }) =>
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
