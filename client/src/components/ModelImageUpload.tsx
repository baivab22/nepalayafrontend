import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ModelImageUpload({ onUploaded }: { onUploaded?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("https://nepalaya-apis.onrender.com/api/model-image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      setSuccess(true);
      setFile(null);
      if (onUploaded) onUploaded();
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 border rounded-xl p-4 bg-slate-50">
      <label className="block font-medium mb-1">Upload Model Image</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file || uploading} className="mt-2">
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
      {success && <div className="text-green-600 text-xs mt-1">Image uploaded successfully!</div>}
    </div>
  );
}
