'use client'

import { ImageUpscale } from 'lucide-react'
import { DraftField } from '../../types'

interface FieldItemProps {
  field: DraftField
  scale: number
  onStartMove: (e: React.MouseEvent) => void
  onStartResize: (e: React.MouseEvent) => void
  onRemove: () => void
}

export default function FieldItem({
  field,
  scale,
  onStartMove,
  onStartResize,
  onRemove,
}: FieldItemProps) {
  return (
    <div
      onMouseDown={onStartMove}
      style={{
        position: 'absolute',
        left: field.x * scale,
        top: field.y * scale,
        width: field.width * scale,
        height: field.height * scale,
      }}
      className="border border-blue-500 bg-blue-50/40 rounded-md cursor-move group"
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
      >
        ×
      </button>

      <div
        onMouseDown={onStartResize}
        className="absolute bottom-1 right-1 w-3 h-3 cursor-se-resize opacity-0 group-hover:opacity-100 transition"
      >
        <ImageUpscale size={14} className="text-gray-400" />
      </div>

      <div className="flex items-center justify-center h-full text-xs text-gray-600 pointer-events-none select-none">
        {field.type}
      </div>
    </div>
  )
}