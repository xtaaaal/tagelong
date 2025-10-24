import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Itineraries | Tagelong",
  description: "Your saved travel itineraries and favorite destinations",
};

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-text-primary">Saved</h1>
            <p className="mt-2 text-text-secondary">
              Your saved itineraries and favorite destinations
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No saved itineraries yet</h3>
          <p className="text-text-secondary mb-6">
            Start exploring and save your favorite itineraries to see them here.
          </p>
          <button className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Explore Itineraries
          </button>
        </div>
      </div>
    </div>
  );
}
