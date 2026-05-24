"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FormField } from "./form-field"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ImageUploadFieldProps {
  label: string
  helperText?: string
  onImageSelect: (file: File | null, preview: string) => void
  preview?: string
  aspectRatio?: "square" | "wide"
  maxSize?: number // in MB
}

export function ImageUploadField({
  label,
  helperText,
  onImageSelect,
  preview,
  aspectRatio = "square",
  maxSize = 5,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>("")

  const handleFileSelect = (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File terlalu besar. Maksimal ${maxSize}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar yang diperbolehkan")
      return
    }

    setError("")

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = e.target?.result as string
      onImageSelect(file, preview)
    }
    reader.readAsDataURL(file)
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <FormField label={label} helperText={helperText} error={error}>
      {preview ? (
        <div className="relative group">
          <div
            className={`relative overflow-hidden rounded-lg bg-muted ${
              aspectRatio === "wide" ? "aspect-video" : "aspect-square"
            }`}
          >
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <Button type="button" size="sm" variant="secondary" onClick={handleClick}>
              Ubah
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => {
                onImageSelect(null, "")
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all"
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Klik atau drag gambar ke sini</p>
            <p className="text-xs text-text-secondary">Format PNG, JPG, atau GIF. Maks {maxSize}MB</p>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            handleFileSelect(file)
          }
        }}
        className="hidden"
      />
    </FormField>
  )
}
