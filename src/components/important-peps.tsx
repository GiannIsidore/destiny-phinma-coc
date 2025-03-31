"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Award, BookOpen, HandHeart, X } from "lucide-react"
import { API_URL } from '../lib/config'

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

const ProfileLayoutV3 = () => {
  const [saData, setSaData] = useState<ScholarProfile | null>(null)
  const [hkData, setHkData] = useState<ScholarProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const fetchScholars = async () => {
    try {
      setLoading(true)
      const [saResponse, hkResponse] = await Promise.all([
        fetch(`${API_URL}/sa.php?operation=getSA`),
        fetch(`${API_URL}/hk.php?operation=getHK`)
      ])

      const saData = await saResponse.json()
      const hkData = await hkResponse.json()

      if (saData.status === 'success' && hkData.status === 'success') {
        setSaData(saData.data)
        setHkData(hkData.data)
      }
    } catch (error) {
      console.error('Error fetching scholars:', error)
      setError("Failed to fetch scholar data")
      toast.error(`Failed to load scholar data,${error}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScholars()
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
          className="min-h-screen py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6"
          style={{
            backgroundImage: "url('https://coc.phinma.edu.ph/wp-content/uploads/2024/03/PHINMA-COC-MAIN.jpg')",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
      >
        <div className="min-h-[90vh] mx-auto bg-gray/60 p-4 sm:p-6 md:p-8 lg:p-12 rounded-3xl shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4 tracking-tight">
              Scholar of the Month
            </h1>
            <p className="text-white/90 text-lg sm:text-xl">
              {month} {year}
            </p>
          </div>

          <Tabs defaultValue="assistant" className="w-full">
            <TabsList className="flex justify-center gap-2 sm:gap-4 bg-white/90 mb-6 sm:mb-8 md:mb-12 max-w-xs sm:max-w-md md:max-w-2xl mx-auto p-1 sm:p-2 rounded-xl sm:rounded-2xl">
              <TabsTrigger
                  value="assistant"
                  className="rounded-lg sm:rounded-xl px-3 sm:px-5 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all duration-300"
              >
                Student Assistant
              </TabsTrigger>
              <TabsTrigger
                  value="hawak"
                  className="rounded-lg sm:rounded-xl px-3 sm:px-5 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all duration-300"
              >
                Hawak Kamay Scholar
              </TabsTrigger>
            </TabsList>

            {/* Student Assistant Tab */}
            <TabsContent value="assistant" className="animate-in fade-in-50 duration-500">
              {saData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                    {/* Image */}
                    <div className="flex justify-center p-2 sm:p-4">
                      <div
                          className="relative group cursor-pointer transition-all duration-500"
                          onClick={() => saData.sa_image && openImageModal(saData.sa_image)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent rounded-2xl sm:rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4 sm:pb-8">
                      <span className="text-white text-sm sm:text-base md:text-lg font-medium flex items-center gap-2">
                        View Full Size
                      </span>
                        </div>
                        <img
                            src={saData.sa_image ? `data:image/jpeg;base64,${saData.sa_image}` : "/placeholder.svg"}
                            alt={getFullName(saData)}
                            className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-auto aspect-square object-cover rounded-2xl sm:rounded-[2rem] shadow-2xl ring-4 sm:ring-8 ring-white/20 transition-all duration-500 group-hover:scale-[0.98] group-hover:rotate-2"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center text-center md:text-left p-2 sm:p-4">
                  <span className="inline-flex items-center justify-center md:justify-start text-white px-3 sm:px-4 md:px-6 py-1 sm:py-2 rounded-full text-sm sm:text-base md:text-lg font-semibold bg-white/20 backdrop-blur-sm mb-3 sm:mb-4 md:mb-6 mx-auto md:mx-0 w-fit">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2" /> Student Assistant of the Month
                  </span>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
                        {getFullName(saData)}
                      </h2>
                      <div className="flex items-center justify-center md:justify-start text-white/90 mb-4 sm:mb-6 md:mb-8 text-base sm:text-lg md:text-xl">
                        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-2 sm:mr-3 text-primary" />
                        <span className="bg-white/20 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl backdrop-blur-sm">
                      {saData.course}
                    </span>
                      </div>
                      <div className="text-white/90 text-sm sm:text-base md:text-lg overflow-y-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px] leading-relaxed bg-white/20 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                        {saData.caption || "No description available"}
                      </div>
                    </div>
                  </div>
              ) : (
                  <div className="text-center p-6 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm">
                    <Award className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto text-primary mb-4 sm:mb-6" />
                    <p className="text-white/90 text-lg sm:text-xl md:text-2xl">
                      No Student Assistant selected for {month}
                    </p>
                  </div>
              )}
            </TabsContent>

            {/* Hawak Kamay Scholar Tab */}
            <TabsContent value="hawak" className="animate-in fade-in-50 duration-500">
              {hkData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                    {/* Image */}
                    <div className="flex justify-center p-2 sm:p-4">
                      <div
                          className="relative group cursor-pointer transition-all duration-500"
                          onClick={() => hkData.hk_image && openImageModal(hkData.hk_image)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent rounded-2xl sm:rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4 sm:pb-8">
                      <span className="text-white text-sm sm:text-base md:text-lg font-medium flex items-center gap-2">
                        View Full Size
                      </span>
                        </div>
                        <img
                            src={hkData.hk_image ? `data:image/jpeg;base64,${hkData.hk_image}` : "/placeholder.svg"}
                            alt={getFullName(hkData)}
                            className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-auto aspect-square object-cover rounded-2xl sm:rounded-[2rem] shadow-2xl ring-4 sm:ring-8 ring-white/20 transition-all duration-500 group-hover:scale-[0.98] group-hover:rotate-2"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center text-center md:text-left p-2 sm:p-4">
                  <span className="inline-flex items-center justify-center md:justify-start text-white px-3 sm:px-4 md:px-6 py-1 sm:py-2 rounded-full text-sm sm:text-base md:text-lg font-semibold bg-white/20 backdrop-blur-sm mb-3 sm:mb-4 md:mb-6 mx-auto md:mx-0 w-fit">
                    <HandHeart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2" /> Hawak Kamay Scholar of the Month
                  </span>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
                        {getFullName(hkData)}
                      </h2>
                      <div className="flex items-center justify-center md:justify-start text-white/90 mb-4 sm:mb-6 md:mb-8 text-base sm:text-lg md:text-xl">
                        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-2 sm:mr-3 text-primary" />
                        <span className="bg-white/20 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl backdrop-blur-sm">
                      {hkData.course}
                    </span>
                      </div>
                      <div className="text-white/90 text-sm sm:text-base md:text-lg overflow-y-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px] leading-relaxed bg-white/20 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                        {hkData.caption || "No description available"}
                      </div>
                    </div>
                  </div>
              ) : (
                  <div className="text-center p-6 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm">
                    <HandHeart className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto text-primary mb-4 sm:mb-6" />
                    <p className="text-white/90 text-lg sm:text-xl md:text-2xl">
                      No Hawak Kamay Scholar selected for {month}
                    </p>
                  </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Image Modal */}
        {selectedImage && (
            <div
                className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8 animate-in fade-in-0 duration-300"
                onClick={closeImageModal}
            >
              <div
                  className="relative max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl w-full max-h-[90vh] animate-in zoom-in-95 duration-500"
                  onClick={(e) => e.stopPropagation()}
              >
                <button
                    className="absolute -top-8 sm:-top-10 md:-top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
                    onClick={closeImageModal}
                >
                  <X className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  <span className="sr-only">Close</span>
                </button>
                <img
                    src={`data:image/jpeg;base64,${selectedImage}`}
                    alt="Enlarged profile"
                    className="w-full h-auto max-h-[80vh] sm:max-h-[85vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
                />
              </div>
            </div>
        )}
      </div>
  )
}

export default ProfileLayoutV3
