'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'

export function MenuItemForm({ onSubmit, onCancel, initialValues = {}, allergens }) {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    description: initialValues.description || '',
    price: initialValues.price || '',
    allergens: initialValues.allergens || [],
    crossContamination: initialValues.crossContamination || false,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAllergenToggle = (allergenId) => {
    setFormData(prev => {
      const allergens = [...prev.allergens]
      
      if (allergens.includes(allergenId)) {
        return {
          ...prev,
          allergens: allergens.filter(id => id !== allergenId)
        }
      } else {
        return {
          ...prev,
          allergens: [...allergens, allergenId]
        }
      }
    })
  }

  const handleCrossContaminationToggle = (checked) => {
    setFormData(prev => ({
      ...prev,
      crossContamination: checked
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="itemName">Item Name</Label>
          <Input
            id="itemName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter item name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="itemPrice">Price</Label>
          <Input
            id="itemPrice"
            name="price"
            type="text"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="itemDescription">Description</Label>
        <textarea
          id="itemDescription"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the menu item"
          className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div className="space-y-3">
        <Label>Allergens</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {allergens.map((allergen) => (
            <div key={allergen.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`allergen-${allergen.id}`} 
                checked={formData.allergens.includes(allergen.id)}
                onCheckedChange={() => handleAllergenToggle(allergen.id)}
              />
              <Label htmlFor={`allergen-${allergen.id}`} className="flex items-center gap-1">
                <span 
                  className={`w-5 h-5 rounded-full ${allergen.color} flex items-center justify-center text-stone-100 font-bold text-xs`}
                >
                  {allergen.abbr}
                </span>
                <span>{allergen.name}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="crossContamination" 
          checked={formData.crossContamination}
          onCheckedChange={handleCrossContaminationToggle}
        />
        <Label htmlFor="crossContamination">Risk of cross-contamination</Label>
      </div>
      
      <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-teal-900 hover:bg-teal-700">
          {initialValues.name ? 'Update' : 'Add'} Item
        </Button>
      </div>
    </form>
  )
}