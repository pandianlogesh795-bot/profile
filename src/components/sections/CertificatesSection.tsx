"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ExternalLink, Eye, X, Image as ImageIcon } from "lucide-react";
import { KineticText } from "@/components/ui/KineticText";
import { CERTIFICATES, Certificate } from "@/data/content";

export const CertificatesSection: React.FC = () => {
  // Lightbox view state for enlarged certificate photo
  const [activeLightboxCert, setActiveLightboxCert] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="relative z-10 py-28 sm:py-36">
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
              Verified certifications and training credentials with photo documentation.
            </p>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATES.map((certificate, index) => (
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
                <div
                  onClick={() => setActiveLightboxCert(certificate)}
                  className="relative mb-4 aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-black/60"
                >
                  {certificate.image ? (
                    <>
                      <img
                        src={certificate.image}
                        alt={certificate.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyber-cyan/50 bg-black/80 px-4 py-2 text-xs font-mono text-cyber-neon backdrop-blur-sm transition-transform group-hover:scale-105">
                          <Eye className="h-4 w-4" /> View Certificate Photo
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-cyber-cyan/5 p-4 text-center">
                      <ImageIcon className="mb-2 h-8 w-8 text-cyber-cyan/50" />
                      <span className="font-mono text-xs text-gray-400">Click to View Certificate</span>
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
                <button
                  type="button"
                  onClick={() => setActiveLightboxCert(certificate)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-cyber-neon hover:text-white transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" /> View Photo
                </button>

                {certificate.credentialUrl && (
                  <a
                    href={certificate.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-gray-400 hover:text-cyber-neon transition-colors"
                  >
                    Credential <ExternalLink className="h-3 w-3" />
                  </a>
                )}
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