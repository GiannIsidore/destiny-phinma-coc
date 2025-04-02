"use client"

import { BASE_URL } from "../lib/config.ts"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Header } from "../components/header.tsx"
import { ChevronLeft, BookOpen, Layers, Info, ExternalLink } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Footer } from "../components/footer.tsx"

interface LibrarySection {
  section_id: string
  section_name: string
  section_description: string
  section_image: string | null
}

interface UnitLibraryResponse {
  library_id: string
  library_name: string
  library_description: string
  sections: LibrarySection[]
}

const UnitLibraries = () => {
  const { id } = useParams<{ id: string }>()
  const [libraryData, setLibraryData] = useState<UnitLibraryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("about")

  useEffect(() => {
    if (id) {
      fetchUnitLibrary()
    }
  }, [id])

  const fetchUnitLibrary = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${BASE_URL}api/unit_libraries.php?operation=getLibraryById&json={"id":${id}}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === "success" && data.data) {
        // Transform the data to match our interface
        const transformedData = {
          library_id: data.data.library_id,
          library_name: data.data.library_name,
          library_description: data.data.library_description,
          sections: data.data.sections || [],
        }
        setLibraryData(transformedData)
      } else {
        setError("Invalid data format received")
      }
    } catch (error) {
      console.error("Error fetching unit library:", error)
      setError("Failed to load unit library")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Smooth scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 mt-[10vh] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading library information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto mt-[10vh] p-4">
          <div className="max-w-3xl mx-auto">
            <Link to="/libraries" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Libraries
            </Link>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error Loading Library</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchUnitLibrary()}
                      className="text-red-700 hover:bg-red-100"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!libraryData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto mt-[10vh] p-4">
          <div className="max-w-3xl mx-auto">
            <Link to="/libraries" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Libraries
            </Link>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">No Library Found</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>The requested library could not be found. Please check the library ID and try again.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto mt-[10vh] px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/libraries" className="hover:text-gray-900">
            Libraries
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{libraryData.library_name}</span>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center mb-2">
                <BookOpen className="h-5 w-5 text-emerald-600 mr-2" />
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Library
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{libraryData.library_name}</h1>
              <p className="text-gray-500 max-w-2xl">
                {libraryData.library_description.substring(0, 150)}
                {libraryData.library_description.length > 150 ? "..." : ""}
              </p>
            </div>
            <Link to="/libraries">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex items-center">
            <div className="flex items-center text-gray-500 text-sm">
              <Layers className="h-4 w-4 mr-1" />
              <span>{libraryData.sections.length} Sections</span>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="about" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="bg-white rounded-lg shadow-sm p-1 mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="about"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                <Info className="h-4 w-4 mr-2" />
                About
              </TabsTrigger>
              <TabsTrigger
                value="sections"
                disabled={libraryData.sections.length === 0}
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                <Layers className="h-4 w-4 mr-2" />
                Sections ({libraryData.sections.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="about" className="mt-6 animate-in fade-in-50 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>About this Library</CardTitle>
                <CardDescription>Detailed information about the {libraryData.library_name} library</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none" style={{ whiteSpace: "pre-line" }}>
                  {libraryData.library_description}
                </div>
              </CardContent>
              {libraryData.sections.length > 0 && (
                <CardFooter className="border-t pt-6 flex justify-end">
                  <Button onClick={() => setActiveTab("sections")} className="bg-emerald-600 hover:bg-emerald-700">
                    View Sections
                    <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="sections" className="mt-6 animate-in fade-in-50 duration-300">
            {libraryData.sections.length > 0 ? (
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {libraryData.sections.map((section) => (
                    <Card
                      key={section.section_id}
                      className="overflow-hidden hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
                    >
                      {section.section_image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={`data:image/jpeg;base64,${section.section_image}`}
                            alt={section.section_name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader className={section.section_image ? "pt-4" : ""}>
                        <CardTitle className="text-xl">{section.section_name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-gray-600 line-clamp-3" style={{ whiteSpace: "pre-line" }}>
                          {section.section_description}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Explore
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Sections Available</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  There are currently no sections available for this library. Please check back later.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab("about")}>
                  Return to About
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
     <Footer/>
    </div>
  )
}

export default UnitLibraries
