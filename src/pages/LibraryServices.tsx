"use client";

import { useState, useEffect } from "react";
import { API_URL } from "../lib/config";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Header } from "../components/header";
import { cn } from "../lib/utils";
import { Footer } from "../components/footer";
import { Info, BookOpen, Users, Clock, MapPin, Search, Filter, Grid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface Service {
  id: number;
  service_name: string;
  service_desc: string;
  service_img: string | null;
  service_img_url: string | null;
  image_type: string | null;
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/services.php?operation=getServices`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();

        if (data.status === "success") {
          setServices(data.data);
          setFilteredServices(data.data);
        } else {
          throw new Error(data.message || "Failed to load services");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = services.filter(service =>
      service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.service_desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const handleServiceClick = (service: Service) => {
    if (selectedService?.id === service.id) {
      // Toggle off if clicking the same service
      setSelectedService(null);
      setShowDetails(false);
    } else {
      // Select new service and show details
      setSelectedService(service);
      setShowDetails(true);

      // Scroll to details section after a short delay to allow rendering
      setTimeout(() => {
        const detailsSection = document.getElementById("service-details");
        if (detailsSection) {
          detailsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const closeDetails = () => {
    setSelectedService(null);
    setShowDetails(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Library Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of library services designed to support your academic and research needs
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredServices.length} of {services.length} services
          </div>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center min-h-[300px]"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <div className="text-lg text-gray-600">Loading services...</div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-red-600 min-h-[300px] flex items-center justify-center"
          >
            <div className="bg-red-50 p-8 rounded-xl">
              <p className="text-lg font-semibold mb-2">Error loading services</p>
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {!loading && !error && filteredServices.length === 0 && searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 min-h-[300px] flex items-center justify-center"
          >
            <div className="bg-gray-50 p-8 rounded-xl">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold mb-2">No services found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          </motion.div>
        )}

        {!loading && !error && services.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 min-h-[300px] flex items-center justify-center"
          >
            <div className="bg-gray-50 p-8 rounded-xl">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold mb-2">No services available</p>
              <p className="text-sm">Please check back later</p>
            </div>
          </motion.div>
        )}

        {!loading && !error && filteredServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={cn(
              "mb-8",
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            )}
          >
            <AnimatePresence>
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-xl group",
                      selectedService?.id === service.id
                        ? "ring-2 ring-primary shadow-xl bg-blue-50"
                        : "hover:shadow-lg hover:-translate-y-1",
                      viewMode === "list" ? "flex flex-row" : ""
                    )}
                    onClick={() => handleServiceClick(service)}
                  >
                    {viewMode === "grid" ? (
                      <>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                              {service.service_name}
                            </CardTitle>
                            <Badge
                              variant="secondary"
                              className="ml-2 text-xs whitespace-nowrap"
                            >
                              Service
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {(service.service_img_url || service.service_img) && (
                            <div className="mb-3 overflow-hidden rounded-md">
                              <img
                                src={
                                  service.service_img_url ||
                                  `data:image/jpeg;base64,${service.service_img}`
                                }
                                alt={service.service_name}
                                className="w-full h-32 object-cover transition-transform group-hover:scale-105 duration-300"
                              />
                            </div>
                          )}
                          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                            {service.service_desc.length > 100
                              ? `${service.service_desc.substring(0, 100)}...`
                              : service.service_desc}
                          </p>
                          <div className="flex items-center text-xs text-primary font-medium group-hover:text-blue-700">
                            <Info className="h-3 w-3 mr-1" />
                            Click to view details
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      <>
                        {(service.service_img_url || service.service_img) && (
                          <div className="w-32 h-32 flex-shrink-0">
                            <img
                              src={
                                service.service_img_url ||
                                `data:image/jpeg;base64,${service.service_img}`
                              }
                              alt={service.service_name}
                              className="w-full h-full object-cover rounded-l-lg"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {service.service_name}
                            </CardTitle>
                            <Badge variant="secondary" className="text-xs">
                              Service
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {service.service_desc}
                          </p>
                          <div className="flex items-center text-xs text-primary font-medium mt-3 group-hover:text-blue-700">
                            <Info className="h-3 w-3 mr-1" />
                            Click to view details
                          </div>
                        </div>
                      </>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Service Details Section */}
        <AnimatePresence>
          {showDetails && selectedService && (
            <motion.div
              id="service-details"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="mt-12"
            >
              <Card className="bg-white shadow-2xl border-0">
                <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">
                      {selectedService.service_name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={closeDetails}
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {(selectedService.service_img_url ||
                    selectedService.service_img) && (
                    <div className="mb-6 overflow-hidden rounded-lg">
                      <img
                        src={
                          selectedService.service_img_url ||
                          `data:image/jpeg;base64,${selectedService.service_img}`
                        }
                        alt={selectedService.service_name}
                        className="w-full h-auto max-h-96 object-contain rounded-lg transition-transform hover:scale-[1.02] duration-300"
                      />
                    </div>
                  )}
                  <div
                    className="prose max-w-none text-gray-700 leading-relaxed"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {selectedService.service_desc}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!showDetails && filteredServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mt-12"
          >
            <Info className="h-5 w-5 mx-auto mb-2" />
            <p>Select a service to view detailed information</p>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ServicesPage;