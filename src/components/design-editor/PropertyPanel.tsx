'use client'

import { useState, useEffect } from 'react'
import { fabric } from 'fabric'
import { HexColorPicker } from 'react-colorful'

interface PropertyPanelProps {
  selectedObject: fabric.Object | null
  canvas: fabric.Canvas | null
  onUpdate: () => void
}

const GOOGLE_FONTS = [
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Helvetica',
  'Playfair Display',
  'Montserrat',
  'Roboto',
  'Open Sans',
  'Lato',
  'Poppins',
  'Raleway',
  'Dancing Script',
  'Pacifico',
]

export default function PropertyPanel({
  selectedObject,
  canvas,
  onUpdate,
}: PropertyPanelProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [color, setColor] = useState('#000000')

  // Get object properties
  const isText = selectedObject?.type === 'textbox' || selectedObject?.type === 'text'
  const isImage = selectedObject?.type === 'image'

  const textObject = isText ? (selectedObject as fabric.Textbox) : null
  const imageObject = isImage ? (selectedObject as fabric.Image) : null

  // Update color when object changes
  useEffect(() => {
    if (isText && textObject?.fill) {
      setColor(textObject.fill as string)
    }
  }, [selectedObject, isText, textObject])

  const updateTextProperty = (property: string, value: any) => {
    if (!textObject || !canvas) return

    textObject.set(property as any, value)
    canvas.renderAll()
    onUpdate()
  }

  const updateImageProperty = (property: string, value: any) => {
    if (!imageObject || !canvas) return

    imageObject.set(property as any, value)
    canvas.renderAll()
    onUpdate()
  }

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    if (isText) {
      updateTextProperty('fill', newColor)
    }
  }

  const handleBringForward = () => {
    if (!selectedObject || !canvas) return
    canvas.bringForward(selectedObject)
    canvas.renderAll()
  }

  const handleSendBackward = () => {
    if (!selectedObject || !canvas) return
    canvas.sendBackwards(selectedObject)
    canvas.renderAll()
  }

  if (!selectedObject) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
          <p className="text-gray-500 text-sm">
            Select an object to edit its properties
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {isText && '✏️ Text Properties'}
        {isImage && '🖼️ Image Properties'}
        {!isText && !isImage && '⚙️ Object Properties'}
      </h3>

      {/* Text Properties */}
      {isText && textObject && (
        <div className="space-y-6">
          {/* Text Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Content
            </label>
            <textarea
              value={textObject.text || ''}
              onChange={(e) => updateTextProperty('text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Family
            </label>
            <select
              value={textObject.fontFamily || 'Arial'}
              onChange={(e) => updateTextProperty('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {GOOGLE_FONTS.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size: {textObject.fontSize || 24}px
            </label>
            <input
              type="range"
              min="8"
              max="200"
              value={textObject.fontSize || 24}
              onChange={(e) => updateTextProperty('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full flex items-center gap-3 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-mono">{color.toUpperCase()}</span>
              </button>

              {showColorPicker && (
                <div className="absolute top-full mt-2 z-10 bg-white p-4 rounded-lg shadow-xl border border-gray-200">
                  <HexColorPicker color={color} onChange={handleColorChange} />
                  <button
                    onClick={() => setShowColorPicker(false)}
                    className="mt-3 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Text Formatting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formatting
            </label>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  updateTextProperty(
                    'fontWeight',
                    textObject.fontWeight === 'bold' ? 'normal' : 'bold'
                  )
                }
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold ${
                  textObject.fontWeight === 'bold'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                B
              </button>
              <button
                onClick={() =>
                  updateTextProperty(
                    'fontStyle',
                    textObject.fontStyle === 'italic' ? 'normal' : 'italic'
                  )
                }
                className={`flex-1 px-3 py-2 rounded-lg text-sm italic ${
                  textObject.fontStyle === 'italic'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                I
              </button>
              <button
                onClick={() =>
                  updateTextProperty(
                    'underline',
                    !textObject.underline
                  )
                }
                className={`flex-1 px-3 py-2 rounded-lg text-sm underline ${
                  textObject.underline
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                U
              </button>
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alignment
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => updateTextProperty('textAlign', 'left')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                  textObject.textAlign === 'left'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Left
              </button>
              <button
                onClick={() => updateTextProperty('textAlign', 'center')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                  textObject.textAlign === 'center'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Center
              </button>
              <button
                onClick={() => updateTextProperty('textAlign', 'right')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                  textObject.textAlign === 'right'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Right
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Properties */}
      {isImage && imageObject && (
        <div className="space-y-6">
          {/* Image Scale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scale: {Math.round((imageObject.scaleX || 1) * 100)}%
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={(imageObject.scaleX || 1) * 100}
              onChange={(e) => {
                const scale = parseInt(e.target.value) / 100
                updateImageProperty('scaleX', scale)
                updateImageProperty('scaleY', scale)
              }}
              className="w-full"
            />
          </div>

          {/* Image Opacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opacity: {Math.round((imageObject.opacity || 1) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={(imageObject.opacity || 1) * 100}
              onChange={(e) => updateImageProperty('opacity', parseInt(e.target.value) / 100)}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Common Properties */}
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">Layer Controls</h4>

        <div className="flex gap-2">
          <button
            onClick={handleBringForward}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Forward
          </button>
          <button
            onClick={handleSendBackward}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Backward
          </button>
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">X Position</label>
            <input
              type="number"
              value={Math.round(selectedObject.left || 0)}
              onChange={(e) => {
                selectedObject.set('left', parseInt(e.target.value))
                canvas?.renderAll()
                onUpdate()
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Y Position</label>
            <input
              type="number"
              value={Math.round(selectedObject.top || 0)}
              onChange={(e) => {
                selectedObject.set('top', parseInt(e.target.value))
                canvas?.renderAll()
                onUpdate()
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Opacity for all objects */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Opacity: {Math.round((selectedObject.opacity || 1) * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={(selectedObject.opacity || 1) * 100}
            onChange={(e) => {
              selectedObject.set('opacity', parseInt(e.target.value) / 100)
              canvas?.renderAll()
              onUpdate()
            }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
