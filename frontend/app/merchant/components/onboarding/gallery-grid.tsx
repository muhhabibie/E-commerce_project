"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GalleryGridProps {
  photos: (File | string)[]
  onRemove: (index: number) => void
}

export function GalleryGrid({ photos, onRemove }: GalleryGridProps) {
  if (photos.length === 0) return null

  return (
    <div className="grid grid-cols-3 gap-3">
      {photos.map((photo, index) => {
        const isFile = photo instanceof File
        const previewUrl = isFile ? URL.createObjectURL(photo) : photo

        return (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              onClick={() => onRemove(index)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )
      })}
    </div>
  )
}
