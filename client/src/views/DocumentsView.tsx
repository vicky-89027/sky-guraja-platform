import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { AuthUser } from '../types';
import { FolderLock, Upload, FileText, Download, ShieldCheck, Tag, Eye } from 'lucide-react';

interface DocumentsViewProps {
  user: AuthUser | null;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ user }) => {
  const [docs, setDocs] = useState<any[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Upload modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [docCategory, setDocCategory] = useState('BILL');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocs();
  }, [category]);

  const loadDocs = () => {
    setLoading(true);
    api.getDocuments(category)
      .then((res) => {
        if (res.success) setDocs(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedFile) {
      alert('Please provide title and select a document file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', docCategory);
    formData.append('file', selectedFile);

    try {
      const res = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('sky_token')}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setTitle('');
        setSelectedFile(null);
        loadDocs();
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err: any) {
      alert(err.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  const categories = ['BILL', 'RECEIPT', 'QUOTATION', 'PERMISSION', 'MINUTES', 'STATEMENT', 'OTHER'];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl lg:text-2xl font-black text-white font-display">
              Secure Document Vault
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Verified vendor bills, quotations, government permissions, and financial audit statements
          </p>
        </div>

        {user?.role !== 'AUDITOR' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Supporting Document</span>
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory('')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            category === '' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-[#0B1B36] text-slate-300 border border-white/10'
          }`}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              category === c ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-[#0B1B36] text-slate-300 border border-white/10'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400 text-xs">Loading documents...</div>
        ) : docs.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-400 text-xs">No documents uploaded in this category.</div>
        ) : (
          docs.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#0B1B36] border border-white/10 rounded-2xl p-5 shadow-xl space-y-3 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono font-bold text-[10px] uppercase border border-amber-500/30">
                    {doc.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {(doc.file_size / 1024).toFixed(1)} KB
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{doc.title}</h3>
                <div className="text-[10px] text-slate-400 mt-2">
                  Uploaded by: <b className="text-slate-200">{doc.uploaded_by_name || 'Admin'}</b> • {doc.created_at?.split(' ')[0]}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-end">
                <a
                  href={`http://localhost:5000${doc.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#16335F] hover:bg-[#1E437C] text-amber-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / View</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleUpload} className="bg-[#0B1B36] border border-amber-500/30 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-400" />
              Upload Document to Secure Vault
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title *</label>
              <input
                type="text"
                placeholder="e.g. Sound & Lighting Vendor Original Bill"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">File Attachment (PDF, Image, Docs) *</label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#16335F] text-slate-300 text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
              >
                {uploading ? 'Uploading...' : 'Save to Vault'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
