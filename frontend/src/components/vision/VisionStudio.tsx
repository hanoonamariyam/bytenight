import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileVideo, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  HardDrive, 
  Film,
  ArrowRight,
  RefreshCw,
  Eye
} from 'lucide-react';

const SUPPORTED_EXTENSIONS = ['.mp4', '.mov', '.webm', '.avi'];
const SUPPORTED_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo',
  'video/avi',
];

export const VisionStudio: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [analysisStatus, setAnalysisStatus] = useState<'IDLE' | 'STAGED'>('IDLE');

  // Clean up object URL when component unmounts or previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Keep selected File object accessible globally for future FastAPI endpoint integration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__selectedClassroomVideoFile = selectedFile;
    }
  }, [selectedFile]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const validateFile = (file: File): boolean => {
    const fileNameLower = file.name.toLowerCase();
    const hasValidExt = SUPPORTED_EXTENSIONS.some(ext => fileNameLower.endsWith(ext));
    const hasValidMime = file.type ? SUPPORTED_MIME_TYPES.includes(file.type) || file.type.startsWith('video/') : true;

    if (!hasValidExt && !hasValidMime) {
      setErrorMessage(
        `Unsupported format for "${file.name}". Please select an MP4, MOV, WebM, or AVI video.`
      );
      return false;
    }
    return true;
  };

  const handleProcessFile = (file: File) => {
    setErrorMessage(null);
    setAnalysisStatus('IDLE');

    if (!validateFile(file)) {
      return;
    }

    // Revoke previous URL if any
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const localUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(localUrl);
    setVideoDuration(null);
    setVideoDimensions(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset so the exact same file can be re-selected if desired
      fileInputRef.current.click();
    }
  };

  const handleRemoveVideo = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
    setVideoDuration(null);
    setVideoDimensions(null);
    setAnalysisStatus('IDLE');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      setVideoDimensions({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
    }
  };

  const handleAnalyzeVideo = () => {
    if (!selectedFile) return;
    setAnalysisStatus('STAGED');
  };

  return (
    <div className="space-y-6">
      
      {/* Hidden native computer file picker input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,.mp4,.mov,.webm,.avi"
        onChange={handleFileInputChange}
        className="hidden"
        data-testid="classroom-video-input"
      />

      {/* Integration Phase Header & Notice */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Classroom Video Ingestion &amp; Optical Telemetry
            </h2>
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              Native File Upload
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload recorded lecture sessions for optical presence, head pose stability, and attention cone modeling
          </p>
        </div>

        {/* Primary Upload Action Trigger */}
        <div className="flex items-center gap-2.5">
          {selectedFile ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUploadButtonClick}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Change Video</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200 cursor-pointer"
                title="Remove selected video"
              >
                <Trash2 size={14} />
                <span>Remove</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleUploadButtonClick}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <Upload size={15} />
              <span>Upload Classroom Video</span>
            </button>
          )}

          <button
            type="button"
            disabled={!selectedFile}
            onClick={handleAnalyzeVideo}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedFile
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <Sparkles size={15} />
            <span>Analyze Video</span>
          </button>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 shadow-2xs">
          <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{errorMessage}</p>
            <p className="text-rose-600 mt-0.5">
              Please ensure your file is an MP4, MOV, WebM, or AVI video container.
            </p>
          </div>
        </div>
      )}

      {/* Video Staged Confirmation Banner */}
      {analysisStatus === 'STAGED' && selectedFile && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900 shadow-2xs">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-emerald-950">
              Video File Staged &amp; Verified for Analysis
            </h4>
            <p className="text-emerald-800 leading-relaxed">
              Selected file <strong className="font-mono text-emerald-900">{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)}) is verified and held in memory. The File object is ready for dispatch to the FastAPI backend endpoint <span className="font-mono font-semibold">POST /api/v1/vision/analyze</span> during the AI/ML integration phase.
            </p>
            <div className="pt-1 flex items-center gap-3 text-[11px] text-emerald-700 font-medium">
              <span>MIME: {selectedFile.type || 'video/mp4'}</span>
              <span>•</span>
              <span>Last Modified: {new Date(selectedFile.lastModified).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Player & Metadata Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Video Player / Upload Dropzone */}
        <div className="lg:col-span-2 bg-slate-950 rounded-xl overflow-hidden shadow-md border border-slate-800 flex flex-col">
          
          {/* Player Header Strip */}
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2 truncate mr-2">
              <Film size={15} className="text-indigo-400 shrink-0" />
              <span className="font-semibold text-white truncate">
                {selectedFile ? selectedFile.name : 'Classroom Video Player'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {selectedFile && (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
                  {formatFileSize(selectedFile.size)}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                selectedFile ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50' : 'bg-slate-800 text-slate-400'
              }`}>
                {selectedFile ? 'Video Loaded' : 'Awaiting Video'}
              </span>
            </div>
          </div>

          {/* Video Player or Dropzone Area */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <video
                ref={videoRef}
                key={previewUrl}
                src={previewUrl}
                controls
                playsInline
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadButtonClick}
                className={`w-full h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all border-2 border-dashed ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-950/20'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900/50'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mb-4 shadow-inner group-hover:scale-105 transition-transform">
                  <FileVideo size={32} className="text-indigo-400" />
                </div>

                <h3 className="text-sm font-bold text-white mb-1">
                  Upload Classroom Observation Video
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
                  Drag and drop your recorded classroom video file here, or click to browse your computer folders.
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-xs">
                  <Upload size={14} />
                  <span>Choose Video File</span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>Supported:</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">MP4</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">MOV</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">WebM</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">AVI</span>
                </div>
              </div>
            )}
          </div>

          {/* Player Footer Status Bar */}
          <div className="bg-slate-900/90 px-4 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Local Browser Blob Stream • Secure client-side memory handling</span>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                {videoDimensions && (
                  <span>Res: {videoDimensions.width}x{videoDimensions.height}</span>
                )}
                {videoDuration !== null && (
                  <span>Duration: {formatDuration(videoDuration)}</span>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Video File Metadata & Pipeline Readiness */}
        <div className="space-y-4">
          
          {/* Metadata Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Selected Video Metadata
              </span>
              <FileVideo size={16} className="text-indigo-600" />
            </div>

            {selectedFile ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Filename:</span>
                  <p className="font-bold text-slate-900 break-all font-mono mt-0.5">
                    {selectedFile.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 block text-[11px]">File Size:</span>
                    <strong className="text-slate-800 font-mono">
                      {formatFileSize(selectedFile.size)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Container:</span>
                    <strong className="text-slate-800 font-mono uppercase">
                      {selectedFile.name.split('.').pop() || 'VIDEO'}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Duration:</span>
                    <strong className="text-slate-800 font-mono">
                      {videoDuration !== null ? formatDuration(videoDuration) : 'Calculating...'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Resolution:</span>
                    <strong className="text-slate-800 font-mono">
                      {videoDimensions ? `${videoDimensions.width}x${videoDimensions.height}` : 'Calculating...'}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-500 block text-[11px]">Target Endpoint:</span>
                  <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 block mt-1 truncate">
                    POST /api/v1/vision/analyze
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                <Clock size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-600">No Video Selected</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Click "Upload Classroom Video" to select an MP4, MOV, WebM, or AVI recording.
                </p>
              </div>
            )}
          </div>

          {/* Analysis Readiness Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Vision Pipeline Readiness
            </span>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Native File Loaded:</span>
                <span className={`font-semibold ${selectedFile ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {selectedFile ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Player Controller:</span>
                <span className={`font-semibold ${previewUrl ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {previewUrl ? 'Active (Play/Seek Enabled)' : 'Standby'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Analyze Action:</span>
                <span className={`font-semibold ${selectedFile ? 'text-indigo-700 font-bold' : 'text-slate-400'}`}>
                  {selectedFile ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={!selectedFile}
                onClick={handleAnalyzeVideo}
                className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedFile
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                <Sparkles size={14} />
                <span>{analysisStatus === 'STAGED' ? 'Analyze Video (Staged)' : 'Analyze Video'}</span>
              </button>
            </div>
          </div>

          {/* Neutral Data Policy Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Non-Surveillance Guarantee</span>
            </h5>
            <p className="leading-relaxed text-[11px] text-slate-500">
              Absence of classroom video or camera outages are evaluated neutrally with zero negative impact on student academic risk evaluations.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
