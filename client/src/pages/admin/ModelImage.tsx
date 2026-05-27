import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Eye, 
  CheckCircle,
  AlertCircle,
  X,
  Camera,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface ModelImageData {
  imageUrl: string;
  uploadedAt?: string;
  filename?: string;
  size?: number;
}

export default function AdminModelImage() {
  const [image, setImage] = useState<string>("");
  const [imageData, setImageData] = useState<ModelImageData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [viewFullscreen, setViewFullscreen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  useEffect(() => {
    fetchModelImage();
  }, []);

  const fetchModelImage = async () => {
    try {
      const response = await fetch(`${API_URL}/api/model-image`);
      const data = await response.json();
      if (data.imageUrl) {
        setImage(data.imageUrl);
        setImageData({
          imageUrl: data.imageUrl,
          uploadedAt: data.uploadedAt,
          filename: data.filename,
          size: data.size
        });
      }
    } catch (error) {
      console.error("Error fetching model image:", error);
    }
  };

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)");
      return false;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const response = await fetch(`${API_URL}/api/model-image`, {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) throw new Error("Upload failed");
      
      const data = await response.json();
      setImage(data.imageUrl);
      setImageData({
        imageUrl: data.imageUrl,
        uploadedAt: data.uploadedAt,
        filename: file.name,
        size: file.size
      });
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Model image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/model-image`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Delete failed");
      
      setImage("");
      setImageData(null);
      setFile(null);
      setPreviewUrl(null);
      setConfirmDelete(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Model image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `${API_URL}${url}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Model Image Management</h1>
              <p className="text-slate-500 mt-1">Upload and manage the main model image displayed on the website</p>
            </div>
          </div>
        </motion.div>

        {/* Upload Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <Label htmlFor="image" className="text-sm font-semibold mb-2 block">
                    Upload New Model Image
                  </Label>
                  <div className="relative">
                    <Input
                      id="image"
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                    />
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                      <AlertCircle className="w-3 h-3" />
                      <span>Supported formats: JPEG, PNG, WebP (Max 5MB)</span>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                {previewUrl && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-slate-700">Preview</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-7 w-7 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-white border border-slate-200">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{file?.name}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Size: {file && formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    disabled={loading || !file}
                    className="bg-gradient-to-r from-primary to-sky-500 hover:from-primary/90 hover:to-sky-500/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </Button>
                  
                  {previewUrl && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleReset}
                      disabled={loading}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Image Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-slate-200 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-slate-900">Current Model Image</h2>
                </div>
                
                {image && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewFullscreen(true)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Fullscreen
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setConfirmDelete(true)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              {image ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img 
                        src={getImageUrl(image)} 
                        alt="Model" 
                        className="w-full max-h-[500px] object-contain cursor-pointer"
                        onClick={() => setViewFullscreen(true)}
                      />
                    </div>
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => setViewFullscreen(true)}
                        className="gap-2"
                      >
                        <Eye className="w-5 h-5" />
                        View Fullscreen
                      </Button>
                    </div>
                  </div>

                  {/* Image Metadata */}
                  {imageData && (
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {imageData.filename && (
                          <div>
                            <p className="text-slate-500">Filename</p>
                            <p className="font-medium text-slate-700">{imageData.filename}</p>
                          </div>
                        )}
                        {imageData.size && (
                          <div>
                            <p className="text-slate-500">File Size</p>
                            <p className="font-medium text-slate-700">{formatFileSize(imageData.size)}</p>
                          </div>
                        )}
                        {imageData.uploadedAt && (
                          <div className="col-span-2">
                            <p className="text-slate-500">Uploaded</p>
                            <p className="font-medium text-slate-700">
                              {new Date(imageData.uploadedAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <ImageIcon className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-2">No Image Uploaded</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Upload a model image to display on your website
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose an Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Delete Model Image</h2>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-slate-600">
              Are you sure you want to delete the current model image? This action cannot be undone.
            </p>
            
            {image && (
              <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3">
                <img 
                  src={getImageUrl(image)} 
                  alt="Current" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Current Image</p>
                  <p className="text-xs text-slate-500">
                    {imageData?.filename || "Model image"}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fullscreen View Dialog */}
      <Dialog open={viewFullscreen} onOpenChange={setViewFullscreen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative bg-black/95">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setViewFullscreen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center justify-center min-h-[60vh] p-8">
              {image && (
                <img 
                  src={getImageUrl(image)} 
                  alt="Model Fullscreen" 
                  className="max-w-full max-h-[80vh] object-contain"
                />
              )}
            </div>
            
            {imageData && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="text-white text-sm">
                  <p className="font-medium">{imageData.filename || "Model Image"}</p>
                  {imageData.uploadedAt && (
                    <p className="text-white/70 text-xs">
                      Uploaded: {new Date(imageData.uploadedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}