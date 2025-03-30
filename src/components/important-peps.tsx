"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Award, BookOpen, HandHeart, X } from "lucide-react"

interface ScholarProfile {
  id: string
  fname: string
  lname: string
  mname: string
  suffix: string
  course: string
  month: string
  caption: string
  sa_image?: string
  hk_image?: string
}

const API_URL = "http://localhost/destiny-phinma-coc/api"

const ProfileLayoutV3 = () => {
  const [saData, setSaData] = useState<ScholarProfile | null>(null)
  const [hkData, setHkData] = useState<ScholarProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const saResponse = await fetch(`${API_URL}/sa.php?operation=getSA`)
        const saResult = await saResponse.json()

        if (saResult.status === "success" && saResult.data) {
          setSaData(saResult.data)
        }

        const hkResponse = await fetch(`${API_URL}/hk.php?operation=getHK`)
        const hkResult = await hkResponse.json()

        if (hkResult.status === "success" && hkResult.data) {
          setHkData(hkResult.data)
        }
      } catch (err) {
        setError("Failed to fetch scholar data")
        toast.error(`Failed to load scholar data,${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const currentDate = new Date()
  const month = currentDate.toLocaleString("default", { month: "long" })
  const year = currentDate.getFullYear()

  const getFullName = (data: ScholarProfile) => {
    const parts = [data.fname, data.mname, data.lname]
    if (data.suffix) parts.push(data.suffix)
    return parts.filter(Boolean).join(" ")
  }

  const openImageModal = (imageData: string) => {
    setSelectedImage(imageData)
    document.body.style.overflow = "hidden"
  }

  const closeImageModal = () => {
    setSelectedImage(null)
    document.body.style.overflow = ""
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <p className="text-red-500 text-2xl">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{
        backgroundImage: "url('https://coc.phinma.edu.ph/wp-content/uploads/2024/03/PHINMA-COC-MAIN.jpg')",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="min-h-[90vh] mx-auto bg-gray/60 p-12 rounded-3xl shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Scholar of the Month</h1>
          <p className="text-white/90 text-xl">
            {month} {year}
          </p>
        </div>

        <Tabs defaultValue="assistant" className="w-full">
          <TabsList className="flex justify-center gap-4 bg-white/90 mb-12 max-w-2xl mx-auto p-2 rounded-2xl">
            <TabsTrigger
              value="assistant"
              className="rounded-xl px-8 py-3 text-lg data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all duration-300"
            >
              Student Assistant
            </TabsTrigger>
            <TabsTrigger
              value="hawak"
              className="rounded-xl px-8 py-3 text-lg data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all duration-300"
            >
              Hawak Kamay Scholar
            </TabsTrigger>
          </TabsList>

          {/* Student Assistant Tab */}
          <TabsContent value="assistant" className="animate-in fade-in-50 duration-500">
            {saData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image */}
                <div className="flex justify-center p-4">
                  <div
                    className="relative group cursor-pointer transition-all duration-500"
                    onClick={() => saData.sa_image && openImageModal(saData.sa_image)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                      <span className="text-white text-lg font-medium flex items-center gap-2">
                        View Full Size
                      </span>
                    </div>
                    <img
                      src={saData.sa_image ? `data:image/jpeg;base64,${saData.sa_image}` : "/placeholder.svg"}
                      alt={getFullName(saData)}
                      className="w-96 h-96 object-cover rounded-[2rem] shadow-2xl ring-8 ring-white/20 transition-all duration-500 group-hover:scale-[0.98] group-hover:rotate-2"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center text-center md:text-left p-4">
                  <span className="inline-flex items-center justify-center md:justify-start text-white px-6 py-2 rounded-full text-lg font-semibold bg-white/20 backdrop-blur-sm mb-6 w-fit">
                    <Award className="w-6 h-6 mr-2" /> Student Assistant of the Month
                  </span>
                  <h2 className="text-5xl font-bold text-white mb-6 leading-tight">{getFullName(saData)}</h2>
                  <div className="flex items-center justify-center md:justify-start text-white/90 mb-8 text-xl">
                    <BookOpen className="w-7 h-7 mr-3 text-primary" />
                    <span className="bg-white/20 px-6 py-3 rounded-xl backdrop-blur-sm">{saData.course}</span>
                  </div>
                  <div className="text-white/90 text-lg overflow-y-auto max-h-[300px] leading-relaxed bg-white/20 p-8 rounded-2xl backdrop-blur-sm">
                    {saData.caption || "No description available"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm">
                <Award className="w-20 h-20 mx-auto text-primary mb-6" />
                <p className="text-white/90 text-2xl">No Student Assistant selected for {month}</p>
              </div>
            )}
          </TabsContent>

          {/* Hawak Kamay Scholar Tab */}
          <TabsContent value="hawak" className="animate-in fade-in-50 duration-500">
            {hkData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image */}
                <div className="flex justify-center p-4">
                  <div
                    className="relative group cursor-pointer transition-all duration-500"
                    onClick={() => hkData.hk_image && openImageModal(hkData.hk_image)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                      <span className="text-white text-lg font-medium flex items-center gap-2">
                        View Full Size
                      </span>
                    </div>
                    <img
                      src={hkData.hk_image ? `data:image/jpeg;base64,${hkData.hk_image}` : "/placeholder.svg"}
                      alt={getFullName(hkData)}
                      className="w-96 h-96 object-cover rounded-[2rem] shadow-2xl ring-8 ring-white/20 transition-all duration-500 group-hover:scale-[0.98] group-hover:rotate-2"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center text-center md:text-left p-4">
                  <span className="inline-flex items-center justify-center md:justify-start text-white px-6 py-2 rounded-full text-lg font-semibold bg-white/20 backdrop-blur-sm mb-6 w-fit">
                    <Award className="w-6 h-6 mr-2" /> Hawak Kamay Scholar of the Month
                  </span>
                  <h2 className="text-5xl font-bold text-white mb-6 leading-tight">{getFullName(hkData)}</h2>
                  <div className="flex items-center justify-center md:justify-start text-white/90 mb-8 text-xl">
                    <BookOpen className="w-7 h-7 mr-3 text-primary" />
                    <span className="bg-white/20 px-6 py-3 rounded-xl backdrop-blur-sm">{hkData.course}</span>
                  </div>
                  <div className="text-white/90 text-lg overflow-y-auto max-h-[300px] leading-relaxed bg-white/20 p-8 rounded-2xl backdrop-blur-sm">
                    {hkData.caption || "No description available"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm">
                <HandHeart className="w-20 h-20 mx-auto text-primary mb-6" />
                <p className="text-white/90 text-2xl">No Hawak Kamay Scholar selected for {month}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-8 animate-in fade-in-0 duration-300"
          onClick={closeImageModal}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
              onClick={closeImageModal}
            >
              <X className="w-8 h-8" />
              <span className="sr-only">Close</span>
            </button>
            <img
              src={`data:image/jpeg;base64,${selectedImage}`}
              alt="Enlarged profile"
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileLayoutV3
