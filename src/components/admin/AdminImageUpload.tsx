"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, RefreshCw, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { uploadSkyLabanMedia, MediaFolder, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/upload";
import { getMediaUrl } from "@/lib/media";

interface AdminImageUploadProps {
  folder: MediaFolder;
  value?: string | null;
  onChange: (storagePath: string) => void;
  onRemove?: () => void;
  label?: string;
  helperText?: string;
  aspectRatio?: "square" | "video" | "portrait" | "banner";
  required?: boolean;
}

export default function AdminImageUpload({
  folder,
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  helperText = "JPEG, PNG, WebP, or AVIF (Max 10 MB)",
  aspectRatio = "video",
  required = false,
}: AdminImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewSrc = value ? getMediaUrl(value) : null;

  // Aspect ratio classes for responsive preview container
  const aspectClasses = {
    square: "aspect-square max-w-[200px]",
    video: "aspect-[16/9] max-w-[360px]",
    portrait: "aspect-[3/4] max-w-[200px]",
    banner: "aspect-[21/9] max-w-full",
  }[aspectRatio];

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrorMessage("Unsupported format. Allowed: JPEG, PNG, WebP, AVIF.");
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage("File exceeds 10 MB limit.");
      return;
    }

    setUploading(true);
    setUploadProgress(40);

    try {
      const res = await uploadSkyLabanMedia({ file, folder });
      if (!res.success) {
        throw new Error(res.error || "Upload failed.");
      }

      setUploadProgress(100);
      onChange(res.storagePath);
      setSuccessMessage("Uploaded successfully.");
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to upload image. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (onRemove) onRemove();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Label and Storage Folder */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          folder: {folder}/
        </span>
      </div>

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        onChange={handleInputChange}
        className="hidden"
        disabled={uploading}
      />

      {/* Upload Box / Preview */}
      {previewSrc ? (
        <div className="space-y-2">
          {/* Active Preview Container */}
          <div
            className={`relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs group w-full ${aspectClasses}`}
          >
            <Image
              src={previewSrc}
              alt="Media Preview"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 360px"
              unoptimized={previewSrc.includes("supabase.co")}
            />

            {/* Uploading Overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
                <RefreshCw className="w-6 h-6 text-[#0754C9] animate-spin" />
                <span className="text-xs font-semibold text-[#0754C9]">Uploading...</span>
              </div>
            )}

            {/* Quick Actions overlay */}
            {!uploading && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-w-[36px] min-h-[36px] p-2 rounded-lg bg-white/95 hover:bg-white text-slate-700 hover:text-[#0754C9] shadow-sm border border-slate-200 transition-colors"
                  title="Replace Image"
                  aria-label="Replace Image"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="min-w-[36px] min-h-[36px] p-2 rounded-lg bg-white/95 hover:bg-white text-rose-600 hover:text-rose-700 shadow-sm border border-slate-200 transition-colors"
                  title="Remove Image"
                  aria-label="Remove Image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Storage Path Reference Tag */}
          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80">
            <span className="font-mono truncate max-w-[280px] sm:max-w-[360px]">
              Storage: <span className="text-slate-700 font-semibold">{value}</span>
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[#0754C9] hover:underline font-semibold text-xs ml-auto"
            >
              Replace
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone State */
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative w-full rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? "border-[#0754C9] bg-sky-50/60"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white"
          } ${uploading ? "pointer-events-none opacity-80" : ""}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <RefreshCw className="w-8 h-8 text-[#0754C9] animate-spin" />
              <p className="text-xs font-semibold text-[#0754C9]">Uploading to sky-laban-media...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <Upload className="w-5 h-5 text-[#0754C9]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  <span className="text-[#0754C9]">Click to upload</span> or drag and drop
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success / Error Messages */}
      {successMessage && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
