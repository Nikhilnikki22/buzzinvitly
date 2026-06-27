'use client'

import { DesignEditor } from '@/components/design-editor'
import { saveDesign } from './actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DesignEditorWrapperProps {
  eventId: string
  template: {
    id: string
    name: string
    description: string | null
    category: string
    thumbnailUrl: string
    previewUrl: string
    isPremium: boolean
    coinCost: number
    tags: string[]
    colors: string[]
    designData: any
  }
}

export default function DesignEditorWrapper({ eventId, template }: DesignEditorWrapperProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (canvasData: any) => {
    setIsSaving(true)

    try {
      const result = await saveDesign(eventId, canvasData)

      if (result.success) {
        alert('✅ Design saved successfully!')
        router.push(`/events/${eventId}`)
      }
    } catch (error) {
      alert('❌ Failed to save design. Please try again.')
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative">
      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-700 font-medium">Saving your design...</p>
          </div>
        </div>
      )}
      <DesignEditor template={template} onSave={handleSave} />
    </div>
  )
}
