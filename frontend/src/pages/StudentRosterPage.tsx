import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { studentService, StudentFilterParams } from '../services/studentService';
import { Student } from '../types/student.types';
import { StudentSearchFilter } from '../components/students/StudentSearchFilter';
import { StudentRankingTable } from '../components/students/StudentRankingTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Users, Award, ShieldAlert, FileSpreadsheet, Upload } from 'lucide-react';
import { UploadCsvModal } from '../components/uploads/UploadCsvModal';

export const StudentRosterPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = (searchParams.get('status') as StudentFilterParams['status']) || 'ALL';

  const [filters, setFilters] = useState<StudentFilterParams>({
    search: '',
    status: initialStatus,
    sortBy: 'rank',
    sortOrder: 'asc',
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [totalRosterCount, setTotalRosterCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Sync query parameter if changed externally (e.g. from dashboard link)
  useEffect(() => {
    const statusParam = searchParams.get('status') as StudentFilterParams['status'];
    if (statusParam && statusParam !== filters.status) {
      setFilters(prev => ({ ...prev, status: statusParam }));
    }
  }, [searchParams]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await studentService.getStudents(filters);
      setStudents(data);
      const all = await studentService.getStudents();
      setTotalRosterCount(all.length);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const handleFilterChange = (newFilters: StudentFilterParams) => {
    setFilters(newFilters);
    if (newFilters.status && newFilters.status !== 'ALL') {
      setSearchParams({ status: newFilters.status });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Complete Class Roster &amp; Cohort Rankings
            </h1>
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
              {totalRosterCount} Enrolled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section CS-101 • Performance, attendance, engagement signals, and relative cohort standings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Upload size={14} />
            <span>Upload CSV Records</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <StudentSearchFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        totalCount={totalRosterCount}
        filteredCount={students.length}
      />

      {/* Roster & Rankings Table or Empty State */}
      {isLoading ? (
        <LoadingSpinner message="Filtering and ranking student records..." />
      ) : students.length === 0 ? (
        <EmptyState
          title="No Students Matched Your Query"
          description="Try adjusting your search keywords, clearing status filters, or resetting the sorting criteria."
          actionLabel="Clear All Filters"
          onAction={() => handleFilterChange({ search: '', status: 'ALL', sortBy: 'rank', sortOrder: 'asc' })}
        />
      ) : (
        <StudentRankingTable students={students} />
      )}

      {/* Batch CSV Ingestion Modal */}
      <UploadCsvModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          fetchStudents();
        }}
      />

    </div>
  );
};
