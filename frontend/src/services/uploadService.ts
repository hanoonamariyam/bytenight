import { apiRequest, simulateLatency, USE_MOCK_API } from './api';

export interface UploadSummary {
  totalRows: number;
  acceptedRows: number;
  rejectedRows: number;
  missingDataRows: number;
  updatedStudents: number;
  errors: string[];
  message: string;
}

class UploadService {
  async uploadAcademicCsv(file: File): Promise<UploadSummary> {
    if (!USE_MOCK_API) {
      const formData = new FormData();
      formData.append('file', file);
      return await apiRequest<UploadSummary>('/academic/upload', {
        method: 'POST',
        body: formData,
      });
    }

    await simulateLatency(500);
    return {
      totalRows: 14,
      acceptedRows: 14,
      rejectedRows: 0,
      missingDataRows: 0,
      updatedStudents: 14,
      errors: [],
      message: `Successfully processed mock academic batch for ${file.name}.`
    };
  }

  async uploadAttendanceCsv(file: File): Promise<UploadSummary> {
    if (!USE_MOCK_API) {
      const formData = new FormData();
      formData.append('file', file);
      return await apiRequest<UploadSummary>('/attendance/upload', {
        method: 'POST',
        body: formData,
      });
    }

    await simulateLatency(500);
    return {
      totalRows: 14,
      acceptedRows: 14,
      rejectedRows: 0,
      missingDataRows: 0,
      updatedStudents: 14,
      errors: [],
      message: `Successfully processed mock attendance batch for ${file.name}.`
    };
  }
}

export const uploadService = new UploadService();
