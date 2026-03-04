export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">LegalDoc AI</h1>
          <p className="text-xs text-gray-500">Document OCR Suite</p>
        </div>
        <nav className="flex gap-1 text-sm">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
            v2.0
          </span>
        </nav>
      </div>
    </header>
  );
}
