'use client'

interface ZoomControlsProps {
  zoom: number
  onZoomChange: (zoom: number) => void
  canvasWidth: number
  canvasHeight: number
}

export default function ZoomControls({
  zoom,
  onZoomChange,
  canvasWidth,
  canvasHeight,
}: ZoomControlsProps) {
  const zoomLevels = [0.5, 0.75, 1, 1.5, 2]

  const handleZoomIn = () => {
    const currentIndex = zoomLevels.indexOf(zoom)
    if (currentIndex < zoomLevels.length - 1) {
      onZoomChange(zoomLevels[currentIndex + 1])
    }
  }

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.indexOf(zoom)
    if (currentIndex > 0) {
      onZoomChange(zoomLevels[currentIndex - 1])
    }
  }

  const handleFitToScreen = () => {
    // Calculate zoom to fit canvas in viewport
    const viewportWidth = window.innerWidth - 400 // Account for sidebars
    const viewportHeight = window.innerHeight - 200 // Account for toolbars
    const fitZoom = Math.min(
      viewportWidth / canvasWidth,
      viewportHeight / canvasHeight
    )
    onZoomChange(Math.min(fitZoom, 1))
  }

  return (
    <div className="fixed bottom-6 right-96 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center gap-2">
      {/* Zoom Out */}
      <button
        onClick={handleZoomOut}
        disabled={zoom === zoomLevels[0]}
        className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        title="Zoom Out"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      {/* Zoom Levels */}
      <div className="flex gap-1">
        {zoomLevels.map((level) => (
          <button
            key={level}
            onClick={() => onZoomChange(level)}
            className={`px-3 py-1 text-sm rounded ${
              zoom === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {level === 1 ? '100%' : `${Math.round(level * 100)}%`}
          </button>
        ))}
      </div>

      {/* Zoom In */}
      <button
        onClick={handleZoomIn}
        disabled={zoom === zoomLevels[zoomLevels.length - 1]}
        className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        title="Zoom In"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Fit to Screen */}
      <button
        onClick={handleFitToScreen}
        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        title="Fit to Screen"
      >
        Fit
      </button>

      {/* Current Zoom Display */}
      <div className="px-2 text-sm text-gray-600 font-medium min-w-[60px] text-center">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  )
}
