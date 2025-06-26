"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { toast } from "react-toastify"
import { Loader2, Upload, X, Pencil, Plus } from "lucide-react"
import { cn } from "../lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { API_URL } from '../lib/config'
import { sessionManager } from '../utils/sessionManager'

interface ScholarForm {
  fname: string
  lname: string
  mname: string
  suffix: string
  course: string
  caption: string
  prevCaption: string
  month: string
  image: File | null
  imagePreview: string
}

interface ScholarData {
  id?: string
  img_id?: string
  fname: string
  lname: string
  mname: string
  suffix: string
  course: string
  caption: string
  month: string
  sa_image?: string
  hk_image?: string
}

interface ScholarProfile {
  id: string
  img_id?: string
  fname: string
  lname: string
  mname: string
  suffix: string
  course: string
  caption: string
  month: string
  imgurl: string
}

// Scholar Edit Dialog Component
function ScholarEditDialog({
  type,
  scholar,
  onSuccess
}: {
  type: "sa" | "hk"
  scholar: ScholarProfile | null
  onSuccess: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ScholarForm>({
    fname: scholar?.fname || "",
    lname: scholar?.lname || "",
    mname: scholar?.mname || "",
    suffix: scholar?.suffix || "",
    course: scholar?.course || "",
    caption: scholar?.caption || "",
    prevCaption: "",
    month: scholar?.month || new Date().toISOString().split('T')[0],
    image: null,
    imagePreview: scholar?.imgurl || "",
  })

  const focusedElementRef = useRef<string | null>(null)
  const selectionStartRef = useRef<number | null>(null)
  const selectionEndRef = useRef<number | null>(null)
  const isUpdatingRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset form when dialog opens with new scholar data
  useEffect(() => {
    if (open) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (scholar) {
        setForm({
          fname: scholar.fname,
          lname: scholar.lname,
          mname: scholar.mname,
          suffix: scholar.suffix,
          course: scholar.course,
          caption: scholar.caption,
          prevCaption: "",
          month: scholar.month,
          image: null,
          imagePreview: scholar.imgurl,
        })
      } else {
        setForm({
          fname: "",
          lname: "",
          mname: "",
          suffix: "",
          course: "",
          caption: "",
          prevCaption: "",
          month: new Date().toISOString().split('T')[0],
          image: null,
          imagePreview: "",
        })
      }
    }
  }, [open, scholar])

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement && e.target.id) {
        focusedElementRef.current = e.target.id

        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          selectionStartRef.current = e.target.selectionStart
          selectionEndRef.current = e.target.selectionEnd
        }
      }
    }

    document.addEventListener("focusin", handleFocusIn)
    return () => {
      document.removeEventListener("focusin", handleFocusIn)
    }
  }, [])

  // Run focus restoration after state updates
  useEffect(() => {
    if (isUpdatingRef.current && focusedElementRef.current) {
      const element = document.getElementById(focusedElementRef.current)
      if (element && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
        // Only restore if we're not already focused or if selection changed
        const isFocused = document.activeElement === element
        if (!isFocused) {
          element.focus()
        }

        if (selectionStartRef.current !== null && selectionEndRef.current !== null) {
          // We need to set this after the focus and state update has completed
          setTimeout(() => {
            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
              element.selectionStart = selectionStartRef.current!
              element.selectionEnd = selectionEndRef.current!
            }
          }, 0)
        }
      }
      isUpdatingRef.current = false
    }
  }, [form])

  const handleInputChange = (field: keyof ScholarForm, value: string) => {
    const element = document.activeElement

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      selectionStartRef.current = element.selectionStart
      selectionEndRef.current = element.selectionEnd
      focusedElementRef.current = element.id
    }

    isUpdatingRef.current = true

    // If changing caption, save previous value
    if (field === 'caption') {
      setForm(prev => ({
        ...prev,
        [field]: value,
        prevCaption: prev.caption
      }))
    } else {
      setForm(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed', e.target.files);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (form.imagePreview && form.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(form.imagePreview)
      }

      setForm({
        ...form,
        image: file,
        imagePreview: URL.createObjectURL(file),
      })
    }
  }

  const removeImage = () => {
    if (form.imagePreview && form.imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(form.imagePreview)
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setForm({
      ...form,
      image: null,
      imagePreview: "",
    })
  }

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create FormData instance
      const formData = new FormData()
      formData.append('operation', scholar ? `update${type.toUpperCase()}` : `add${type.toUpperCase()}`)

      const data: ScholarData = {
        fname: form.fname,
        lname: form.lname,
        mname: form.mname,
        suffix: form.suffix,
        course: form.course,
        caption: form.caption,
        month: form.month,
        ...(scholar && {
          id: scholar.id,
          img_id: scholar.img_id
        })
      }

      if (form.image) {
        const reader = new FileReader()
        reader.readAsDataURL(form.image)
        await new Promise((resolve, reject) => {
          reader.onload = () => {
            try {
              const base64Image = reader.result as string
              const base64Data = base64Image.split(',')[1]

              // Add the image data to the data object
              data[`${type}_image`] = base64Data

              // Stringify the entire data object
              formData.append('json', JSON.stringify(data))
              resolve(null)
            } catch (error) {
              reject(error)
            }
          }
          reader.onerror = () => reject(reader.error)
        })
      } else {
        formData.append('json', JSON.stringify(data))
      }

      // Make the request
      const response = await fetch(`${API_URL}/${type}.php`, {
        method: 'POST',
        body: formData
      })

      // Log the response for debugging
      const responseText = await response.text()
      console.log('Server response:', responseText)

      try {
        const result = JSON.parse(responseText)
        if (result.status === 'success') {
          toast.success(`${type.toUpperCase()} ${scholar ? 'updated' : 'added'} successfully`)
          setOpen(false)
          onSuccess()
        } else {
          throw new Error(result.message || 'Server error')
        }
      } catch (error) {
        console.error('Parse error:', error)
        throw new Error('Invalid server response')
      }

    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : `Error ${scholar ? 'updating' : 'adding'} scholar`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={scholar ? "outline" : "default"} size="sm">
          {scholar ? (
            <>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add New Scholar
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>
            {scholar ? `Edit ${type === "sa" ? "Student Assistant" : "Hawak Kamay"} Scholar` :
             `Add New ${type === "sa" ? "Student Assistant" : "Hawak Kamay"} Scholar`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />

          <div className="space-y-4">
            <Label>Profile Image</Label>
            {!form.imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Drag and drop an image, or click to browse
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleImageClick}
                  >
                    Select Image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative flex flex-col items-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20">
                  <img
                    src={form.imagePreview}
                    alt="Scholar preview"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/placeholder.png";
                    }}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button type="button" variant="outline" size="sm" onClick={removeImage}>
                    <X className="h-4 w-4 mr-2" />
                    Remove Image
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleImageClick}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Image
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor={`${type}-fname-dialog`}>First Name</Label>
              <Input
                id={`${type}-fname-dialog`}
                type="text"
                value={form.fname}
                onChange={(e) => handleInputChange('fname', e.target.value)}
                placeholder="Enter first name"
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${type}-lname-dialog`}>Last Name</Label>
              <Input
                id={`${type}-lname-dialog`}
                type="text"
                value={form.lname}
                onChange={(e) => handleInputChange('lname', e.target.value)}
                placeholder="Enter last name"
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${type}-mname-dialog`}>Middle Name</Label>
              <Input
                id={`${type}-mname-dialog`}
                type="text"
                value={form.mname}
                onChange={(e) => handleInputChange('mname', e.target.value)}
                placeholder="Enter middle name"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${type}-suffix-dialog`}>Suffix</Label>
              <Input
                id={`${type}-suffix-dialog`}
                type="text"
                value={form.suffix}
                onChange={(e) => handleInputChange('suffix', e.target.value)}
                placeholder="Enter suffix (e.g., Jr., Sr.)"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${type}-course-dialog`}>Course/Program</Label>
              <Input
                id={`${type}-course-dialog`}
                type="text"
                value={form.course}
                onChange={(e) => handleInputChange('course', e.target.value)}
                placeholder="Enter scholar's course or program"
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${type}-month-dialog`}>Month</Label>
              <Input
                id={`${type}-month-dialog`}
                type="date"
                value={form.month}
                onChange={(e) => handleInputChange('month', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${type}-caption-dialog`}>Caption/Description</Label>
            <Textarea
              id={`${type}-caption-dialog`}
              value={form.caption}
              onChange={(e) => handleInputChange('caption', e.target.value)}
              placeholder="Enter a brief description or quote from the scholar"
              required
              rows={4}
            />

            {/* {form.prevCaption && (
              <div className="mt-2">
                <Label htmlFor={`${type}-prev-caption-dialog`}>Previous Version</Label>
                <Textarea
                  id={`${type}-prev-caption-dialog`}
                  value={form.prevCaption}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  rows={4}
                />
              </div>
            )} */}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : scholar ? (
                "Update Scholar"
              ) : (
                "Add Scholar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Scholar Detail Card Component
function ScholarDetailCard({
  type,
  scholar,
  onRefresh
}: {
  type: "sa" | "hk"
  scholar: ScholarProfile | null
  onRefresh: () => void
}) {
  const scholarTitle = type === "sa" ? "Student Assistant" : "Hawak Kamay Scholar";

  return (
    <Card className="overflow-hidden relative shadow-lg bg-secondary">
      <CardHeader className="pb-0">
        <CardTitle className="flex justify-between items-center">
          <span>{scholarTitle}</span>
          <ScholarEditDialog type={type} scholar={scholar} onSuccess={onRefresh} />
        </CardTitle>
        <CardDescription>
          {scholar ? "View and edit scholar information" : "No scholar information found"}
        </CardDescription>
      </CardHeader>

      {scholar ? (
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 mx-auto md:mx-0">
              <img
                src={scholar.imgurl}
                alt={`${scholar.fname} ${scholar.lname}`}
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/placeholder.png";
                }}
              />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-medium">
                  {`${scholar.fname} ${scholar.mname ? scholar.mname + ' ' : ''}${scholar.lname} ${scholar.suffix || ''}`}
                </h3>
                <p className="text-muted-foreground">{scholar.course}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Month</Label>
                <p>{new Date(scholar.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Caption</Label>
                <p className="text-muted-foreground whitespace-pre-line">{scholar.caption}</p>
              </div>
            </div>
          </div>
        </CardContent>
      ) : (
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">No {scholarTitle.toLowerCase()} information added yet.</p>
          <ScholarEditDialog type={type} scholar={null} onSuccess={onRefresh} />
        </CardContent>
      )}
    </Card>
  )
}

export default function ScholarsAdmin() {
  const [loading, setLoading] = useState(false)
  const [scholars, setScholars] = useState<{
    sa: ScholarProfile | null
    hk: ScholarProfile | null
  }>({
    sa: null,
    hk: null,
  })

  const fetchScholars = async () => {
    setLoading(true)
    try {
      // Fetch SA data from PHP endpoint
      const saResponse = await fetch(`${API_URL}/sa.php?operation=getSA`)
      const saData = await saResponse.json()

      // Fetch HK data from PHP endpoint
      const hkResponse = await fetch(`${API_URL}/hk.php?operation=getHK`)
      const hkData = await hkResponse.json()

      setScholars({
        sa: saData.data ? {
          id: saData.data.id,
          fname: saData.data.fname,
          lname: saData.data.lname,
          mname: saData.data.mname,
          suffix: saData.data.suffix,
          course: saData.data.course,
          caption: saData.data.caption,
          month: saData.data.month,
          imgurl: `data:image/jpeg;base64,${saData.data.sa_image}`,
          img_id: saData.data.img_id
        } : null,
        hk: hkData.data ? {
          id: hkData.data.id,
          fname: hkData.data.fname,
          lname: hkData.data.lname,
          mname: hkData.data.mname,
          suffix: hkData.data.suffix,
          course: hkData.data.course,
          caption: hkData.data.caption,
          month: hkData.data.month,
          imgurl: `data:image/jpeg;base64,${hkData.data.hk_image}`,
          img_id: hkData.data.img_id
        } : null
      })
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load scholars data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScholars()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-5xl bg-secondary rounded-xl overflow-hidden relative shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Scholars</h1>
        <p className="text-muted-foreground mt-2">
          View, add or update scholar information for the Student Assistant and Hawak Kamay programs
        </p>
      </div>

      <Tabs defaultValue="sa" className="w-full">
        <TabsList className="mb-8 w-full md:w-auto">
          <TabsTrigger value="sa" className="flex-1 md:flex-none">
            Student Assistant
          </TabsTrigger>
          <TabsTrigger value="hk" className="flex-1 md:flex-none">
            Hawak Kamay Scholar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sa" className={cn(loading && "opacity-70 pointer-events-none")}>
          <ScholarDetailCard type="sa" scholar={scholars.sa} onRefresh={fetchScholars} />
        </TabsContent>

        <TabsContent value="hk" className={cn(loading && "opacity-70 pointer-events-none")}>
          <ScholarDetailCard type="hk" scholar={scholars.hk} onRefresh={fetchScholars} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
