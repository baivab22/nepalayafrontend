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

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const ADMIN_PASSWORD = sessionStorage.getItem("nepalaya_admin_auth") || "";

const adminHeaders = (): Record<string, string> => ({
  "x-admin-password": ADMIN_PASSWORD,
});

interface ModelImageData {
  id: string;
  imageUrl: string;
  uploadedAt?: string;
  filename?: string;
  size?: number;
}

export default function AdminModelImage() {
  const [images, setImages] = useState<ModelImageData[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ModelImageData | null>(null);
  const [viewTarget, setViewTarget] = useState<ModelImageData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  useEffect(() => {
    fetchModelImages();
  }, []);

  const fetchModelImages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/model-image`);
      const data = await response.json();
      const list: ModelImageData[] = (data.images || []).map((img: any) => ({
        id: img.id,
        imageUrl: img.url,
        uploadedAt: img.uploadedAt,
        filename: img.filename,
      }));
      setImages(list);
    } catch (error) {
      console.error("Error fetching model images:", error);
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
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
        headers: adminHeaders(),
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      await fetchModelImages();
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Model image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const response = await fetch(`${API_URL}/api/model-image/${deleteTarget.id}`, {
        method: "DELETE",
        headers: adminHeaders(),
      });
      if (!response.ok) throw new Error("Delete failed");
      await fetchModelImages();
      setDeleteTarget(null);
      toast.success("Model image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_URL}${url}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Model Image Management</h1>
              <p className="text-slate-500 mt-1">
                Upload and manage the model images displayed on the website
              </p>
            </div>
          </div>
        </motion.div>

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
                      <Button type="button" variant="ghost" size="sm" onClick={handleReset} className="h-7 w-7 p-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-white border border-slate-200">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
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
                    <Button type="button" variant="outline" onClick={handleReset} disabled={loading}>
                      Clear
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-slate-200 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Camera className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Model Images ({images.length})
                </h2>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-[4/3]"
                    >
                      <img
                        src={getImageUrl(img.imageUrl)}
                        alt={img.filename || "Model"}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setViewTarget(img)}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setViewTarget(img)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteTarget(img)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                      {img.uploadedAt && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-white text-xs truncate">
                            {new Date(img.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <ImageIcon className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-2">No Images Uploaded</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Upload model images to display on your website
                  </p>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose an Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
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
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            {deleteTarget && (
              <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3">
                <img
                  src={getImageUrl(deleteTarget.imageUrl)}
                  alt="Delete"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{deleteTarget.filename || "Model image"}</p>
                  {deleteTarget.uploadedAt && (
                    <p className="text-xs text-slate-500">{new Date(deleteTarget.uploadedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative bg-black/95">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setViewTarget(null)}
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="flex items-center justify-center min-h-[60vh] p-8">
              {viewTarget && (
                <img
                  src={getImageUrl(viewTarget.imageUrl)}
                  alt="Model Fullscreen"
                  className="max-w-full max-h-[80vh] object-contain"
                />
              )}
            </div>
            {viewTarget && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="text-white text-sm">
                  <p className="font-medium">{viewTarget.filename || "Model Image"}</p>
                  {viewTarget.uploadedAt && (
                    <p className="text-white/70 text-xs">
                      Uploaded: {new Date(viewTarget.uploadedAt).toLocaleString()}
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