interface HomePageProps {
  onGetStarted: () => void;
}

const FEATURES = [
  {
    title: "Document Intelligence",
    description:
      "Upload legal documents in PDF, PNG, or JPEG format. Our advanced AI extracts and digitizes text from scanned documents with high accuracy.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "AI Legal Assistant",
    description:
      "Ask questions about Indian law in plain language. Get accurate answers sourced from the Indian Penal Code, CrPC, CPC, and more.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    title: "Case Precedents",
    description:
      "Every answer is enriched with relevant case history and past judicial decisions to help you understand how laws have been interpreted.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: "Offline & Private",
    description:
      "Everything runs locally on your machine. No data is sent to external servers. Your legal documents remain completely private.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "AI Document Summary",
    description:
      "Generate concise, AI-powered summaries of lengthy legal documents with key points extraction at multiple detail levels.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Legal Timeline Generator",
    description:
      "Extract and visualize chronological events, filing deadlines, hearing dates, and statutory timelines from legal documents.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Voice Legal Assistant",
    description:
      "Ask legal questions using your voice. Speak naturally in English or Hindi and get accurate spoken answers from the AI.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    title: "AI Judgement Prediction",
    description:
      "Describe a case scenario and get an AI-powered judgement prediction with confidence levels and relevant legal sections.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <path d="M5 7l7-4 7 4" />
        <path d="M2 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
        <path d="M16 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
      </svg>
    ),
  },
];

const SUPPORTED_ACTS = [
  { abbr: "IPC", name: "Indian Penal Code" },
  { abbr: "CrPC", name: "Code of Criminal Procedure" },
  { abbr: "CPC", name: "Code of Civil Procedure" },
  { abbr: "IEA", name: "Indian Evidence Act" },
  { abbr: "HMA", name: "Hindu Marriage Act" },
  { abbr: "IDA", name: "Indian Divorce Act" },
  { abbr: "MVA", name: "Motor Vehicles Act" },
  { abbr: "NIA", name: "Negotiable Instruments Act" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Upload Documents",
    description: "Drop your legal documents — PDFs, scanned images, or photographs of legal papers.",
  },
  {
    step: "02",
    title: "AI Extraction",
    description: "Our AI reads and digitizes the text, making it searchable and analyzable.",
  },
  {
    step: "03",
    title: "Review & Verify",
    description: "Review the extracted text side-by-side with the original document for accuracy.",
  },
  {
    step: "04",
    title: "Ask Questions",
    description: "Chat with the AI about any question related to Indian law and get detailed answers with case references.",
  },
];

export function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/parchment-bg.jpg')" }} />
        <div className="absolute inset-0 bg-parchment-50/40" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          {/* Scales of Justice */}
          <div className="mx-auto mb-8 h-20 w-20 rounded-full bg-legal-brown/10 border-2 border-legal-brown/30 flex items-center justify-center">
            <svg className="h-10 w-10 text-legal-brown" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v18" />
              <path d="M5 7l7-4 7 4" />
              <path d="M2 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
              <path d="M16 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold text-legal-darkbrown mb-4 leading-tight">
            LegalDoc <span className="text-legal-gold">AI</span>
          </h1>
          <p className="text-xl md:text-2xl font-body text-legal-brown mb-3 max-w-2xl mx-auto">
            Indian Legal Document Intelligence Platform
          </p>
          <p className="text-base font-body text-sepia-600 mb-10 max-w-xl mx-auto leading-relaxed">
            Upload, analyze, and query Indian legal documents powered by artificial intelligence.
            Everything runs locally — your data never leaves your machine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 bg-legal-brown text-parchment-50 font-body font-bold rounded-xl
                         hover:bg-legal-darkbrown transition-all duration-200 shadow-lg hover:shadow-xl
                         text-base tracking-wide"
            >
              Get Started
            </button>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 border-2 border-legal-brown/30 text-legal-brown font-body font-medium rounded-xl
                         hover:bg-legal-brown/10 transition-all duration-200 text-base"
            >
              How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <p className="text-3xl font-serif font-bold text-legal-brown">8+</p>
              <p className="text-xs font-body text-sepia-500 mt-1">Legal Acts</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-legal-brown">100%</p>
              <p className="text-xs font-body text-sepia-500 mt-1">Offline</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-legal-brown">AI</p>
              <p className="text-xs font-body text-sepia-500 mt-1">Powered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-parchment-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-body font-semibold text-legal-gold uppercase tracking-widest mb-2">Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-legal-brown">
              Powerful Legal Intelligence
            </h2>
            <div className="decorative-line mt-4 max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-6 parchment-card-elevated rounded-xl hover:shadow-parchment-lg transition-all duration-300 group"
              >
                <div className="h-12 w-12 rounded-xl bg-legal-brown/10 flex items-center justify-center text-legal-brown
                                group-hover:bg-legal-brown group-hover:text-parchment-50 transition-all duration-300 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-serif font-semibold text-legal-brown mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm font-body text-sepia-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-parchment-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-body font-semibold text-legal-gold uppercase tracking-widest mb-2">Workflow</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-legal-brown">
              How It Works
            </h2>
            <div className="decorative-line mt-4 max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item, index) => (
              <div key={item.step} className="relative text-center">
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px border-t-2 border-dashed border-sepia-300" />
                )}
                <div className="mx-auto h-16 w-16 rounded-full bg-legal-brown text-parchment-50 flex items-center justify-center
                                text-lg font-serif font-bold mb-4 shadow-parchment-md relative z-10">
                  {item.step}
                </div>
                <h3 className="text-base font-serif font-semibold text-legal-brown mb-2">
                  {item.title}
                </h3>
                <p className="text-sm font-body text-sepia-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Acts */}
      <section className="py-20 bg-parchment-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-body font-semibold text-legal-gold uppercase tracking-widest mb-2">Coverage</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-legal-brown">
              Supported Legal Acts
            </h2>
            <div className="decorative-line mt-4 max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SUPPORTED_ACTS.map((act) => (
              <div
                key={act.abbr}
                className="p-5 parchment-card rounded-xl text-center hover:shadow-parchment-md hover:border-legal-gold transition-all duration-200"
              >
                <p className="text-xl font-serif font-bold text-legal-brown mb-1">{act.abbr}</p>
                <p className="text-xs font-body text-sepia-600">{act.name}</p>
              </div>
            ))}
          </div>

          {/* "And More" banner centered below the grid */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-dashed border-legal-gold/50 bg-legal-gold/5">
              <span className="text-xl">⚖️</span>
              <span className="font-serif font-bold text-legal-gold text-base">& More</span>
              <span className="text-xs font-body text-sepia-500">— Constitution, amendments &amp; growing coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-parchment-100 border-y border-sepia-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-parchment-grain opacity-5" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-legal-brown mb-4">
            Ready to Analyze Your Legal Documents?
          </h2>
          <p className="text-base font-body text-sepia-600 mb-8 max-w-lg mx-auto">
            Start uploading documents, reviewing extracted text, and asking legal questions — all from one place.
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-4 bg-legal-brown text-parchment-50 font-body font-bold rounded-xl
                       hover:bg-legal-darkbrown transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Launch Application
          </button>
        </div>
      </section>
    </div>
  );
}
