type Page = "home" | "app";

interface HeaderProps {
  page: Page;
  onNavigate: (page: Page) => void;
}

export function Header({ page, onNavigate }: HeaderProps) {
  return (
    <header className="bg-legal-brown border-b-2 border-legal-gold/40 px-6 py-4 shadow-parchment-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="flex-shrink-0">
              <svg
                className="h-9 w-9 text-legal-gold"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v18" />
                <path d="M5 7l7-4 7 4" />
                <path d="M2 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
                <path d="M16 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-parchment-50 tracking-wide">
                LegalDoc AI
              </h1>
              <p className="text-xs text-legal-gold font-body tracking-wider uppercase">
                Indian Legal Document Intelligence
              </p>
            </div>
          </button>
        </div>
        <nav className="flex items-center gap-4">
          <button
            onClick={() => onNavigate("home")}
            className={`text-sm font-body transition-colors ${
              page === "home" ? "text-legal-gold font-semibold" : "text-parchment-200 hover:text-parchment-50"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("app")}
            className={`text-sm font-body transition-colors ${
              page === "app" ? "text-legal-gold font-semibold" : "text-parchment-200 hover:text-parchment-50"
            }`}
          >
            Application
          </button>
          <div className="hidden sm:block h-5 w-px bg-legal-gold/30" />
          <span className="badge-gold text-xs hidden sm:inline-flex">v2.0</span>
        </nav>
      </div>
    </header>
  );
}
