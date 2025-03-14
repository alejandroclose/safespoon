'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CategoryForm({ onSubmit, onCancel, initialValue = "" }) {
  const [name, setName] = useState(initialValue)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-md">
      <h2 className="text-xl font-bold">{initialValue ? "Edit Category" : "Add Category"}</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="categoryName">Category Name</Label>
          <Input
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialValue ? "Update" : "Add"} Category</Button>
      </div>
    </form>
  )
}