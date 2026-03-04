import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Layout } from "./components/layout/Layout";
import { MultiFileUpload } from "./components/upload/MultiFileUpload";
import { ReviewMode } from "./components/review/ReviewMode";
import { QueryInput } from "./components/ask/QueryInput";
import { AnswerDisplay } from "./components/ask/AnswerDisplay";
import { useAskLegal } from "./hooks/useAskLegal";
import { useDocumentStore } from "./stores/document-store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type Tab = "upload" | "review" | "ask";

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const { mutate, data, isPending, error } = useAskLegal();
  const { reset } = useDocumentStore();

  const tabs: { key: Tab; label: string }[] = [
    { key: "upload", label: "Upload" },
    { key: "review", label: "Review" },
    { key: "ask", label: "Ask Legal" },
  ];

  return (
    <Layout>
      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={reset}
          className="px-3 py-2 text-xs text-gray-400 hover:text-red-500 ml-2"
        >
          Reset
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "upload" && <MultiFileUpload />}
      {activeTab === "review" && <ReviewMode />}
      {activeTab === "ask" && (
        <div className="space-y-4">
          <QueryInput onSubmit={(q) => mutate(q)} isPending={isPending} />
          <AnswerDisplay data={data} isLoading={isPending} error={error} />
        </div>
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
