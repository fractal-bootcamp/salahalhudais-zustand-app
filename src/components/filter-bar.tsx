"use client"

import { Filter, SlidersHorizontal } from "lucide-react"

export function FilterBar() {
  return (
    <div className="border-b border-zinc-800 h-12 flex items-center justify-between">
      <div className="flex items-center pl-4">
        <button className="flex items-center text-zinc-400 hover:text-white">
          <Filter size={16} className="mr-2" />
          <span>Filter</span>
        </button>
      </div>
      <div className="flex items-center pr-4">
        <button className="flex items-center text-zinc-400 hover:text-white">
          <span className="mr-2">Display</span>
          <SlidersHorizontal size={16} />
        </button>
      </div>
    </div>
  )
}

