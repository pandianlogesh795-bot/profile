"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ExternalLink, Eye, X, Image as ImageIcon, Upload, Plus, Trash2, RotateCcw, Check } from "lucide-react";
import { KineticText } from "@/components/ui/KineticText";
import { CERTIFICATES, Certificate } from "@/data/content";

const STORAGE_KEY = "user_certificates_v1";

export const CertificatesSection: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>(CERTIFICATES);
  const [activeLightboxCert, setActiveLightboxCert] = useState<Certificate | null>(null);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New certificate form state
  const [newCert, setNewCert] = useState<{
    name: string;
    issuer: string;
    issueDate: string;
    credentialId: string;
    credentialUrl: string;
    image: string;
  }>({
    name: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    image: "",
  });

  // Load persisted certificates from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCertificates(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load certificates from localStorage", e);
    }
  }, []);

  // Save certificates to localStorage
  const saveToLocalStorage = (updatedCerts: Certificate[]) => {
    setCertificates(updatedCerts);
    try {
      localStorage.getItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCerts));
      showToast("Certificates saved permanently to browser storage!");
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleImageUpload = (
    certId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const updated = certificates.map((c) =>
          c.id === certId ? { ...c, image: result } : c
        );
        saveToLocalStorage(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNewCertImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setNewCert((prev) => ({ ...prev, image: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.name || !newCert.issuer) {
      showToast("Please provide at least Title and Issuer.");
      return;
    }

    const createdCert: Certificate = {
      id: `cert-${Date.now()}`,
      name: newCert.name,
      issuer: newCert.issuer,
      issueDate: newCert.issueDate || new Date().toISOString().slice(0, 7),
      credentialId: newCert.credentialId,
      credentialUrl: newCert.credentialUrl,
      image: newCert.image || "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop",
    };

    const updated = [...certificates, createdCert];
    saveToLocalStorage(updated);
    setNewCert({ name: "", issuer: "", issueDate: "", credentialId: "", credentialUrl: "", image: "" });
    setIsAddingCert(false);
  };

  const handleDeleteCert = (certId: string) => {
    const updated = certificates.filter((c) => c.id !== certId);
    saveToLocalStorage(updated);
    showToast("Certificate removed.");
  };

  const handleResetDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCertificates(CERTIFICATES);
    showToast("Reset to default certificates.");
  };

  return (
    <section id="certificates" className="relative z-10 py-28 sm:py-36">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 flex items-center gap-2 rounded-lg border border-cyber-cyan/50 bg-[#0A101D]/90 px-4 py-3 text-xs font-mono text-cyber-neon shadow-[0_0_20px_rgba(0,240,255,0.3)] backdrop-blur-md"
          >
            <Check className="h-4 w-4 text-cyber-neon" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 border border-cyber-cyan/30 bg-cyber-cyan/10 px-3 py-1.5 text-xs font-mono uppercase tracking-widest text-cyber-neon">
              <Award className="h-3.5 w-3.5" /> 05 // CREDENTIALS & CERTIFICATES
            </div>
            <KineticText
              as="h2"
              text="Certificates"
              className="text-3xl font-display font-black text-white sm:text-5xl"
            />
            <p className="max-w-xl text-sm leading-relaxed text-gray-400">
              Verified certifications &amp; training credentials. Change photos or add new certificates permanently.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddingCert(!isAddingCert)}
              className="inline-flex items-center gap-2 rounded-full border border-cyber-cyan/40 bg-cyber-cyan/10 px-4 py-2 text-xs font-mono text-cyber-neon transition-all hover:bg-cyber-cyan/20"
            >
              <Plus className="h-4 w-4" /> Add Certificate
            </button>
            <button
              type="button"
              onClick={handleResetDefault}
              title="Reset to initial certificates"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-gray-400 transition-all hover:border-white/30 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Default
            </button>
          </div>
        </div>

        {/* Add Certificate Modal / Panel */}
        <AnimatePresence>
          {isAddingCert && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden rounded-xl border border-cyber-cyan/30 bg-[#0A101E]/90 p-6 backdrop-blur-md"
            >
              <h3 className="mb-4 font-display text-lg font-bold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-cyber-neon" /> Add New Certificate
              </h3>
              <form onSubmit={handleAddCertificate} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs text-gray-300 mb-1">Certificate Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack Web Development"
                    value={newCert.name}
                    onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:border-cyber-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-gray-300 mb-1">Issuer / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DLK Software Solutions"
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:border-cyber-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-gray-300 mb-1">Issue Date (YYYY-MM)</label>
                  <input
                    type="text"
                    placeholder="2026-03"
                    value={newCert.issueDate}
                    onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:border-cyber-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-gray-300 mb-1">Credential ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. DLK-ML-2026-03"
                    value={newCert.credentialId}
                    onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:border-cyber-cyan focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-xs text-gray-300 mb-1">Certificate Photo / Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleNewCertImageUpload}
                      className="hidden"
                      id="new-cert-image"
                    />
                    <label
                      htmlFor="new-cert-image"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 px-4 py-2 text-xs font-mono text-cyber-neon hover:bg-cyber-cyan/20"
                    >
                      <Upload className="h-4 w-4" /> Upload Image
                    </label>
                    {newCert.image && (
                      <span className="font-mono text-xs text-green-400">Image selected!</span>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCert(false)}
                    className="rounded-lg border border-white/10 px-4 py-2 text-xs font-mono text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-cyber-cyan px-5 py-2 text-xs font-mono font-bold text-black hover:bg-cyber-neon transition-colors"
                  >
                    Save Certificate
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate, index) => (
            <motion.article
              key={certificate.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#080C14]/80 p-5 backdrop-blur-md transition-all duration-300 hover:border-cyber-cyan/40 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]"
            >
              <div>
                {/* Photo Preview Thumbnail */}
                <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/10 bg-black/60">
                  {certificate.image ? (
                    <>
                      <img
                        src={certificate.image}
                        alt={certificate.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                        onClick={() => setActiveLightboxCert(certificate)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveLightboxCert(certificate)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-cyber-cyan/50 bg-black/80 px-3 py-1.5 text-xs font-mono text-cyber-neon backdrop-blur-sm transition-transform hover:scale-105"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          id={`change-photo-${certificate.id}`}
                          className="hidden"
                          onChange={(e) => handleImageUpload(certificate.id, e)}
                        />
                        <label
                          htmlFor={`change-photo-${certificate.id}`}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/30 bg-black/80 px-3 py-1.5 text-xs font-mono text-gray-200 backdrop-blur-sm transition-transform hover:scale-105 hover:text-white"
                        >
                          <Upload className="h-3.5 w-3.5" /> Change Photo
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-cyber-cyan/5 p-4 text-center">
                      <ImageIcon className="mb-2 h-8 w-8 text-cyber-cyan/50" />
                      <input
                        type="file"
                        accept="image/*"
                        id={`upload-photo-${certificate.id}`}
                        className="hidden"
                        onChange={(e) => handleImageUpload(certificate.id, e)}
                      />
                      <label
                        htmlFor={`upload-photo-${certificate.id}`}
                        className="cursor-pointer font-mono text-xs text-cyber-neon hover:underline inline-flex items-center gap-1"
                      >
                        <Upload className="h-3 w-3" /> Upload Photo
                      </label>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-neon">
                      <Award className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-cyber-neon">
                      {certificate.issuer}
                    </span>
                    {certificate.issueDate && (
                      <span className="ml-auto font-mono text-xs text-gray-500">
                        {certificate.issueDate}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-white group-hover:text-cyber-neon transition-colors">
                    {certificate.name}
                  </h3>

                  {certificate.credentialId && (
                    <p className="break-all font-mono text-[11px] text-gray-500">
                      ID: <span className="text-gray-400">{certificate.credentialId}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveLightboxCert(certificate)}
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-cyber-neon hover:text-white transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" /> View Photo
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    id={`btn-change-photo-${certificate.id}`}
                    className="hidden"
                    onChange={(e) => handleImageUpload(certificate.id, e)}
                  />
                  <label
                    htmlFor={`btn-change-photo-${certificate.id}`}
                    className="inline-flex cursor-pointer items-center gap-1 font-mono text-xs text-gray-400 hover:text-cyber-cyan transition-colors"
                  >
                    <Upload className="h-3 w-3" /> Photo
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteCert(certificate.id)}
                  title="Remove Certificate"
                  className="font-mono text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Lightbox / Full Photo Viewer Modal */}
      <AnimatePresence>
        {activeLightboxCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setActiveLightboxCert(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-xl border border-cyber-cyan/30 bg-[#080B14] p-5 shadow-[0_0_80px_rgba(0,240,255,0.2)]"
            >
              <button
                type="button"
                onClick={() => setActiveLightboxCert(null)}
                aria-label="Close photo preview"
                className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-black/80 p-2 text-gray-300 hover:border-cyber-cyan hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-4 space-y-1 pr-12">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-cyber-cyan" />
                  <span className="font-mono text-xs text-cyber-neon">{activeLightboxCert.issuer}</span>
                  {activeLightboxCert.issueDate && (
                    <span className="font-mono text-xs text-gray-500">· {activeLightboxCert.issueDate}</span>
                  )}
                </div>
                <h3 className="font-display text-xl font-bold text-white">{activeLightboxCert.name}</h3>
              </div>

              {activeLightboxCert.image && (
                <div className="max-h-[70vh] w-full overflow-auto rounded-lg border border-white/10 bg-black">
                  <img
                    src={activeLightboxCert.image}
                    alt={activeLightboxCert.name}
                    className="h-auto w-full max-w-full object-contain mx-auto"
                  />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};