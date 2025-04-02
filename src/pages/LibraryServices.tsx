"use client"

import { useState, useEffect } from "react"
import { API_URL } from "../lib/config"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Header } from "../components/header"
import { cn } from "../lib/utils"
import { Footer } from "../components/footer"
interface Service {
  id: number
  service_name: string
  service_desc: string
  service_img: string | null
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/services.php?operation=getServices`)

        if (!response.ok) {
          throw new Error("Failed to fetch services")
        }

        const data = await response.json()

        if (data.status === "success") {
          setServices(data.data)
        } else {
          throw new Error(data.message || "Failed to load services")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleServiceClick = (service: Service) => {
    if (selectedService?.id === service.id) {
      // Toggle off if clicking the same service
      setSelectedService(null)
      setShowDetails(false)
    } else {
      // Select new service and show details
      setSelectedService(service)
      setShowDetails(true)

      // Scroll to details section after a short delay to allow rendering
      setTimeout(() => {
        const detailsSection = document.getElementById("service-details")
        if (detailsSection) {
          detailsSection.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }

  const closeDetails = () => {
    setShowDetails(false)
    setTimeout(() => {
      const servicesSection = document.getElementById("services-list")
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="container mx-auto p-8 text-center text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Header />

      <div className="mt-12">
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold mb-4">Our Services</h1>
          <p className="text-gray-600 max-w-2xl ">Click on a service to learn more about what we offer</p>
        </div>

        <div id="services-list" className="flex flex-wrap justify-start gap-3 md:gap-4 mb-12">
          {services.map((service) => (
            <Badge
              key={service.id}
              variant={selectedService?.id === service.id ? "default" : "outline"}
              className={cn(
                "px-2 py-1 text-base md:text-sm cursor-pointer transition-all duration-300 hover:scale-105",
                selectedService?.id === service.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-primary/10 hover:border-primary",
              )}
              onClick={() => handleServiceClick(service)}
            >
              {service.service_name}
              {selectedService?.id === service.id && <Info className="ml-2 h-4 w-4 inline" />}
            </Badge>
          ))}
        </div>

        {showDetails && selectedService && (
          <div
            id="service-details"
            className="max-w-4xl mx-auto mt-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
          >
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="bg-muted/50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl text-primary">{selectedService.service_name}</CardTitle>
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={closeDetails}
                  >
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">Close</span>
                  </Button> */}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {selectedService.service_img && (
                  <div className="mb-6 overflow-hidden rounded-lg">
                    <img
                      src={`data:image/jpeg;base64,${selectedService.service_img}`}
                      alt={selectedService.service_name}
                      className="w-full h-auto max-h-96 object-contain rounded-lg transition-transform hover:scale-[1.02] duration-300"
                    />
                  </div>
                )}
                <div className="prose max-w-none text-foreground" style={{ whiteSpace: "pre-line" }}>
                  {selectedService.service_desc}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!showDetails && services.length > 0 && (
          <div className="text-center text-muted-foreground mt-12 animate-in fade-in">
            <Info className="h-5 w-5 mx-auto mb-2" />
            <p>Select a service to view details</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default ServicesPage
