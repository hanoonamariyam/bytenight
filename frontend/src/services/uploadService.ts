import { apiRequest, simulateLatency, USE_MOCK_API } from './api';
import { MOCK_STUDENTS } from '../data/mockData';

export interface UploadSummary {
  totalRows: number;
  acceptedRows: number;
  rejectedRows: number;
  missingDataRows: number;
  updatedStudents: number;
  errors: string[];
  message: string;
}

export const STUDENT_DATA_UPDATED_EVENT = 'bytenight:student-data-updated';

const parseCsv = (content: string): Record<string, string>[] => {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return [];

  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let value = '';
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const character = line[index];
      if (character === '"') {
        quoted = !quoted;
      } else if (character === ',' && !quoted) {
        values.push(value.trim());
        value = '';
      } else {
        value += character;
      }
    }
    values.push(value.trim());
    return values;
  };

  const headers = parseLine(lines[0]).map(header => header.toLowerCase());
  return lines.slice(1).map(line => {
    const values = parseLine(line);
    return headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = values[index] || '';
      return row;
    }, {});
  });
};

const updateMockStudents = async (file: File, uploadType: 'academic' | 'attendance') => {
  const rows = parseCsv(await file.text());
  const affectedCodes = new Set<string>();

  rows.forEach(row => {
    const code = row.student_code || row.student_id || row.id;
    if (!code) return;
    let student = MOCK_STUDENTS.find(item => item.studentCode === code || item.id === code);
    const name = row.name || row.full_name || row.student_name;
    if (!student && name) {
      student = {
        id: `stu_upload_${code.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
        studentCode: code,
        fullName: name,
        email: row.email || `${code.toLowerCase()}@uploaded.local`,
        className: row.class_name || row.class || 'CS-101 Sec A',
        section: row.section || 'A',
        currentStatus: 'GREEN',
        riskScore: 0.15,
        trend: 'STABLE',
        academicScore: 0,
        attendancePercentage: 0,
        engagementScore: 0,
        currentRank: MOCK_STUDENTS.length + 1,
        previousRank: MOCK_STUDENTS.length + 1,
        bestRank: MOCK_STUDENTS.length + 1,
        rankChange: 0,
        dataAvailability: {
          academic: 'DATA_UNAVAILABLE',
          attendance: 'DATA_UNAVAILABLE',
          engagement: 'DATA_UNAVAILABLE',
          vision: 'DATA_UNAVAILABLE'
        },
        lastEvaluated: new Date().toISOString()
      };
      MOCK_STUDENTS.push(student);
    }
    if (!student) return;

    if (row.name || row.full_name || row.student_name) {
      student.fullName = row.name || row.full_name || row.student_name;
    }

    if (uploadType === 'academic') {
      const score = Number(row.score);
      const maxScore = Number(row.max_score || 100);
      if (Number.isFinite(score) && maxScore > 0) {
        student.academicScore = Number(((score / maxScore) * 100).toFixed(1));
        affectedCodes.add(student.studentCode);
      }
    } else {
      affectedCodes.add(student.studentCode);
    }
  });

  if (uploadType === 'attendance') {
    rows.forEach(row => {
      const code = row.student_code || row.student_id || row.id;
      const student = MOCK_STUDENTS.find(item => item.studentCode === code || item.id === code);
      if (!student || !affectedCodes.has(student.studentCode)) return;
      const studentRows = rows.filter(item => (item.student_code || item.student_id || item.id) === code);
      const attended = studentRows.filter(item => ['PRESENT', 'LATE'].includes((item.status || '').toUpperCase())).length;
      student.attendancePercentage = Number(((attended / studentRows.length) * 100).toFixed(1));
    });
  }
};

const notifyStudentDataUpdated = () => {
  window.dispatchEvent(new CustomEvent(STUDENT_DATA_UPDATED_EVENT));
};

class UploadService {
  async uploadAcademicCsv(file: File): Promise<UploadSummary> {
    if (!USE_MOCK_API) {
      const formData = new FormData();
      formData.append('file', file);
      const result = await apiRequest<UploadSummary>('/academic/upload', {
        method: 'POST',
        body: formData,
      });
      notifyStudentDataUpdated();
      return result;
    }

    await simulateLatency(500);
    await updateMockStudents(file, 'academic');
    notifyStudentDataUpdated();
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
      const result = await apiRequest<UploadSummary>('/attendance/upload', {
        method: 'POST',
        body: formData,
      });
      notifyStudentDataUpdated();
      return result;
    }

    await simulateLatency(500);
    await updateMockStudents(file, 'attendance');
    notifyStudentDataUpdated();
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
