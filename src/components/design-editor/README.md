# 🎨 Design Editor - Fabric.js Integration

## Overview

The Design Editor is a powerful visual editing tool built with Fabric.js that allows users to customize invitation templates with precision control over text, images, fonts, colors, and layout.

## Components

### 1. **DesignEditor.tsx** (Main Component)
The core editor component that manages the Fabric.js canvas and orchestrates all editing functionality.

**Features:**
- Canvas initialization and management
- Template loading (background + objects)
- Object selection handling
- Zoom management
- Export functionality

**Props:**
```typescript
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
```

### 2. **Toolbar.tsx**
Top toolbar with main editing actions.

**Features:**
- Add Text button
- Add Image button (with URL input)
- Delete selected object
- Export as PNG
- Save design

### 3. **ZoomControls.tsx**
Bottom-right zoom controls for canvas navigation.

**Features:**
- Zoom levels: 50%, 75%, 100%, 150%, 200%
- Zoom in/out buttons
- Fit to screen
- Current zoom display

### 4. **PropertyPanel.tsx**
Right sidebar showing properties of the selected object.

**Features for Text:**
- Text content editing
- Font family selection (Google Fonts)
- Font size slider (8-200px)
- Color picker with hex input
- Bold, Italic, Underline toggles
- Text alignment (left, center, right)

**Features for Images:**
- Scale slider
- Opacity control

**Common Features:**
- Layer controls (bring forward/send backward)
- Position (X, Y coordinates)
- Opacity slider

## Usage

### Basic Usage

```tsx
import { DesignEditor } from '@/components/design-editor'

function MyPage() {
  const handleSave = (canvasData) => {
    // Save the canvas data to database
    console.log(canvasData)
  }

  return (
    <DesignEditor
      template={myTemplate}
      onSave={handleSave}
    />
  )
}
```

### Accessing the Design Editor

From an event page:
```
/events/[eventId]/design
```

This route loads the event, verifies ownership, and opens the design editor with the event's template.

## Canvas Data Structure

The editor saves canvas data in the following format:

```json
{
  "objects": [
    {
      "type": "textbox",
      "text": "Your Event Title",
      "left": 100,
      "top": 100,
      "fontSize": 48,
      "fill": "#000000",
      "fontFamily": "Arial",
      "fontWeight": "bold",
      "textAlign": "center"
    },
    {
      "type": "image",
      "src": "https://example.com/image.jpg",
      "left": 100,
      "top": 300,
      "scaleX": 1,
      "scaleY": 1
    }
  ],
  "background": { ... },
  "width": 800,
  "height": 1200
}
```

## Keyboard Shortcuts

- **Delete**: Delete selected object
- **Esc**: Deselect object
- **Arrow Keys**: Move selected object
- **+/-**: Zoom in/out (when implemented)

## Dependencies

- `fabric@5.3.0` - Canvas rendering and object manipulation
- `react-colorful` - Color picker component
- `react-dropzone` - File upload (for future image upload feature)

## Future Enhancements

- [ ] File upload for images (currently uses URLs)
- [ ] Shape tools (rectangle, circle, line)
- [ ] Undo/Redo functionality
- [ ] Layers panel with drag-and-drop reordering
- [ ] Alignment guides and snap-to-grid
- [ ] Template variables (e.g., {{eventTitle}})
- [ ] Background removal for images
- [ ] Image filters and effects
- [ ] Custom font upload
- [ ] Collaborative editing

## Troubleshooting

### Canvas not loading
- Check if Fabric.js is properly installed: `npm list fabric`
- Verify template has valid `previewUrl`
- Check browser console for CORS errors

### Objects not selectable
- Ensure objects have `selectable: true` (default)
- Check if object is behind background layer

### Export not working
- Verify canvas is fully loaded before exporting
- Check browser's download settings
- Ensure canvas has content

## Performance Tips

1. **Image Optimization**: Use appropriately sized images for templates
2. **Object Limit**: Keep canvas objects under 100 for smooth performance
3. **Zoom Level**: Reset to 100% before exporting for best quality
4. **Memory Management**: Call `canvas.dispose()` on unmount

## API Reference

### DesignEditor Methods

```typescript
// Add text to canvas
handleAddText()

// Add image from URL
handleAddImage(imageUrl: string)

// Delete selected object
handleDeleteObject()

// Export canvas as PNG
handleExportImage()

// Save canvas data
handleSave()

// Change zoom level
handleZoomChange(zoom: number)
```

## Testing

To test the design editor:

1. Create an event
2. Click "Open Design Editor" button on event page
3. Try adding text and images
4. Modify properties in the right panel
5. Test zoom controls
6. Export the design
7. Save and verify data is persisted

## Support

For issues or feature requests, please refer to the main project documentation.

---

**Built with ❤️ using Fabric.js**
