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
import { Loader2, Upload, X } from "lucide-react"
import { cn } from "../lib/utils"

interface ScholarForm {
  fname: string
  lname: string
  mname: string
  suffix: string
  course: string
  caption: string
  month: string
  image: File | null
  imagePreview: string
}

export default function ScholarsAdmin() {
  const [loading, setLoading] = useState(false)
  const [saForm, setSaForm] = useState<ScholarForm>({
    fname: "",
    lname: "",
    mname: "",
    suffix: "",
    course: "",
    caption: "",
    month: new Date().toISOString().split('T')[0],
    image: null,
    imagePreview: "",
  })
  const [hkForm, setHkForm] = useState<ScholarForm>({
    fname: "",
    lname: "",
    mname: "",
    suffix: "",
    course: "",
    caption: "",
    month: new Date().toISOString().split('T')[0],
    image: null,
    imagePreview: "",
  })
  const [existingData, setExistingData] = useState<{
    sa: { id: string; fname: string; lname: string; mname: string; suffix: string; course: string; caption: string; month: string; imgurl: string } | null
    hk: { id: string; fname: string; lname: string; mname: string; suffix: string; course: string; caption: string; month: string; imgurl: string } | null
  }>({
    sa: null,
    hk: null,
  })

  const focusedElementRef = useRef<string | null>(null)
  const selectionStartRef = useRef<number | null>(null)
  const selectionEndRef = useRef<number | null>(null)

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

  useEffect(() => {
    if (focusedElementRef.current) {
      const element = document.getElementById(focusedElementRef.current)
      if (element && document.activeElement !== element) {
        element.focus()

        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          if (selectionStartRef.current !== null && selectionEndRef.current !== null) {
            element.selectionStart = selectionStartRef.current
            element.selectionEnd = selectionEndRef.current
          }
        }
      }
    }
  }, [saForm, hkForm])

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        // Fetch SA data from PHP endpoint
        const saResponse = await fetch('/api/sa.php?operation=getSA')
        const saData = await saResponse.json()

        // Fetch HK data from PHP endpoint
        const hkResponse = await fetch('/api/hk.php?operation=getHK')
        const hkData = await hkResponse.json()

        setExistingData({
          sa: saData.data ? {
            id: saData.data.id,
            fname: saData.data.fname,
            lname: saData.data.lname,
            mname: saData.data.mname,
            suffix: saData.data.suffix,
            course: saData.data.course,
            caption: saData.data.caption,
            month: saData.data.month,
            imgurl: `data:image/jpeg;base64,${saData.data.sa_image}`
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
            imgurl: `data:image/jpeg;base64,${hkData.data.hk_image}`
          } : null
        })

        if (saData.data) {
          setSaForm(prev => ({
            ...prev,
            fname: saData.data.fname,
            lname: saData.data.lname,
            mname: saData.data.mname,
            suffix: saData.data.suffix,
            course: saData.data.course,
            caption: saData.data.caption,
            month: saData.data.month,
            imagePreview: `data:image/jpeg;base64,${saData.data.sa_image}`
          }))
        }

        if (hkData.data) {
          setHkForm(prev => ({
            ...prev,
            fname: hkData.data.fname,
            lname: hkData.data.lname,
            mname: hkData.data.mname,
            suffix: hkData.data.suffix,
            course: hkData.data.course,
            caption: hkData.data.caption,
            month: hkData.data.month,
            imagePreview: `data:image/jpeg;base64,${hkData.data.hk_image}`
          }))
        }

      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchExistingData()
  }, [])

  const handleImageChange = (type: "sa" | "hk", e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const setForm = type === "sa" ? setSaForm : setHkForm
      const form = type === "sa" ? saForm : hkForm

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

  const removeImage = (type: "sa" | "hk") => {
    const form = type === "sa" ? saForm : hkForm
    const setForm = type === "sa" ? setSaForm : setHkForm

    if (form.imagePreview && form.imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(form.imagePreview)
    }

    setForm({
      ...form,
      image: null,
      imagePreview: "",
    })
  }

  const resetForm = (type: "sa" | "hk") => {
    const form = type === "sa" ? saForm : hkForm
    const setForm = type === "sa" ? setSaForm : setHkForm

    if (form.imagePreview) {
      URL.revokeObjectURL(form.imagePreview)
    }

    setForm({
      fname: "",
      lname: "",
      mname: "",
      suffix: "",
      course: "",
      caption: "",
      month: new Date().toISOString().split('T')[0],
      image: null,
      imagePreview: "",
    })
  }

  const handleSubmit = async (type: "sa" | "hk", e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const form = type === "sa" ? saForm : hkForm
      const existing = type === "sa" ? existingData.sa : existingData.hk

      const formData = new FormData()
      formData.append('operation', existing ? `update${type.toUpperCase()}` : `add${type.toUpperCase()}`)

      // Create the data object without the image
      interface ScholarData {
        fname: string
        lname: string
        mname: string
        suffix: string
        course: string
        caption: string
        month: string
        id?: string
        img_id?: string
        sa_image?: string
        hk_image?: string
      }

      const data: ScholarData = {
        fname: form.fname,
        lname: form.lname,
        mname: form.mname,
        suffix: form.suffix,
        course: form.course,
        caption: form.caption,
        month: form.month,
        ...(existing && { id: existing.id, img_id: existing.id })
      }

      // If there's a new image, convert it to base64
      if (form.image) {
        const reader = new FileReader()
        reader.readAsDataURL(form.image)
        reader.onload = async () => {
          const base64Image = reader.result as string
          // Remove the data URL prefix
          const base64Data = base64Image.split(',')[1]
          data[`${type}_image`] = base64Data

          // Append the data as JSON
          formData.append('json', JSON.stringify(data))

          // Submit to PHP endpoint
          const response = await fetch(`/api/${type}.php`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json'
            },
            body: formData
          })

          const text = await response.text()
          console.log('Response:', text)

          try {
            const result = JSON.parse(text)
            if (result.status !== 'success') {
              throw new Error(result.message || 'Failed to update scholar')
            }

            toast.success(`${type === "sa" ? "Student Assistant" : "Hawak Kamay"} Scholar ${existing ? "updated" : "added"} successfully!`)

            // Refresh data
            const newDataResponse = await fetch(`/api/${type}.php?operation=get${type.toUpperCase()}`)
            const newData = await newDataResponse.json()

            if (newData.data) {
              setExistingData(prev => ({
                ...prev,
                [type]: {
                  id: newData.data.id,
                  fname: newData.data.fname,
                  lname: newData.data.lname,
                  mname: newData.data.mname,
                  suffix: newData.data.suffix,
                  course: newData.data.course,
                  caption: newData.data.caption,
                  month: newData.data.month,
                  imgurl: `data:image/jpeg;base64,${newData.data[`${type}_image`]}`
                }
              }))

              if (type === "sa") {
                setSaForm(prev => ({
                  ...prev,
                  fname: newData.data.fname,
                  lname: newData.data.lname,
                  mname: newData.data.mname,
                  suffix: newData.data.suffix,
                  course: newData.data.course,
                  caption: newData.data.caption,
                  month: newData.data.month,
                  imagePreview: `data:image/jpeg;base64,${newData.data.sa_image}`,
                  image: null
                }))
              } else {
                setHkForm(prev => ({
                  ...prev,
                  fname: newData.data.fname,
                  lname: newData.data.lname,
                  mname: newData.data.mname,
                  suffix: newData.data.suffix,
                  course: newData.data.course,
                  caption: newData.data.caption,
                  month: newData.data.month,
                  imagePreview: `data:image/jpeg;base64,${newData.data.hk_image}`,
                  image: null
                }))
              }
            }
          } catch {
            console.error('Error parsing JSON:', text)
            throw new Error('Invalid response from server')
          }
        }
      } else {
        // If no new image, just send the data
        formData.append('json', JSON.stringify(data))

        // Submit to PHP endpoint
        const response = await fetch(`/api/${type}.php`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        })

        const text = await response.text()
        console.log('Response:', text)

        try {
          const result = JSON.parse(text)
          if (result.status !== 'success') {
            throw new Error(result.message || 'Failed to update scholar')
          }

          toast.success(`${type === "sa" ? "Student Assistant" : "Hawak Kamay"} Scholar ${existing ? "updated" : "added"} successfully!`)

          // Refresh data
          const newDataResponse = await fetch(`/api/${type}.php?operation=get${type.toUpperCase()}`)
          const newData = await newDataResponse.json()

          if (newData.data) {
            setExistingData(prev => ({
              ...prev,
              [type]: {
                id: newData.data.id,
                fname: newData.data.fname,
                lname: newData.data.lname,
                mname: newData.data.mname,
                suffix: newData.data.suffix,
                course: newData.data.course,
                caption: newData.data.caption,
                month: newData.data.month,
                imgurl: `data:image/jpeg;base64,${newData.data[`${type}_image`]}`
              }
            }))

            if (type === "sa") {
              setSaForm(prev => ({
                ...prev,
                fname: newData.data.fname,
                lname: newData.data.lname,
                mname: newData.data.mname,
                suffix: newData.data.suffix,
                course: newData.data.course,
                caption: newData.data.caption,
                month: newData.data.month,
                imagePreview: `data:image/jpeg;base64,${newData.data.sa_image}`,
                image: null
              }))
            } else {
              setHkForm(prev => ({
                ...prev,
                fname: newData.data.fname,
                lname: newData.data.lname,
                mname: newData.data.mname,
                suffix: newData.data.suffix,
                course: newData.data.course,
                caption: newData.data.caption,
                month: newData.data.month,
                imagePreview: `data:image/jpeg;base64,${newData.data.hk_image}`,
                image: null
              }))
            }
          }
        } catch {
          console.error('Error parsing JSON:', text)
          throw new Error('Invalid response from server')
        }
      }

    } catch (error) {
      console.error("Error updating scholar:", error)
      toast.error(error instanceof Error ? error.message : 'Failed to update scholar')
    } finally {
      setLoading(false)
    }
  }

  const ScholarForm = ({
    type,
    form,
    setForm,
  }: {
    type: "sa" | "hk"
    form: ScholarForm
    setForm: React.Dispatch<React.SetStateAction<ScholarForm>>
  }) => {
    const existing = type === "sa" ? existingData.sa : existingData.hk
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <Card className="rounded-xl overflow-hidden relative shadow-lg bg-secondary">
        <CardHeader>
          <CardTitle>{type === "sa" ? "Student Assistant" : "Hawak Kamay"} Scholar Details</CardTitle>
          <CardDescription>
            {existing ? "Edit the current scholar information" : "Add new scholar information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(type, e)}
            className="hidden"
          />
          <form onSubmit={(e) => handleSubmit(type, e)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`${type}-fname`}>First Name</Label>
                <Input
                  id={`${type}-fname`}
                  type="text"
                  value={form.fname}
                  onChange={(e) => {
                    const value = e.target.value
                    setForm((prev) => ({ ...prev, fname: value }))
                  }}
                  placeholder="Enter first name"
                  required
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${type}-lname`}>Last Name</Label>
                <Input
                  id={`${type}-lname`}
                  type="text"
                  value={form.lname}
                  onChange={(e) => {
                    const value = e.target.value
                    setForm((prev) => ({ ...prev, lname: value }))
                  }}
                  placeholder="Enter last name"
                  required
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${type}-mname`}>Middle Name</Label>
                <Input
                  id={`${type}-mname`}
                  type="text"
                  value={form.mname}
                  onChange={(e) => {
                    const value = e.target.value
                    setForm((prev) => ({ ...prev, mname: value }))
                  }}
                  placeholder="Enter middle name"
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${type}-suffix`}>Suffix</Label>
                <Input
                  id={`${type}-suffix`}
                  type="text"
                  value={form.suffix}
                  onChange={(e) => {
                    const value = e.target.value
                    setForm((prev) => ({ ...prev, suffix: value }))
                  }}
                  placeholder="Enter suffix (e.g., Jr., Sr.)"
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${type}-course`}>Course/Program</Label>
                <Input
                  id={`${type}-course`}
                  type="text"
                  value={form.course}
                  onChange={(e) => {
                    const value = e.target.value
                    setForm((prev) => ({ ...prev, course: value }))
                  }}
                  placeholder="Enter scholar's course or program"
                  required
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${type}-month`}>Month</Label>
                <Input
                  id={`${type}-month`}
                  type="date"
                  value={form.month}
                  onChange={(e) => {
                    const value = e.target.value
                    setForm((prev) => ({ ...prev, month: value }))
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${type}-caption`}>Caption/Description</Label>
              <Textarea
                id={`${type}-caption`}
                value={form.caption}
                onChange={(e) => {
                  const value = e.target.value
                  setForm((prev) => ({ ...prev, caption: value }))
                }}
                placeholder="Enter a brief description or quote from the scholar"
                required
                rows={4}
              />
            </div>

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
                      src={form.imagePreview || "/placeholder.svg"}
                      alt="Scholar preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button type="button" variant="outline" size="sm" onClick={() => removeImage(type)}>
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

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => resetForm(type)}
                disabled={loading}
              >
                Reset Form
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : existing ? (
                  "Update Scholar"
                ) : (
                  "Add Scholar"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-5xl bg-secondary rounded-xl overflow-hidden relative shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Scholars</h1>
        <p className="text-muted-foreground mt-2">
          Add or update scholar information for the Student Assistant and Hawak Kamay programs
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
          <ScholarForm type="sa" form={saForm} setForm={setSaForm} />
        </TabsContent>

        <TabsContent value="hk" className={cn(loading && "opacity-70 pointer-events-none")}>
          <ScholarForm type="hk" form={hkForm} setForm={setHkForm} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
