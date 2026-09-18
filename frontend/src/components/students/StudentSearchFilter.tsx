import React from 'react';
import { StudentStatus } from '../../types/student.types';
import { StudentFilterParams } from '../../services/studentService';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

interface StudentSearchFilterProps {
  filters: StudentFilterParams;
  onFilterChange: (newFilters: StudentFilterParams) => void;
  totalCount: number;
  filteredCount: number;
}

export const StudentSearchFilter: React.FC<StudentSearchFilterProps> = ({
  filters,
  onFilterChange,
  totalCount,
  filteredCount,
}) => {
  const statusOptions: Array<{ value: 'ALL' | StudentStatus; label: string; countBadge?: string }> = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'GREEN', label: 'GREEN (Stable)' },
    { value: 'YELLOW', label: 'YELLOW (Monitor)' },
    { value: 'RED', label: 'RED (Attention)' },
  ];

  const sortOptions = [
    { value: 'rank', label: 'Current Rank' },
    { value: 'name', label: 'Student Name' },
    { value: 'status', label: 'Support Need (Red first)' },
    { value: 'academic', label: 'Academic Score' },
    { value: 'attendance', label: 'Attendance %' },
    { value: 'engagement', label: 'Engagement Score' },
    { value: 'rankChange', label: 'Rank Change (Momentum)' },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusSelect = (status: 'ALL' | StudentStatus) => {
    onFilterChange({ ...filters, status });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ 
      ...filters, 
      sortBy: e.target.value as StudentFilterParams['sortBy'] 
    });
  };

  const toggleSortOrder = () => {
    onFilterChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
    });
  };

  const resetFilters = () => {
    onFilterChange({
      search: '',
      status: 'ALL',
      sortBy: 'rank',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = !!filters.search || (filters.status && filters.status !== 'ALL') || filters.sortBy !== 'rank' || filters.sortOrder !== 'asc';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={handleSearch}
            placeholder="Search student by name or ID (e.g. ST001)..."
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 placeholder:text-slate-400 bg-slate-50/50"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Controls Row: Status & Sorting */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Status Filter Chips */}
          <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusSelect(opt.value)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  (filters.status || 'ALL') === opt.value
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-xs">
            <SlidersHorizontal size={14} className="text-slate-500 shrink-0" />
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={filters.sortBy || 'rank'}
              onChange={handleSortChange}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={toggleSortOrder}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors ml-1"
              title={`Toggle sort order (Currently ${filters.sortOrder === 'desc' ? 'Descending' : 'Ascending'})`}
            >
              <ArrowUpDown size={14} />
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-slate-500 hover:text-slate-800 underline px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>

      </div>

      {/* Filter Status Text */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-800">{filteredCount}</strong> of{' '}
          <strong className="text-slate-800">{totalCount}</strong> students in roster
        </span>
        {filters.status && filters.status !== 'ALL' && (
          <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            Filtered by: <strong>{filters.status}</strong>
          </span>
        )}
      </div>
    </div>
  );
};
