"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Trash2, Upload, Edit, Plus, Library, Layers, ImageIcon, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import { API_URL } from "../lib/config"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { sessionManager } from '../utils/sessionManager'

interface LibraryType {
  library_id: number
  library_name: string
  library_description: string
  sections?: Section[]
}

interface Section {
  section_id: number
  section_name: string
  section_description: string
  section_image: string | null
}

const AdminLibraries = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [libraries, setLibraries] = useState<LibraryType[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLibrary, setSelectedLibrary] = useState<LibraryType | null>(null)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)

  // Form states
  const [libraryName, setLibraryName] = useState("")
  const [libraryAbout, setLibraryAbout] = useState("")
  const [submittingLibrary, setSubmittingLibrary] = useState(false)
  const [sectionName, setSectionName] = useState("")
  const [sectionDesc, setSectionDesc] = useState("")
  const [sectionFile, setSectionFile] = useState<File | null>(null)
  const [sectionPreview, setSectionPreview] = useState("")
  const [submittingSection, setSubmittingSection] = useState(false)

  const [libraryDialogOpen, setLibraryDialogOpen] = useState(false)
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null)
  const [deleteType, setDeleteType] = useState<"library" | "section">("library")
  const [deleteItemName, setDeleteItemName] = useState("")
  const [activeTab, setActiveTab] = useState("libraries")

  const fetchLibraries = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/unit_libraries.php?operation=getLibraries`)
      const data = await response.json()

      if (data.status === "success") {
        setLibraries(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch libraries")
      }
    } catch (error) {
      console.error("Error fetching libraries:", error)
      toast.error(error instanceof Error ? error.message : "Failed to fetch libraries")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchLibraryDetails = useCallback(async (id: number) => {
    try {
      const response = await fetch(
        `${API_URL}/unit_libraries.php?operation=getLibraryById&json=${JSON.stringify({ id })}`,
      )
      const data = await response.json()

      if (data.status === "success") {
        setSelectedLibrary({
          ...data.data,
          sections: data.data.sections || [],
        })
      } else {
        throw new Error(data.message || "Failed to fetch library details")
      }
    } catch (error) {
      console.error("Error fetching library details:", error)
      toast.error(error instanceof Error ? error.message : "Failed to fetch library details")
    }
  }, [])

  useEffect(() => {
    if (sessionManager.isAuthenticated() && sessionManager.getRole() === 'admin') {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    fetchLibraries()
  }, [fetchLibraries])

  const handleLibrarySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error("Please sign in to manage libraries")
      return
    }

    setSubmittingLibrary(true)
    try {
      const response = await fetch(`${API_URL}/unit_libraries.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          operation: selectedLibrary ? "updateLibrary" : "addLibrary",
          json: JSON.stringify({
            ...(selectedLibrary && { id: selectedLibrary.library_id }),
            unit_name: libraryName,
            about: libraryAbout,
          }),
        }),
      })

      const result = await response.json()

      if (result.status === "success") {
        toast.success(selectedLibrary ? "Library updated successfully!" : "Library added successfully!")
        resetLibraryForm()
        fetchLibraries()
        setLibraryDialogOpen(false) // Close dialog after successful update
      } else {
        throw new Error(result.message || "Server error")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Error managing library")
    } finally {
      setSubmittingLibrary(false)
    }
  }

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || !selectedLibrary) {
      toast.error("Please sign in and select a library to manage sections")
      return
    }

    setSubmittingSection(true)
    try {
      const formData = new FormData()
      formData.append("operation", selectedSection ? "updateSection" : "addSection")
      formData.append(
        "json",
        JSON.stringify({
          ...(selectedSection && { id: selectedSection.section_id }),
          section_name: sectionName,
          section_desc: sectionDesc,
          section_image: sectionFile ? await fileToBase64(sectionFile) : selectedSection?.section_image || null,
          unit_lib_id: selectedLibrary.library_id,
        }),
      )

      const response = await fetch(`${API_URL}/unit_libraries.php`, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.status === "success") {
        toast.success(selectedSection ? "Section updated successfully!" : "Section added successfully!")
        resetSectionForm()
        fetchLibraryDetails(selectedLibrary.library_id)
        setSectionDialogOpen(false) // Close dialog after successful update
      } else {
        throw new Error(result.message || "Server error")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Error adding section")
    } finally {
      setSubmittingSection(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1]
        resolve(base64String)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleDeleteLibrary = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/unit_libraries.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          operation: "deleteLibrary",
          json: JSON.stringify({ id }),
        }),
      })

      const result = await response.json()

      if (result.status === "success") {
        toast.success("Library deleted successfully")
        fetchLibraries()
        if (selectedLibrary?.library_id === id) {
          setSelectedLibrary(null)
        }
      } else {
        throw new Error(result.message || "Server error")
      }
    } catch (error) {
      console.error("Error deleting library:", error)
      toast.error("Failed to delete library")
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  const handleDeleteSection = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/unit_libraries.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          operation: "deleteSection",
          json: JSON.stringify({ id }),
        }),
      })

      const result = await response.json()

      if (result.status === "success") {
        toast.success("Section deleted successfully")
        if (selectedLibrary) {
          fetchLibraryDetails(selectedLibrary.library_id)
        }
      } else {
        throw new Error(result.message || "Server error")
      }
    } catch (error) {
      console.error("Error deleting section:", error)
      toast.error("Failed to delete section")
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  const handleSectionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSectionFile(file)
      setSectionPreview(URL.createObjectURL(file))
    }
  }

  const resetLibraryForm = () => {
    setLibraryName("")
    setLibraryAbout("")
    setSelectedLibrary(null)
  }

  const resetSectionForm = () => {
    setSectionName("")
    setSectionDesc("")
    setSectionFile(null)
    setSectionPreview("")
    setSelectedSection(null)
  }

  const handleEditLibrary = async (library: LibraryType) => {
    setSelectedLibrary(library)
    setLibraryName(library.library_name)
    setLibraryAbout(library.library_description)
    // Fetch library details with sections
    await fetchLibraryDetails(library.library_id)
  }

  const handleEditSection = (section: Section) => {
    setSelectedSection(section)
    setSectionName(section.section_name)
    setSectionDesc(section.section_description)
    if (section.section_image) {
      setSectionPreview(`data:image/jpeg;base64,${section.section_image}`)
    }
  }

  const handleViewLibraryDetails = async (library: LibraryType) => {
    await fetchLibraryDetails(library.library_id)
    setActiveTab("sections")
  }

  const openDeleteDialog = (id: number, type: "library" | "section", name: string) => {
    setDeleteItemId(id)
    setDeleteType(type)
    setDeleteItemName(name)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (!deleteItemId) return

    if (deleteType === "library") {
      handleDeleteLibrary(deleteItemId)
    } else {
      handleDeleteSection(deleteItemId)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Library Management</h1>
          <p className="text-gray-500 mt-1">Create and manage libraries and their sections</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              resetLibraryForm()
              setLibraryDialogOpen(true)
            }}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Library
          </Button>
          <Button
            onClick={() => {
              if (!selectedLibrary) {
                toast.error("Please select a library first")
                return
              }
              resetSectionForm()
              setSectionDialogOpen(true)
            }}
            variant={selectedLibrary ? "default" : "outline"}
            disabled={!selectedLibrary}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Section
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="libraries" className="text-base">
            <Library className="h-4 w-4 mr-2" />
            Libraries
          </TabsTrigger>
          <TabsTrigger value="sections" className="text-base" disabled={!selectedLibrary}>
            <Layers className="h-4 w-4 mr-2" />
            Sections
            {selectedLibrary && (
              <Badge variant="outline" className="ml-2 bg-white">
                {selectedLibrary.library_name}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="libraries" className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="h-6 w-3/4 mb-2 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 w-full bg-gray-200 animate-pulse rounded"></div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-2">
                    <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : libraries.length === 0 ? (
            <Card className="border-dashed border-2 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Library className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No Libraries Found</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  You haven't created any libraries yet. Libraries help you organize your content into sections.
                </p>
                <Button
                  onClick={() => {
                    resetLibraryForm()
                    setLibraryDialogOpen(true)
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Library
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraries.map((library) => (
                <Card key={library.library_id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Library className="h-5 w-5 text-emerald-600" />
                      {library.library_name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{library.library_description}</CardDescription>
                  </CardHeader>
                  
                  <CardFooter className="flex justify-between gap-2 pt-2 border-t bg-gray-50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewLibraryDetails(library)}
                      className="text-emerald-700"
                    >
                      View Sections
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleEditLibrary(library)
                          setLibraryDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(library.library_id, "library", library.library_name)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sections" className="mt-0">
          {!selectedLibrary ? (
            <Card className="border-dashed border-2 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Layers className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No Library Selected</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  Please select a library first to view and manage its sections.
                </p>
                <Button onClick={() => setActiveTab("libraries")} variant="outline">
                  Go to Libraries
                </Button>
              </CardContent>
            </Card>
          ) : selectedLibrary.sections?.length === 0 ? (
            <Card className="border-dashed border-2 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Layers className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No Sections Found</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  This library doesn't have any sections yet. Sections help you organize content within a library.
                </p>
                <Button
                  onClick={() => {
                    resetSectionForm()
                    setSectionDialogOpen(true)
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Section
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Sections in {selectedLibrary.library_name}</h2>
                  <p className="text-gray-500">
                    {selectedLibrary.sections?.length || 0}{" "}
                    {selectedLibrary.sections?.length === 1 ? "section" : "sections"} available
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedLibrary.sections?.map((section) => (
                  <Card key={section.section_id} className="overflow-hidden transition-all hover:shadow-md">
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      {section.section_image ? (
                        <img
                          src={`data:image/jpeg;base64,${section.section_image}`}
                          alt={section.section_name}
                          className="object-cover w-full h-full transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <ImageIcon className="h-12 w-12 mb-2" />
                          <span className="text-sm">No image available</span>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{section.section_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm line-clamp-3">{section.section_description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-2 border-t bg-gray-50">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleEditSection(section)
                          setSectionDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(section.section_id, "section", section.section_name)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Library Dialog */}
      <Dialog open={libraryDialogOpen} onOpenChange={setLibraryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedLibrary ? "Edit Library" : "Create New Library"}</DialogTitle>
            <DialogDescription>
              {selectedLibrary
                ? "Update the details of your existing library."
                : "Add a new library to organize your content."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLibrarySubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="library-name">
                Library Name
              </label>
              <Input
                id="library-name"
                value={libraryName}
                onChange={(e) => setLibraryName(e.target.value)}
                placeholder="Enter library name"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="library-description">
                Description
              </label>
              <Textarea
                id="library-description"
                value={libraryAbout}
                onChange={(e) => setLibraryAbout(e.target.value)}
                placeholder="Enter library description"
                required
                rows={4}
                className="w-full resize-none"
              />
            </div>
            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetLibraryForm()
                  setLibraryDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingLibrary}
                className={selectedLibrary ? "" : "bg-emerald-600 hover:bg-emerald-700"}
              >
                {submittingLibrary ? "Saving..." : selectedLibrary ? "Update Library" : "Create Library"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Section Dialog */}
      <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedSection ? "Edit Section" : "Create New Section"}</DialogTitle>
            <DialogDescription>
              {selectedSection
                ? "Update the details of your existing section."
                : `Add a new section to "${selectedLibrary?.library_name}".`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSectionSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="section-name">
                Section Name
              </label>
              <Input
                id="section-name"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                placeholder="Enter section name"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="section-description">
                Description
              </label>
              <Textarea
                id="section-description"
                value={sectionDesc}
                onChange={(e) => setSectionDesc(e.target.value)}
                placeholder="Enter section description"
                required
                rows={3}
                className="w-full resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Section Image
                <span className="text-gray-500 text-xs ml-2">(Optional)</span>
              </label>
              {sectionPreview ? (
                <div className="relative rounded-lg overflow-hidden border">
                  <img src={sectionPreview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-2 bg-white/90 hover:bg-white"
                    onClick={() => {
                      setSectionFile(null)
                      setSectionPreview("")
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                    <input type="file" className="hidden" accept="image/*" onChange={handleSectionFileChange} />
                  </label>
                </div>
              )}
            </div>
            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetSectionForm()
                  setSectionDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingSection}
                className={selectedSection ? "" : "bg-emerald-600 hover:bg-emerald-700"}
              >
                {submittingSection ? "Saving..." : selectedSection ? "Update Section" : "Create Section"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Delete {deleteType === "library" ? "Library" : "Section"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteItemName}"?
              {deleteType === "library" && " This action will also delete all sections within this library."}
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Deletete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminLibraries
