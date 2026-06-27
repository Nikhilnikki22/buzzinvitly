'use client'

import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import ZoomControls from './ZoomControls'
import Toolbar from './Toolbar'
import PropertyPanel from './PropertyPanel'

interface DesignEditorProps {
  template: {
    id: string
    name: string
    thumbnailUrl: string
    previewUrl: string
    designData?: any
  }
  onSave?: (canvasData: any) => void
}

export default function DesignEditor({ template, onSave }: DesignEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)
  const [zoom, setZoom] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  // Canvas dimensions
  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 1200

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    })

    setCanvas(fabricCanvas)

    // Cleanup on unmount
    return () => {
      fabricCanvas.dispose()
    }
  }, [])

  // Load template background and objects
  useEffect(() => {
    if (!canvas) return

    loadTemplate()
  }, [canvas, template])

  // Handle object selection
  useEffect(() => {
    if (!canvas) return

    const handleSelection = (e: any) => {
      setSelectedObject(e.selected?.[0] || null)
    }

    const handleDeselection = () => {
      setSelectedObject(null)
    }

    canvas.on('selection:created', handleSelection)
    canvas.on('selection:updated', handleSelection)
    canvas.on('selection:cleared', handleDeselection)

    return () => {
      canvas.off('selection:created', handleSelection)
      canvas.off('selection:updated', handleSelection)
      canvas.off('selection:cleared', handleDeselection)
    }
  }, [canvas])

  const loadTemplate = async () => {
    if (!canvas) return

    setIsLoading(true)

    try {
      // Clear canvas
      canvas.clear()

      // Load background image
      fabric.Image.fromURL(
        template.previewUrl,
        (img) => {
          if (!img) return

          // Scale image to fit canvas
          const scale = Math.min(
            CANVAS_WIDTH / (img.width || 1),
            CANVAS_HEIGHT / (img.height || 1)
          )

          img.set({
            scaleX: scale,
            scaleY: scale,
            selectable: false,
            evented: false,
          })

          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))

          // Load template objects if available
          if (template.designData?.objects) {
            loadTemplateObjects()
          } else {
            // Add default text and image placeholders
            addDefaultObjects()
          }

          setIsLoading(false)
        },
        { crossOrigin: 'anonymous' }
      )
    } catch (error) {
      console.error('Failed to load template:', error)
      setIsLoading(false)
    }
  }

  const loadTemplateObjects = () => {
    if (!canvas || !template.designData?.objects) return

    template.designData.objects.forEach((obj: any) => {
      if (obj.type === 'text') {
        const text = new fabric.Textbox(obj.text || 'Edit this text', {
          left: obj.left || 100,
          top: obj.top || 100,
          width: obj.width || 200,
          fontSize: obj.fontSize || 24,
          fill: obj.fill || '#000000',
          fontFamily: obj.fontFamily || 'Arial',
          fontWeight: obj.fontWeight || 'normal',
          fontStyle: obj.fontStyle || 'normal',
          textAlign: obj.textAlign || 'left',
        })
        canvas.add(text)
      } else if (obj.type === 'image') {
        fabric.Image.fromURL(
          obj.src,
          (img) => {
            img.set({
              left: obj.left || 100,
              top: obj.top || 300,
              scaleX: obj.scaleX || 1,
              scaleY: obj.scaleY || 1,
            })
            canvas.add(img)
            canvas.renderAll()
          },
          { crossOrigin: 'anonymous' }
        )
      }
    })

    canvas.renderAll()
  }

  const addDefaultObjects = () => {
    if (!canvas) return

    // Add default title text
    const title = new fabric.Textbox('Your Event Title', {
      left: 100,
      top: 100,
      width: 600,
      fontSize: 48,
      fill: '#000000',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      textAlign: 'center',
    })

    // Add default date text
    const date = new fabric.Textbox('Date & Time', {
      left: 100,
      top: 200,
      width: 600,
      fontSize: 24,
      fill: '#666666',
      fontFamily: 'Arial',
      textAlign: 'center',
    })

    // Add default location text
    const location = new fabric.Textbox('Location Details', {
      left: 100,
      top: 260,
      width: 600,
      fontSize: 20,
      fill: '#666666',
      fontFamily: 'Arial',
      textAlign: 'center',
    })

    canvas.add(title, date, location)
    canvas.renderAll()
  }

  const handleZoomChange = (newZoom: number) => {
    if (!canvas) return

    setZoom(newZoom)
    canvas.setZoom(newZoom)
    canvas.renderAll()
  }

  const handleAddText = () => {
    if (!canvas) return

    const text = new fabric.Textbox('New Text', {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 24,
      fill: '#000000',
      fontFamily: 'Arial',
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }

  const handleAddImage = (imageUrl: string) => {
    if (!canvas) return

    fabric.Image.fromURL(
      imageUrl,
      (img) => {
        img.set({
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5,
        })
        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()
      },
      { crossOrigin: 'anonymous' }
    )
  }

  const handleDeleteObject = () => {
    if (!canvas || !selectedObject) return

    canvas.remove(selectedObject)
    setSelectedObject(null)
    canvas.renderAll()
  }

  const handleSave = () => {
    if (!canvas || !onSave) return

    const canvasData = {
      objects: canvas.toJSON().objects,
      background: canvas.backgroundImage,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    }

    onSave(canvasData)
  }

  const handleExportImage = () => {
    if (!canvas) return

    // Export as PNG
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2, // 2x resolution
    })

    // Download
    const link = document.createElement('a')
    link.download = `${template.name}-design.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Toolbar */}
      <Toolbar
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onDelete={handleDeleteObject}
        onSave={handleSave}
        onExport={handleExportImage}
        canDelete={!!selectedObject}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div className="relative bg-white shadow-2xl" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading template...</p>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <PropertyPanel
            selectedObject={selectedObject}
            canvas={canvas}
            onUpdate={() => canvas?.renderAll()}
          />
        </div>
      </div>

      {/* Zoom Controls */}
      <ZoomControls
        zoom={zoom}
        onZoomChange={handleZoomChange}
        canvasWidth={CANVAS_WIDTH}
        canvasHeight={CANVAS_HEIGHT}
      />
    </div>
  )
}
