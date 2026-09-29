"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Eye,
  AlertTriangle,
  Folder,
  X,
  Sparkles,
  RefreshCw,
  Info,
} from "lucide-react";
import { getMediaUrl } from "@/lib/media";
import { MediaItem } from "@/app/api/admin/media/route";

const FOLDERS = [
  { id: "all", label: "All Media" },
  { id: "hero", label: "Hero Slides" },
  { id: "products", label: "Products" },
  { id: "outlets", label: "Outlets" },
  { id: "reels", label: "Instagram Reels" },
  { id: "branding", label: "Branding" },
  { id: "drinks", label: "Drinks" },
] as const;

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  // Modals
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [deleteWarningItem, setDeleteWarningItem] = useState<MediaItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form State
  const [uploadFolder, setUploadFolder] = useState<string>("products");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async (folder = selectedFolder) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/media?folder=${folder}`);
      if (res.ok) {
        const json = await res.json();
        setMedia(json.media || []);
      }
    } catch (err) {
      console.error("Failed fetching media list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia(selectedFolder);
  }, [selectedFolder]);

  const handleCopyUrl = (item: MediaItem) => {
    const url = item.publicUrl.startsWith("http")
      ? item.publicUrl
      : `${window.location.origin}${item.publicUrl}`;
    navigator.clipboard.writeText(url);
    setCopiedPath(item.path);
    setTimeout(() => setCopiedPath(null), 2500);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError("Please select an image file to upload.");
      return;
    }

    if (uploadFile.size > 10 * 1024 * 1024) {
      setUploadError("File must be under 10MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("folder", uploadFolder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Upload failed");
      }

      setUploadSuccess(`Uploaded successfully to ${uploadFolder}/!`);
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => {
        setIsUploadOpen(false);
        setUploadSuccess(null);
        fetchMedia(selectedFolder);
      }, 1500);
    } catch (err: any) {
      setUploadError(err.message || "Failed uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem, force = false) => {
    try {
      const res = await fetch(
        `/api/admin/media?path=${encodeURIComponent(item.path)}&force=${force}`,
        { method: "DELETE" }
      );

      const json = await res.json();
      if (res.status === 409 && !force) {
        // Needs confirmation because it is in use
        setDeleteWarningItem(item);
        return;
      }

      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.path !== item.path));
        setDeleteWarningItem(null);
      } else {
        alert(json.error || "Failed to delete image.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting media item.");
    }
  };

  const filteredMedia = media.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.path.toLowerCase().includes(search.toLowerCase()) ||
      m.usedIn.some((u) => u.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes === 0) return "—";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#063B91] tracking-tight flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-[#0754C9]" />
            <span>Central Media Library</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse and manage files in the <code className="bg-[#EBF5FE] text-[#0754C9] px-1.5 py-0.5 rounded font-mono">sky-laban-media</code> Supabase Storage bucket.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-bold shadow-md shadow-[#0754C9]/25 transition-all hover:scale-102 active:scale-98 cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#DDF5FF] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename, folder or component..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#0754C9] text-xs text-slate-800 outline-none"
          />
        </div>

        {/* Folder Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {FOLDERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedFolder === f.id
                  ? "bg-[#0754C9] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-3 border-[#0754C9] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading media library assets...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-24 text-center rounded-3xl bg-white border border-[#DDF5FF] p-8">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No media items found</h3>
          <p className="text-xs text-slate-400 mt-1">
            No images match your search in &ldquo;{selectedFolder}&rdquo;. Upload an asset to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-[#DDF5FF] hover:border-[#0754C9]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
            >
              {/* Thumbnail Container */}
              <div
                onClick={() => setPreviewItem(item)}
                className="relative aspect-square w-full bg-gradient-to-b from-[#eaf6ff] to-white p-2.5 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                <Image
                  src={getMediaUrl(item.publicUrl)}
                  alt={item.name}
                  fill
                  sizes="200px"
                  className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Folder pill badge top-left */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#063B91]/80 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider">
                  {item.folder}
                </div>

                {/* In Use badge top-right */}
                {item.isUsed && (
                  <div
                    className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-bold flex items-center gap-1 shadow-xs"
                    title={`In use by: ${item.usedIn.join(", ")}`}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    <span>In Use</span>
                  </div>
                )}
              </div>

              {/* Card Meta & Actions */}
              <div className="p-3 bg-white flex flex-col justify-between flex-1 border-t border-slate-100">
                <div>
                  <p
                    className="text-xs font-bold text-slate-800 truncate"
                    title={item.name}
                  >
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formatBytes(item.sizeBytes)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                  {/* Copy Public URL */}
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#0754C9] hover:bg-[#EBF5FE] transition-colors cursor-pointer"
                    title="Copy Public URL"
                  >
                    {copiedPath === item.path ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Preview */}
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#0754C9] hover:bg-[#EBF5FE] transition-colors cursor-pointer"
                    title="Preview Image"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: PREVIEW IMAGE ================= */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#063B91] truncate max-w-md">
                  {previewItem.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {previewItem.path}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Canvas */}
            <div className="relative aspect-[16/10] w-full bg-slate-950 flex items-center justify-center p-4">
              <Image
                src={getMediaUrl(previewItem.publicUrl)}
                alt={previewItem.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Footer with Details & Actions */}
            <div className="p-4 sm:p-5 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-700">Usage Status: </span>
                {previewItem.isUsed ? (
                  <span className="text-emerald-700 font-semibold">
                    Referenced in: {previewItem.usedIn.join(", ")}
                  </span>
                ) : (
                  <span className="text-slate-400">Not actively bound to database records</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyUrl(previewItem)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#0754C9] text-[#0754C9] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </button>
                <a
                  href={getMediaUrl(previewItem.publicUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#0754C9] text-white hover:bg-[#0645B8] font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Open Original</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: UPLOAD IMAGE ================= */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#DDF5FF] p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#0754C9]" />
                <h3 className="text-base font-bold text-[#063B91]">
                  Upload to Supabase Storage
                </h3>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Folder Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination Storage Folder
                </label>
                <select
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-[#0754C9]"
                >
                  <option value="products">products/ (Menu & Dessert Creations)</option>
                  <option value="hero">hero/ (Homepage Slides & Banners)</option>
                  <option value="outlets">outlets/ (Branch Store Photos & Maps)</option>
                  <option value="reels">reels/ (Instagram Reels Thumbnails)</option>
                  <option value="drinks">drinks/ (Bottled Aseera & Drinks)</option>
                  <option value="branding">branding/ (Logos, Icons, Emblems)</option>
                  <option value="founders">founders/ (Founder Profiles)</option>
                </select>
              </div>

              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Image File
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#BBE3FC] hover:border-[#0754C9] bg-[#F8FCFF] rounded-2xl p-6 text-center cursor-pointer transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setUploadFile(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                  <Upload className="w-7 h-7 text-[#0754C9] mx-auto mb-2 opacity-80" />
                  {uploadFile ? (
                    <div>
                      <p className="text-xs font-bold text-[#063B91]">{uploadFile.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {formatBytes(uploadFile.size)}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        Click or drag image file here
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        JPG, PNG, WebP or SVG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="px-5 py-2 rounded-xl bg-[#0754C9] hover:bg-[#0645B8] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload to Bucket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE IN-USE WARNING ================= */}
      {deleteWarningItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-200 p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Warning: Image is Currently in Use
            </h3>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              The image <strong className="text-slate-800">{deleteWarningItem.name}</strong> is currently referenced by:
            </p>

            <ul className="mt-2 p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-rose-700 font-semibold list-disc list-inside">
              {deleteWarningItem.usedIn.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>

            <p className="text-xs text-slate-500 mt-2">
              Deleting this image will cause broken image displays on the public website for those items.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteWarningItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel &amp; Keep Image
              </button>
              <button
                onClick={() => handleDelete(deleteWarningItem, true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Force Delete Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
