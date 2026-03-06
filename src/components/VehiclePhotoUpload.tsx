import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PhotoItem {
  url: string;
  name: string;
}

interface VehiclePhotoUploadProps {
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
  mainPhotoIndex: number;
  onMainPhotoChange: (index: number) => void;
}

export default function VehiclePhotoUpload({
  photos,
  onPhotosChange,
  mainPhotoIndex,
  onMainPhotoChange,
}: VehiclePhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setUploadingFileName(file.name);
      setUploadProgress(0);

      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      // Simulate progress since supabase upload doesn't provide it
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 15, 90));
      }, 200);

      const { error } = await supabase.storage
        .from("vehicle-photos")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      clearInterval(progressInterval);

      if (error) {
        toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
        setUploading(false);
        setUploadProgress(0);
        return;
      }

      setUploadProgress(100);

      const { data: urlData } = supabase.storage
        .from("vehicle-photos")
        .getPublicUrl(fileName);

      const newPhoto: PhotoItem = { url: urlData.publicUrl, name: file.name };
      onPhotosChange([...photos, newPhoto]);

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setUploadingFileName("");
      }, 500);
    },
    [photos, onPhotosChange]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (imageFiles.length === 0) {
        toast({ title: "Arquivo inválido", description: "Selecione apenas imagens.", variant: "destructive" });
        return;
      }
      // Upload one at a time
      imageFiles.reduce(
        (chain, file) => chain.then(() => uploadFile(file)),
        Promise.resolve()
      );
    },
    [uploadFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleUrlUpload = () => {
    if (!urlInput.trim()) return;
    const newPhoto: PhotoItem = {
      url: urlInput.trim(),
      name: urlInput.trim().split("/").pop() || "foto-url",
    };
    onPhotosChange([...photos, newPhoto]);
    setUrlInput("");
  };

  const removePhoto = async (index: number) => {
    const photo = photos[index];
    // Try to delete from storage if it's a supabase URL
    if (photo.url.includes("vehicle-photos")) {
      const path = photo.url.split("vehicle-photos/").pop();
      if (path) {
        await supabase.storage.from("vehicle-photos").remove([path]);
      }
    }
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
    if (mainPhotoIndex === index) {
      onMainPhotoChange(0);
    } else if (mainPhotoIndex > index) {
      onMainPhotoChange(mainPhotoIndex - 1);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-xs font-medium text-muted-foreground">Fotos do Veículo</Label>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <div className="relative">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-primary">
                {uploadProgress}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Enviando arquivo...</p>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setUploading(false);
              }}
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Selecione fotos ou arraste aqui
            </p>
            <p className="text-xs text-muted-foreground">
              ou arraste e solte aqui
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Upload progress bar */}
      {uploading && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="truncate max-w-[200px]">{uploadingFileName}</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* URL upload */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Ou upload por URL
        </Label>
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Adicione URL da foto"
            onKeyDown={(e) => e.key === "Enter" && handleUrlUpload()}
          />
          <Button
            variant="outline"
            onClick={handleUrlUpload}
            disabled={!urlInput.trim()}
          >
            Upload
          </Button>
        </div>
      </div>

      {/* Photo previews */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`group relative rounded-lg overflow-hidden border-2 transition-colors ${
                index === mainPhotoIndex
                  ? "border-primary"
                  : "border-border"
              }`}
            >
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-24 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <button
                onClick={() => onMainPhotoChange(index)}
                className={`absolute top-1 left-1 h-6 w-6 rounded-full flex items-center justify-center transition-opacity ${
                  index === mainPhotoIndex
                    ? "bg-primary text-primary-foreground opacity-100"
                    : "bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100"
                }`}
                title="Definir como foto principal"
              >
                <Star className="h-3 w-3" />
              </button>
              {index === mainPhotoIndex && (
                <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-[10px] text-center py-0.5">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
