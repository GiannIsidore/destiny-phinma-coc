"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Trash2, Upload, Edit } from "lucide-react";
import { toast } from "react-toastify";
import { API_URL } from "../lib/config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { sessionManager } from "../utils/sessionManager";

interface Service {
  id: number;
  service_name: string;
  service_desc: string;
  service_img: string | null;
  service_img_url: string | null;
  image_type: string | null;
}

const AdminServicesPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Form states
  const [serviceName, setServiceName] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceFile, setServiceFile] = useState<File | null>(null);
  const [servicePreview, setServicePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/services.php?operation=getServices`,
      );
      const data = await response.json();

      if (data.status === "success") {
        setServices(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch services");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch services",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      sessionManager.isAuthenticated() &&
      sessionManager.getRole() === "admin"
    ) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to manage services");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "operation",
        selectedService ? "updateService" : "addService",
      );

      // Convert image to base64 if new file was selected
      let base64Image = selectedService?.service_img || null;
      if (serviceFile) {
        // Check file size and compress if needed
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (serviceFile.size > maxSize) {
          toast.error(
            "Image file is too large. Please choose a smaller image.",
          );
          setSubmitting(false);
          return;
        }

        try {
          // Use aggressive compression to avoid packet size issues
          base64Image = await compressImage(serviceFile, 600, 400, 0.5);
        } catch (error) {
          console.warn("Compression failed, using original:", error);
          base64Image = await fileToBase64(serviceFile);
        }
      }

      formData.append(
        "json",
        JSON.stringify({
          ...(selectedService && { id: selectedService.id }),
          service_name: serviceName,
          service_desc: serviceDesc,
          service_img: base64Image,
        }),
      );

      const response = await fetch(`${API_URL}/services.php`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success(
          selectedService
            ? "Service updated successfully!"
            : "Service added successfully!",
        );
        resetForm();
        fetchServices();
      } else {
        throw new Error(result.message || "Server error");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Error managing service",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const compressImage = (
    file: File,
    maxWidth = 800,
    maxHeight = 600,
    quality = 0.8,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => {
                const base64String = (reader.result as string).split(",")[1];
                resolve(base64String);
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          "image/jpeg",
          quality,
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      const response = await fetch(`${API_URL}/services.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          operation: "deleteService",
          json: JSON.stringify({ id }),
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Service deleted successfully");
        fetchServices();
        if (selectedService?.id === id) {
          setSelectedService(null);
        }
      } else {
        throw new Error(result.message || "Server error");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setServiceFile(file);
      setServicePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setServiceName("");
    setServiceDesc("");
    setServiceFile(null);
    setServicePreview("");
    setSelectedService(null);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setServiceName(service.service_name);
    setServiceDesc(service.service_desc);

    // Handle different image storage types
    if (service.service_img_url) {
      // File-based storage
      setServicePreview(service.service_img_url);
    } else if (service.service_img) {
      // Base64 storage
      setServicePreview(`data:image/jpeg;base64,${service.service_img}`);
    } else {
      setServicePreview("");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Add New Service</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Service Name
                </label>
                <Input
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Enter service name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Enter service description"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Service Image
                </label>
                <div className="mt-2">
                  {servicePreview ? (
                    <div className="relative">
                      <img
                        src={servicePreview}
                        alt="Preview"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setServiceFile(null);
                          setServicePreview("");
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB (auto-compressed)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : selectedService
                      ? "Update Service"
                      : "Add Service"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Services</h2>
        {loading ? (
          <div className="text-center">Loading services...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="relative h-48 mb-4">
                  {service.service_img_url || service.service_img ? (
                    <img
                      src={
                        service.service_img_url ||
                        `data:image/jpeg;base64,${service.service_img}`
                      }
                      alt={service.service_name}
                      className="object-cover w-full h-full rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  {service.service_name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {service.service_desc}
                </p>
                <div className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServicesPage;
