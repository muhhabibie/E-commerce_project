"use client"

import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

interface FilterBarProps {
  onSearch?: (query: string) => void
  onFilter?: () => void
  searchPlaceholder?: string
}

export function FilterBar({ onSearch, onFilter, searchPlaceholder = "Search..." }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-md">
      <Search className="w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        placeholder={searchPlaceholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={onFilter}
        className="text-primary border-primary hover:bg-secondary-light bg-transparent"
      >
        <Filter className="w-4 h-4" />
      </Button>
    </div>
  )
}
