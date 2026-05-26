'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Loader2, AlertCircle, Upload, Award } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import FeedbackCard from '@/components/FeedbackCard';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-royalblue/10 dark:bg-royalblue/20 rounded-2xl mb-6">
          <Camera className="w-8 h-8 text-royalblue" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white mb-3">
          Upload Your Stance
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
          Get instant AI-powered coaching for your {user?.sport?.toLowerCase() || 'sport'} technique
        </p>
      </div>

      {/* Premium Upload Zone */}
      <div
        {...getRootProps()}
        className={`group relative bg-white dark:bg-zinc-950 rounded-3xl p-16 text-center cursor-pointer 
                   transition-all duration-300 border border-transparent
                   ${isDragActive 
                     ? 'ring-4 ring-royalblue/30 scale-[1.01]' 
                     : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
                   }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center">
          {uploading ? (
            <>
              <div className="w-20 h-20 bg-royalblue/10 dark:bg-royalblue/20 rounded-2xl flex items-center justify-center mb-8">
                <Loader2 className="w-10 h-10 text-royalblue animate-spin" />
              </div>
              <p className="text-2xl font-semibold text-black dark:text-white mb-3">
                Analyzing Your Technique
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
                Our AI coach is reviewing your form. This takes just a moment.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-royalblue/10 dark:bg-royalblue/20 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110">
                <Camera className="w-10 h-10 text-royalblue" />
              </div>
              
              <p className="text-2xl font-semibold text-black dark:text-white mb-3">
                {isDragActive ? "Drop your photo here" : "Upload Your Technique Photo"}
              </p>
              
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md">
                Drag & drop or click to select a clear photo of your {user?.sport?.toLowerCase() || 'sport'} stance
              </p>

              <div className="inline-flex items-center gap-3 px-6 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-sm text-zinc-500 dark:text-zinc-400">
                <Upload className="w-5 h-5" />
                JPG or PNG • Maximum 5MB
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-8 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 
                      px-6 py-5 rounded-2xl text-sm font-medium flex items-start gap-4 border-l-4 border-red-500">
          <AlertCircle size={24} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Premium Latest Analysis Section */}
      {sessions.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-9 h-9 bg-royalblue/10 dark:bg-royalblue/20 rounded-2xl flex items-center justify-center">
              <Award className="w-5 h-5 text-royalblue" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-black dark:text-white">
                Latest Analysis
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg -mt-1">
                AI Coach Feedback
              </p>
            </div>
            <div className="ml-auto text-sm text-zinc-500 dark:text-zinc-400">
              {sessions.length} session{sessions.length > 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-950 rounded-3xl p-10">
            <FeedbackCard session={sessions[0]} expanded />
          </div>
        </div>
      )}

      {/* Empty State */}
      {sessions.length === 0 && !uploading && (
        <div className="text-center py-20">
          <div className="mx-auto w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-6">
            <Camera className="w-8 h-8 text-zinc-400" />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            Your first analysis will appear here
          </p>
        </div>
      )}
    </div>
  );
}