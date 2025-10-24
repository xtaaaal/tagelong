import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planner Dashboard | Tagelong",
  description: "Create and manage your travel itineraries",
};

export default function PlannerDashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-text-primary">Planner Dashboard</h1>
            <p className="mt-2 text-text-secondary">
              Create and manage your travel itineraries
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-brand-500 hover:bg-brand-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Itinerary
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-text-primary px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Import Itinerary
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-text-primary px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Browse Templates
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">My Itineraries</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-text-primary rounded-lg transition-colors">
                    All
                  </button>
                  <button className="px-3 py-1 text-sm text-text-secondary hover:bg-gray-100 rounded-lg transition-colors">
                    Drafts
                  </button>
                  <button className="px-3 py-1 text-sm text-text-secondary hover:bg-gray-100 rounded-lg transition-colors">
                    Published
                  </button>
                </div>
              </div>

              {/* Empty State */}
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">No itineraries yet</h3>
                <p className="text-text-secondary mb-6">
                  Start creating your first travel itinerary to begin planning your next adventure.
                </p>
                <button className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Create Your First Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Activity</h2>
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-text-secondary">No recent activity to show</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
