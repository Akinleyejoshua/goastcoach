'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAppStore, type Feedback } from '@/store/appStore';
import FeedbackCard from '@/components/FeedbackCard';
import Image from 'next/image';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const user = useAuthStore((s) => s.user);
  const addSession = useAppStore((s) => s.addSession);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const token = document.cookie.split('; ').find((row) => row.startsWith('auth-token='))?.split('=')[1];
      if (!token) throw new Error('No auth token');

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      addSession(data.session);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxFiles: 1,
  });

  const sessions = useAppStore((s) => s.sessions);

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Upload Your Stance</h1>
        <p className="text-muted-foreground mt-2">
          Upload a photo of your {user?.sport?.toLowerCase()} technique and get AI-powered coaching feedback.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 md:p-16 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-input hover:border-primary/50 hover:bg-secondary'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {uploading ? (
            <>
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-5" />
              <p className="text-lg font-medium text-foreground">Analyzing your technique...</p>
              <p className="text-muted-foreground mt-1">This may take a few seconds</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-medium text-foreground">
                {isDragActive ? 'Drop your photo here' : 'Drag & drop a photo, or click to select'}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">JPG or PNG, max 5MB</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {sessions.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-card-border">
          <h2 className="text-xl font-semibold text-foreground">Latest Analysis</h2>
          <FeedbackCard session={sessions[0]} expanded />
        </div>
      )}
    </div>
  );
}
