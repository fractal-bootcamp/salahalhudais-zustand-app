"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useStore } from "@/lib/store"

interface ThemeFormProps {
  onComplete: () => void
  themeId?: string
}

export function ThemeForm({ onComplete, themeId }: ThemeFormProps) {
  const { themes, addTheme, updateTheme } = useStore()

  const existingTheme = themeId ? themes.find((t) => t.id === themeId) : null

  const [name, setName] = useState(existingTheme?.name || "")
  const [isDark, setIsDark] = useState(existingTheme?.isDark || false)
  const [background, setBackground] = useState(existingTheme?.colors.background || "#ffffff")
  const [text, setText] = useState(existingTheme?.colors.text || "#1a1a1a")
  const [primary, setPrimary] = useState(existingTheme?.colors.primary || "#3b82f6")
  const [secondary, setSecondary] = useState(existingTheme?.colors.secondary || "#6b7280")
  const [accent, setAccent] = useState(existingTheme?.colors.accent || "#f97316")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    const themeData = {
      name,
      isDark,
      colors: {
        background,
        text,
        primary,
        secondary,
        accent,
      },
    }

    if (existingTheme) {
      updateTheme(existingTheme.id, themeData)
    } else {
      addTheme(themeData)
    }

    onComplete()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Theme Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Custom Theme"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode">Dark Mode</Label>
        <Switch id="dark-mode" checked={isDark} onCheckedChange={setIsDark} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="background" className="flex justify-between">
            Background
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: background }}></span>
          </Label>
          <Input id="background" type="color" value={background} onChange={(e) => setBackground(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="text" className="flex justify-between">
            Text
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: text }}></span>
          </Label>
          <Input id="text" type="color" value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="primary" className="flex justify-between">
            Primary
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: primary }}></span>
          </Label>
          <Input id="primary" type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondary" className="flex justify-between">
            Secondary
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: secondary }}></span>
          </Label>
          <Input id="secondary" type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accent" className="flex justify-between">
            Accent
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: accent }}></span>
          </Label>
          <Input id="accent" type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
        </div>
      </div>

      <div className="pt-2">
        <h4 className="text-sm font-medium mb-2">Theme Preview</h4>
        <div
          className="p-3 rounded-md"
          style={{
            backgroundColor: background,
            color: text,
            border: `1px solid ${primary}`,
          }}
        >
          <div className="flex gap-2 mb-2">
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: primary }}></div>
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: secondary }}></div>
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: accent }}></div>
          </div>
          <div className="text-xs">
            <span style={{ color: primary }}>Primary</span> /<span style={{ color: secondary }}> Secondary</span> /
            <span style={{ color: accent }}> Accent</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">{existingTheme ? "Update" : "Create"} Theme</Button>
      </div>
    </form>
  )
}

