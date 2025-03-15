"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

export default function MenuTemplate() {
  // Allergens data with updated list and colors - using more subtle color palette
  const allergens = [
    { id: "gluten", name: "Gluten", color: "bg-amber-500/80", abbr: "G" },
    { id: "crustaceans", name: "Crustaceans", color: "bg-red-500/80", abbr: "C" },
    { id: "eggs", name: "Eggs", color: "bg-yellow-400/80", abbr: "E" },
    { id: "fish", name: "Fish", color: "bg-blue-400/80", abbr: "F" },
    { id: "peanuts", name: "Peanuts", color: "bg-amber-700/80", abbr: "P" },
    { id: "soybeans", name: "Soybeans", color: "bg-green-500/80", abbr: "S" },
    { id: "lactose", name: "Lactose", color: "bg-sky-400/80", abbr: "L" },
    { id: "treenuts", name: "Tree Nuts", color: "bg-amber-800/80", abbr: "TN" },
    { id: "celery", name: "Celery", color: "bg-green-400/80", abbr: "CE" },
    { id: "mustard", name: "Mustard", color: "bg-yellow-500/80", abbr: "M" },
    { id: "sesame", name: "Sesame Seeds", color: "bg-stone-400/80", abbr: "SE" },
    { id: "sulfites", name: "Sulfites", color: "bg-pink-400/80", abbr: "SU" },
    { id: "lupin", name: "Lupin", color: "bg-purple-400/80", abbr: "LU" },
    { id: "molluscs", name: "Molluscs", color: "bg-blue-300/80", abbr: "MO" },
  ]

  // Menu items data
  const menuItems = [
    {
      id: "bruschetta",
      name: "Bruschetta",
      description: "Toasted bread topped with diced tomatoes, fresh basil, and garlic",
      allergens: ["gluten"],
      crossContamination: false,
      category: "Appetizers",
    },
    {
      id: "shrimp-cocktail",
      name: "Shrimp Cocktail",
      description: "Chilled shrimp served with cocktail sauce and lemon",
      allergens: ["crustaceans", "mustard"],
      crossContamination: false,
      category: "Appetizers",
    },
    {
      id: "calamari",
      name: "Calamari",
      description: "Lightly fried calamari served with marinara sauce",
      allergens: ["gluten", "eggs", "molluscs"],
      crossContamination: true,
      category: "Appetizers",
    },
    {
      id: "salmon",
      name: "Grilled Salmon",
      description: "Fresh salmon fillet grilled with lemon and herbs, served with seasonal vegetables",
      allergens: ["fish", "sulfites"],
      crossContamination: false,
      category: "Entrees",
    },
    {
      id: "risotto",
      name: "Mushroom Risotto",
      description: "Creamy arborio rice with wild mushrooms and parmesan",
      allergens: ["lactose", "celery"],
      crossContamination: false,
      category: "Entrees",
    },
    {
      id: "chicken-parm",
      name: "Chicken Parmesan",
      description: "Breaded chicken breast topped with marinara and mozzarella, served with pasta",
      allergens: ["gluten", "lactose", "eggs"],
      crossContamination: true,
      category: "Entrees",
    },
    {
      id: "pad-thai",
      name: "Pad Thai",
      description: "Rice noodles stir-fried with eggs, tofu, bean sprouts, and peanuts",
      allergens: ["eggs", "peanuts", "soybeans", "fish"],
      crossContamination: false,
      category: "Entrees",
    },
    {
      id: "lava-cake",
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
      allergens: ["gluten", "lactose", "eggs", "treenuts"],
      crossContamination: false,
      category: "Desserts",
    },
    {
      id: "sorbet",
      name: "Fresh Fruit Sorbet",
      description: "Seasonal fruit sorbet, dairy-free and gluten-free",
      allergens: ["sulfites"],
      crossContamination: false,
      category: "Desserts",
    },
    {
      id: "baklava",
      name: "Baklava",
      description: "Layered pastry with nuts and honey syrup",
      allergens: ["gluten", "treenuts", "sesame"],
      crossContamination: false,
      category: "Desserts",
    },
  ]

  // State for selected allergens and filter toggle
  const [selectedAllergens, setSelectedAllergens] = useState([])
  const [hideAllergenic, setHideAllergenic] = useState(false)
  const [filteredItems, setFilteredItems] = useState(menuItems)
  const [showAllergenPolicy, setShowAllergenPolicy] = useState(false)

  // Toggle allergen selection
  const toggleAllergen = (allergenId) => {
    setSelectedAllergens((prev) => {
      if (prev.includes(allergenId)) {
        return prev.filter((id) => id !== allergenId)
      } else {
        return [...prev, allergenId]
      }
    })
  }

  // Check if item contains any selected allergens
  const containsSelectedAllergens = (item) => {
    return item.allergens.some((allergen) => selectedAllergens.includes(allergen))
  }

  // Update filtered items when selections change
  useEffect(() => {
    const newFilteredItems = menuItems.filter((item) => {
      if (hideAllergenic && containsSelectedAllergens(item)) {
        return false
      }
      return true
    })

    setFilteredItems(newFilteredItems)
  }, [selectedAllergens, hideAllergenic])

  // Group menu items by category
  const groupedMenuItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, [selectedAllergens, hideAllergenic, containsSelectedAllergens, menuItems])

  // Reset all filters
  const resetFilters = () => {
    setSelectedAllergens([])
    setHideAllergenic(false)
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container bg-stone-100 mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-stone-100 rounded-lg shadow-sm overflow-hidden">
        {/* Menu Header - simplified styling */}
        <div className="p-8 flex flex-col items-center justify-center border-b border-stone-100">
          <div className="mb-6">
            <Image
              src="/placeholder.svg?height=64&width=64"
              alt="Restaurant Logo"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <h1 className="text-2xl font-semibold text-center">Restaurant Name</h1>
          <h2 className="text-lg font-medium text-center mt-1">Allergen Menu</h2>
          <p className="text-sm text-gray-500 mt-1">Last Updated: {currentDate}</p>
        </div>

        {/*  Allergen Policy */}
        <div className="p-6 bg-stone-50 rounded-md">
        <h4 className="text-base font-medium">Allergen Policy</h4>     
            <div className="mt-2 text-sm text-gray-500">
              <p>
                At Restaurant Name, we are committed to accommodating guests with food allergies and dietary restrictions.
                Please inform your server of any allergies before ordering. Our kitchen staff will take extra precautions
                when preparing your meal, but please be aware that we cannot guarantee a completely allergen-free
                environment as items are prepared in a kitchen where cross-contamination with allergens may
                occur.
              </p>
            </div>
        </div>

        {/* Allergen Filter Section - cleaner UI */}
        <div className="p-6 border-b border-stone-100 bg-stone-50">
          <h3 className="text-base font-medium mb-4">Personalize Your Menu</h3>
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium mb-3 text-gray-600">Select your allergies:</p>
              <div className="flex flex-wrap gap-2">
                {allergens.map((allergen) => (
                  <Button
                    key={allergen.id}
                    variant={selectedAllergens.includes(allergen.id) ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => toggleAllergen(allergen.id)}
                    className="px-3 py-1 h-8 rounded-md"
                  >
                    <span
                      className={`w-5 h-5 rounded-full ${allergen.color} mr-1.5 flex items-center justify-center text-stone-100 text-[10px] font-bold`}
                    >
                      {allergen.abbr}
                    </span>
                    <span className="text-sm">{allergen.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="hide-allergenic"
                checked={hideAllergenic}
                onCheckedChange={(value) => setHideAllergenic(value)}
              />
              <Label htmlFor="hide-allergenic" className="text-sm">Hide items containing my allergens</Label>
            </div>

            {selectedAllergens.length > 0 && (
              <div className="p-3 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-600">
                  {hideAllergenic
                    ? `Items containing your selected allergens are hidden (${menuItems.length - filteredItems.length} items hidden).`
                    : `Items containing your selected allergens are highlighted (${menuItems.filter((item) => containsSelectedAllergens(item)).length} items).`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items Section */}
        <div className="p-6">
          {Object.entries(groupedMenuItems).length > 0 ? (
            Object.entries(groupedMenuItems).map(([category, items]) => (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-medium mb-4 pb-2 border-b border-stone-300">{category}</h3>

                <div className="space-y-3">
                  {items.map((item) => {
                    const hasSelectedAllergens = containsSelectedAllergens(item)

                    return (
                      <div
                        key={item.id}
                        className={`py-3 px-4 rounded-md transition-all ${hasSelectedAllergens && selectedAllergens.length > 0
                          ? "bg-amber-50 ring-1 ring-amber-100"
                          : "hover:bg-stone-50"
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap">
                              <h4 className="font-medium text-gray-900">
                                {item.name}
                                {item.crossContamination ? "*" : ""}
                              </h4>
                              {hasSelectedAllergens && selectedAllergens.length > 0 && !hideAllergenic && (
                                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                  🚨 Allergen Alert
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>

                            {/* Show which specific allergens from selection are in this item */}
                            {hasSelectedAllergens && selectedAllergens.length > 0 && !hideAllergenic && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">
                                  Contains:{" "}
                                  {item.allergens
                                    .filter((a) => selectedAllergens.includes(a))
                                    .map((a) => {
                                      const allergen = allergens.find((al) => al.id === a)
                                      return allergen ? allergen.name : ""
                                    })
                                    .join(", ")}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 ml-2 max-w-[120px] justify-end">
                            {item.allergens.map((allergenId) => {
                              const allergen = allergens.find((a) => a.id === allergenId)
                              if (!allergen) return null

                              const isSelected = selectedAllergens.includes(allergenId)

                              return (
                                <div
                                  key={allergenId}
                                  className={`w-5 h-5 rounded-full ${allergen.color} flex items-center justify-center text-stone-100 font-bold text-xs ${isSelected ? "ring-1 ring-offset-1 ring-yellow-400" : ""
                                    }`}
                                  title={allergen.name}
                                >
                                  {allergen.abbr}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <X className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-base font-medium mb-2">No matching items</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                All items containing your selected allergens are currently hidden. Adjust your allergen selections or
                toggle the filter to see more menu items.
              </p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="p-6 bg-stone-50 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="max-w-md">
              <p className="text-sm text-gray-500 mb-2">
                Restaurant description text...
              </p>
              <p className="text-sm text-gray-500">
                For more detailed allergen information, please contact us at{" "}
                <span className="text-gray-900">info@restaurantname.com</span> or call
                <span className="text-gray-900"> (555) 123-4567</span>.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-stone-100 p-3 rounded-lg shadow-sm mb-2">
                <Image src="/placeholder.svg?height=80&width=80" alt="QR Code" width={80} height={80} />
              </div>
              <p className="text-xs text-center text-gray-500">Scan for digital menu</p>
            </div>
          </div>
        </div>
      </div >
              {/* SafeSpoon Simple Disclaimer */}
              <div className="my-3 p-6 bg-stone-50 rounded-md mb-3">
          <p className="text-xs text-gray-500">
            ⚠️ This allergen information is provided directly by the restaurant.
            SafeSpoon does not verify this information. Always confirm allergens directly with restaurant staff before ordering.
          </p>
        </div>

      <div className="mt-10 text-center">
        <p className="mb-4 text-gray-500 text-sm">
          This is a sample template. Create your own customized allergen menu today!
        </p>
        <Button asChild size="lg" className="rounded-md px-6 bg-teal-900">
          <Link href="/">Get Started</Link>
        </Button>
      </div>
    </div >
  )
}