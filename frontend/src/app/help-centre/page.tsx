import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Centre | Tagelong",
  description: "Get help and support for your travel planning needs",
};

export default function HelpCentrePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-text-primary">Help Centre</h1>
            <p className="mt-2 text-text-secondary">
              Get help and support for your travel planning needs
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search and Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Get Help</h2>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Search Help Articles
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for help..."
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Contact Options */}
              <div className="space-y-3">
                <button className="w-full bg-brand-500 hover:bg-brand-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Live Chat
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-text-primary px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Support
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-text-primary px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone Support
                </button>
              </div>
            </div>
          </div>

          {/* FAQ and Articles */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* FAQ */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-medium text-text-primary mb-2">How do I create a new itinerary?</h3>
                    <p className="text-text-secondary text-sm">
                      Click on "Create New Itinerary" in your Planner Dashboard and follow the step-by-step guide to build your perfect travel plan.
                    </p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-medium text-text-primary mb-2">Can I share my itineraries with others?</h3>
                    <p className="text-text-secondary text-sm">
                      Yes! You can share your itineraries via link or invite others to collaborate on your travel plans.
                    </p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-medium text-text-primary mb-2">How do I save destinations I like?</h3>
                    <p className="text-text-secondary text-sm">
                      Click the heart icon on any destination or itinerary to save it to your favorites list.
                    </p>
                  </div>
                  <div className="pb-4">
                    <h3 className="font-medium text-text-primary mb-2">Is my data secure?</h3>
                    <p className="text-text-secondary text-sm">
                      Absolutely. We use industry-standard encryption and security measures to protect your personal information and travel data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Getting Started */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Getting Started</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-text-primary mb-2">1. Create Your Profile</h3>
                    <p className="text-text-secondary text-sm">
                      Complete your profile information to get personalized recommendations.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-text-primary mb-2">2. Explore Destinations</h3>
                    <p className="text-text-secondary text-sm">
                      Browse our curated collection of travel destinations and itineraries.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-text-primary mb-2">3. Plan Your Trip</h3>
                    <p className="text-text-secondary text-sm">
                      Use our planner tools to create detailed itineraries for your travels.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-text-primary mb-2">4. Book & Travel</h3>
                    <p className="text-text-secondary text-sm">
                      Book your accommodations and activities, then enjoy your trip!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
