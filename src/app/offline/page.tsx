export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-6">📡</div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You're Offline
        </h1>

        <p className="text-gray-600 mb-6">
          It looks like you've lost your internet connection. Some features may not be available until you're back online.
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> You can still view cached pages and events you've previously visited.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Try Again
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Make sure you're connected to the internet and try again.
        </p>
      </div>
    </div>
  )
}
