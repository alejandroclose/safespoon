'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowPathIcon,
  QrCodeIcon,
  DocumentDuplicateIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CategoryForm } from '@/components/menu/CategoryForm'
import { MenuItemForm } from '@/components/menu/MenuItemForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

// Mock allergens data (should come from API)
const allergens = [
  { id: "gluten", name: "Gluten", color: "bg-amber-500/80", abbr: "G" },
  { id: "crustaceans", name: "Crustaceans", color: "bg-red-500/80", abbr: "C" },
  { id: "eggs", name: "Eggs", color: "bg-yellow-400/80", abbr: "E" },
  { id: "fish", name: "Fish", color: "bg-blue-400/80", abbr: "F" },
  { id: "peanuts", name: "Peanuts", color: "bg-amber-700/80", abbr: "P" },
  { id: "soybeans", name: "Soybeans", color: "bg-green-500/80", abbr: "S" },
  { id: "lactose", name: "Lactose", color: "bg-sky-400/80", abbr: "L" },
  { id: "treenuts", name: "Tree Nuts", color: "bg-amber-800/80", abbr: "TN" },
  // Cut down for brevity - would include all allergens
]

export default function MenuEditor() {
  const router = useRouter()
  const { menuId } = useParams() || { menuId: 'new' }
  const isNewMenu = menuId === 'new'
  
  const [isLoading, setIsLoading] = useState(true)
  const [menu, setMenu] = useState({
    id: '',
    name: '',
    description: '',
    isActive: true,
    allergenPolicy: '',
    categories: [],
    establishments: []
  })
  
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [showItemForm, setShowItemForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [currentCategoryId, setCurrentCategoryId] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingItemId, setDeletingItemId] = useState(null)
  const [deletingCategoryId, setDeletingCategoryId] = useState(null)
  const [activeTab, setActiveTab] = useState('categories')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchMenuData = async () => {
      if (isNewMenu) {
        setMenu({
          id: '',
          name: 'New Menu',
          description: '',
          isActive: true,
          allergenPolicy: 'At our establishment, we are committed to accommodating guests with food allergies and dietary restrictions. Please inform your server of any allergies before ordering.',
          categories: [],
          establishments: []
        })
        setIsLoading(false)
        return
      }

      try {
        // Replace with actual API call
        // const response = await fetch(`/api/menus/${menuId}`)
        // const data = await response.json()
        
        // Simulated data
        const data = {
          id: menuId,
          name: 'Sample Restaurant Menu',
          description: 'Our regular menu with allergen information',
          isActive: true,
          allergenPolicy: 'At our establishment, we are committed to accommodating guests with food allergies and dietary restrictions. Please inform your server of any allergies before ordering.',
          categories: [
            {
              id: 'cat1',
              name: 'Appetizers',
              items: [
                {
                  id: 'item1',
                  name: 'Bruschetta',
                  description: 'Toasted bread topped with diced tomatoes, fresh basil, and garlic',
                  allergens: ['gluten'],
                  crossContamination: false,
                  price: '8.99'
                },
                {
                  id: 'item2',
                  name: 'Calamari',
                  description: 'Lightly fried calamari served with marinara sauce',
                  allergens: ['gluten', 'eggs'],
                  crossContamination: true,
                  price: '12.99'
                }
              ]
            },
            {
              id: 'cat2',
              name: 'Entrees',
              items: [
                {
                  id: 'item3',
                  name: 'Grilled Salmon',
                  description: 'Fresh salmon fillet grilled with lemon and herbs',
                  allergens: ['fish'],
                  crossContamination: false,
                  price: '24.99'
                }
              ]
            }
          ],
          establishments: [
            { id: 'est1', name: 'My Restaurant' }
          ]
        }
        
        setMenu(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching menu data:', error)
        setIsLoading(false)
      }
    }

    fetchMenuData()
  }, [menuId, isNewMenu])

  const handleMenuInfoChange = (e) => {
    const { name, value } = e.target
    setMenu(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStatusChange = (checked) => {
    setMenu(prev => ({
      ...prev,
      isActive: checked
    }))
  }

  const handleAddCategory = (categoryName) => {
    const newCategory = {
      id: `temp_${Date.now()}`, // Will be replaced by server-generated ID
      name: categoryName,
      items: []
    }
    
    setMenu(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }))
    
    setShowCategoryForm(false)
  }

  const handleEditCategory = (categoryId) => {
    const category = menu.categories.find(cat => cat.id === categoryId)
    setEditingCategory(category)
    setShowCategoryForm(true)
  }

  const handleUpdateCategory = (categoryName) => {
    setMenu(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: categoryName }
          : cat
      )
    }))
    
    setEditingCategory(null)
    setShowCategoryForm(false)
  }

  const confirmDeleteCategory = (categoryId) => {
    setDeletingCategoryId(categoryId)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteCategory = () => {
    setMenu(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== deletingCategoryId)
    }))
    
    setDeletingCategoryId(null)
    setDeleteConfirmOpen(false)
  }

  const handleAddItem = (categoryId) => {
    setCurrentCategoryId(categoryId)
    setShowItemForm(true)
  }

  const handleEditItem = (categoryId, itemId) => {
    const category = menu.categories.find(cat => cat.id === categoryId)
    const item = category.items.find(item => item.id === itemId)
    
    setCurrentCategoryId(categoryId)
    setEditingItem(item)
    setShowItemForm(true)
  }

  const handleSubmitItem = (itemData) => {
    if (editingItem) {
      // Update existing item
      setMenu(prev => ({
        ...prev,
        categories: prev.categories.map(cat => 
          cat.id === currentCategoryId
            ? {
                ...cat,
                items: cat.items.map(item => 
                  item.id === editingItem.id
                    ? { ...itemData, id: item.id }
                    : item
                )
              }
            : cat
        )
      }))
    } else {
      // Add new item
      const newItem = {
        ...itemData,
        id: `temp_${Date.now()}` // Will be replaced by server-generated ID
      }
      
      setMenu(prev => ({
        ...prev,
        categories: prev.categories.map(cat => 
          cat.id === currentCategoryId
            ? { ...cat, items: [...cat.items, newItem] }
            : cat
        )
      }))
    }
    
    setShowItemForm(false)
    setEditingItem(null)
    setCurrentCategoryId(null)
  }

  const confirmDeleteItem = (categoryId, itemId) => {
    setCurrentCategoryId(categoryId)
    setDeletingItemId(itemId)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteItem = () => {
    setMenu(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === currentCategoryId
          ? {
              ...cat,
              items: cat.items.filter(item => item.id !== deletingItemId)
            }
          : cat
      )
    }))
    
    setDeletingItemId(null)
    setCurrentCategoryId(null)
    setDeleteConfirmOpen(false)
  }

  const handleSaveMenu = async () => {
    setIsSaving(true)
    
    try {
      // For new menu
      if (isNewMenu) {
        // Create menu API call
        // const response = await fetch('/api/menus', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(menu),
        // })
        // const data = await response.json()
        
        // Simulate successful save
        setTimeout(() => {
          router.push('/dashboard/menus')
        }, 1000)
        
        return
      }
      
      // For existing menu
      // const response = await fetch(`/api/menus/${menuId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(menu),
      // })
      // const data = await response.json()
      
      // Simulate successful save
      setTimeout(() => {
        setIsSaving(false)
      }, 1000)
      
    } catch (error) {
      console.error('Error saving menu:', error)
      setIsSaving(false)
    }
  }

  const handleCancelForm = () => {
    setShowCategoryForm(false)
    setShowItemForm(false)
    setEditingCategory(null)
    setEditingItem(null)
    setCurrentCategoryId(null)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ArrowPathIcon className="size-8 animate-spin text-teal-700 mx-auto mb-4" />
            <p className="text-gray-500">Loading menu...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/menus')}>
              <ArrowLeftIcon className="size-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">{isNewMenu ? 'Create Menu' : 'Edit Menu'}</h1>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/dashboard/menus/preview/${menuId}`)}
              disabled={isNewMenu}
            >
              <QrCodeIcon className="size-4 mr-1" />
              Preview
            </Button>
            <Button 
              onClick={handleSaveMenu}
              disabled={isSaving}
              className="bg-teal-900 hover:bg-teal-700"
            >
              {isSaving ? (
                <>
                  <ArrowPathIcon className="size-4 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {isNewMenu ? 'Create Menu' : 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Menu Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Menu Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="menuName">Menu Name</Label>
                <Input 
                  id="menuName" 
                  name="name" 
                  value={menu.name} 
                  onChange={handleMenuInfoChange} 
                  placeholder="Enter menu name" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="menuDescription">Menu Description (optional)</Label>
                <Input 
                  id="menuDescription" 
                  name="description" 
                  value={menu.description} 
                  onChange={handleMenuInfoChange} 
                  placeholder="Brief description of this menu" 
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="allergenPolicy">Allergen Policy</Label>
                <textarea
                  id="allergenPolicy"
                  name="allergenPolicy"
                  value={menu.allergenPolicy}
                  onChange={handleMenuInfoChange}
                  placeholder="Enter your restaurant's allergen policy"
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="menuStatus" 
                  checked={menu.isActive}
                  onCheckedChange={handleStatusChange}
                />
                <Label htmlFor="menuStatus">
                  Menu is {menu.isActive ? 'active' : 'inactive'}
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Categories/Items and Establishments */}
        <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="categories">Categories & Items</TabsTrigger>
            <TabsTrigger value="establishments">Establishments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Categories & Menu Items Tab */}
          <TabsContent value="categories" className="space-y-4 pt-4">
            {/* Add Category Button */}
            {!showCategoryForm && (
              <Button 
                onClick={() => setShowCategoryForm(true)}
                variant="outline"
                className="mb-4"
              >
                <PlusIcon className="size-4 mr-1" />
                Add Category
              </Button>
            )}
            
            {/* Category Form */}
            {showCategoryForm && (
              <CategoryForm 
                onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
                onCancel={handleCancelForm}
                initialValue={editingCategory ? editingCategory.name : ''}
              />
            )}
            
            {/* Categories */}
            {menu.categories.length > 0 ? (
              <div className="space-y-6">
                {menu.categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>{category.name}</CardTitle>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditCategory(category.id)}
                          >
                            <PencilIcon className="size-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => confirmDeleteCategory(category.id)}
                          >
                            <TrashIcon className="size-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {category.items.length > 0 ? (
                        <div className="space-y-3">
                          {category.items.map((item) => (
                            <div 
                              key={item.id} 
                              className="flex justify-between items-start p-3 border border-gray-100 rounded-md hover:bg-gray-50"
                            >
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.description}</div>
                                <div className="flex items-center gap-1 mt-1">
                                  {item.allergens.map((allergenId) => {
                                    const allergen = allergens.find(a => a.id === allergenId)
                                    if (!allergen) return null
                                    
                                    return (
                                      <span 
                                        key={allergenId}
                                        className={`w-5 h-5 rounded-full ${allergen.color} flex items-center justify-center text-stone-100 font-bold text-xs`}
                                        title={allergen.name}
                                      >
                                        {allergen.abbr}
                                      </span>
                                    )
                                  })}
                                  {item.crossContamination && (
                                    <Badge variant="outline" className="text-xs">
                                      Cross-contamination risk
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-start gap-1">
                                <div className="font-medium">${item.price}</div>
                                <div className="flex gap-1 ml-4">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditItem(category.id, item.id)}
                                  >
                                    <PencilIcon className="size-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => confirmDeleteItem(category.id, item.id)}
                                  >
                                    <TrashIcon className="size-4 text-red-500" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No items in this category yet
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddItem(category.id)}
                      >
                        <PlusIcon className="size-4 mr-1" />
                        Add Item
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-md bg-gray-50">
                <p className="text-gray-500 mb-4">No categories added yet</p>
                <Button 
                  onClick={() => setShowCategoryForm(true)}
                  className="bg-teal-900 hover:bg-teal-700"
                >
                  <PlusIcon className="size-4 mr-1" />
                  Add Your First Category
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Establishments Tab */}
          <TabsContent value="establishments" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Linked Establishments</CardTitle>
                <CardDescription>Select which of your establishments will use this menu</CardDescription>
              </CardHeader>
              <CardContent>
                {menu.establishments.length > 0 ? (
                  <div className="space-y-3">
                    {menu.establishments.map(establishment => (
                      <div key={establishment.id} className="flex items-center gap-2 p-3 border rounded-md">
                        <Switch id={`est-${establishment.id}`} checked={true} />
                        <Label htmlFor={`est-${establishment.id}`}>{establishment.name}</Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">No establishments linked yet</p>
                    <Button asChild className="bg-teal-900 hover:bg-teal-700">
                      <Link href="/dashboard/establishments">Manage Establishments</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Additional configuration for this menu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="menuSlug">Menu URL Slug</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="menuSlug" 
                      value={menu.id || ''} 
                      disabled 
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" disabled={isNewMenu}>
                      <DocumentDuplicateIcon className="size-4 mr-1" />
                      Copy URL
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    This is the unique URL for accessing this menu directly.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Danger Zone</h3>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:text-red-700" disabled={isNewMenu}>
                      <DocumentDuplicateIcon className="size-4 mr-1" />
                      Duplicate Menu
                    </Button>
                    
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:text-red-700" disabled={isNewMenu}>
                      <TrashIcon className="size-4 mr-1" />
                      Delete Menu
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Item Form Modal (simplified for brevity - would use a proper modal) */}
      {showItemForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <MenuItemForm 
              onSubmit={handleSubmitItem}
              onCancel={handleCancelForm}
              initialValues={editingItem || {}}
              allergens={allergens}
            />
          </div>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deletingItemId ? 'Delete Menu Item' : 'Delete Category'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deletingItemId 
                ? 'Are you sure you want to delete this menu item? This action cannot be undone.'
                : 'Are you sure you want to delete this category and all its menu items? This action cannot be undone.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deletingItemId ? handleDeleteItem : handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}