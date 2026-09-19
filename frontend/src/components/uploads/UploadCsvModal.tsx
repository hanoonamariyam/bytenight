import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  FileText,
  Users
} from 'lucide-react';
import { uploadService, UploadSummary } from '../../services/uploadService';

interface UploadCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UploadCsvModal: React.FC<UploadCsvModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [uploadType, setUploadType] = useState<'academic' | 'attendance'>('academic');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [result, setResult] = useState<UploadSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
        setErrorMessage('Please select a valid CSV file (.csv).');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      let res: UploadSummary;
      if (uploadType === 'academic') {
        res = await uploadService.uploadAcademicCsv(selectedFile);
      } else {
        res = await uploadService.uploadAttendanceCsv(selectedFile);
      }
      setResult(res);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Upload failed. Please check CSV format.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <FileSpreadsheet size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Batch Record Ingestion</h3>
              <p className="text-xs text-slate-500">Upload CSV batches to update student support records</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => { setUploadType('academic'); handleReset(); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                uploadType === 'academic' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Academic Test Scores
            </button>
            <button
              type="button"
              onClick={() => { setUploadType('attendance'); handleReset(); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                uploadType === 'attendance' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Attendance Records
            </button>
          </div>

          {/* Schema Requirement Hints */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
            <p className="font-semibold text-slate-700 flex items-center gap-1.5">
              <FileText size={13} className="text-indigo-600" />
              <span>Expected CSV Columns:</span>
            </p>
            {uploadType === 'academic' ? (
              <p className="font-mono text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 break-all">
                student_code, name (optional), subject, assessment_type, assessment_date, score, max_score
              </p>
            ) : (
              <p className="font-mono text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 break-all">
                student_code, name (optional), date, status, session_name
              </p>
            )}
            <p className="text-[11px] text-slate-500">
              * Supports student IDs (`stu_001`) or official codes (`ST001`).
            </p>
          </div>

          {/* Upload Area */}
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".csv,text/csv" 
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/20 rounded-xl p-6 text-center cursor-pointer transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500 mb-3">
                <Upload size={20} />
              </div>
              <p className="text-xs font-semibold text-slate-800">
                Click to browse or drag and drop your CSV file here
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                CSV files up to 10MB supported
              </p>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{selectedFile.name}</p>
                  <p className="text-[11px] text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Change
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-700">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success / Result Summary */}
          {result && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 size={16} />
                <span>Import Complete</span>
              </div>
              <p className="text-xs text-emerald-700">{result.message}</p>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200 text-center">
                <div className="bg-white/70 p-1.5 rounded">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Accepted</span>
                  <span className="text-xs font-bold text-emerald-700">{result.acceptedRows}</span>
                </div>
                <div className="bg-white/70 p-1.5 rounded">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Rejected</span>
                  <span className="text-xs font-bold text-rose-600">{result.rejectedRows}</span>
                </div>
                <div className="bg-white/70 p-1.5 rounded">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Updated</span>
                  <span className="text-xs font-bold text-slate-800">{result.updatedStudents}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            {result ? 'Done' : 'Cancel'}
          </button>

          {!result && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer ${
                selectedFile && !isUploading
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isUploading ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Processing Batch...</span>
                </>
              ) : (
                <>
                  <Upload size={13} />
                  <span>Upload &amp; Process</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
