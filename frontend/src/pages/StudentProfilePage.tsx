import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { studentService } from '../services/studentService';
import { StudentDetailData } from '../types/student.types';
import { ProfileHeader } from '../components/studentDetail/ProfileHeader';
import { AcademicPerformanceSection } from '../components/studentDetail/AcademicPerformanceSection';
import { AttendanceSection } from '../components/studentDetail/AttendanceSection';
import { EngagementSection } from '../components/studentDetail/EngagementSection';
import { ContributingFactorsSection } from '../components/studentDetail/ContributingFactorsSection';
import { PerformanceRankHistorySection } from '../components/studentDetail/PerformanceRankHistorySection';
import { StatusHistorySection } from '../components/studentDetail/StatusHistorySection';
import { DataAvailabilitySection } from '../components/studentDetail/DataAvailabilitySection';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { 
  BookOpen, 
  CalendarCheck, 
  Activity, 
  HelpCircle, 
  Trophy, 
  History, 
  Shield 
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<StudentDetailData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'attendance' | 'engagement' | 'explainability' | 'ranking' | 'history'>('overview');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const result = await studentService.getStudentDetail(id);
        setData(result);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner message="Retrieving Student Support Dossier..." />;
  }

  if (!data) {
    return (
      <EmptyState
        title="Student Record Not Found"
        description={`No student profile exists matching identifier "${id}". Please verify the student roster.`}
        actionLabel="Return to Student Roster"
        onAction={() => window.location.assign('/students')}
      />
    );
  }

  const { 
    student, 
    academicRecords, 
    attendanceRecords, 
    engagement, 
    contributingFactors, 
    statusHistory, 
    rankHistory 
  } = data;

  const tabs = [
    { id: 'overview', label: 'All Signals Overview', icon: BookOpen },
    { id: 'explainability', label: 'Model Indicators & Factors', icon: HelpCircle },
    { id: 'ranking', label: 'Rank History & Momentum', icon: Trophy },
    { id: 'academic', label: 'Academic Tests', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'engagement', label: 'Engagement & LMS', icon: Activity },
    { id: 'history', label: 'Status Timeline', icon: History },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Student Header Card */}
      <ProfileHeader student={student} />

      {/* 2. Tab Navigation Bar */}
      <div className="border-b border-slate-200 flex items-center gap-1 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-slate-900 text-slate-900 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Section D: Contributing Factors (Highest Priority for Explainability) */}
          <ContributingFactorsSection
            factors={contributingFactors}
            currentStatus={student.currentStatus}
            riskScore={student.riskScore}
          />

          {/* Section E: Performance & Rank History */}
          <PerformanceRankHistorySection
            student={student}
            rankHistory={rankHistory}
          />

          {/* Section A: Academic Performance */}
          <AcademicPerformanceSection
            records={academicRecords}
            overallScore={student.academicScore}
          />

          {/* Side by side: Attendance & Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceSection
              records={attendanceRecords}
              attendancePercentage={student.attendancePercentage}
            />
            <EngagementSection engagement={engagement} />
          </div>

          {/* Section F: Status History */}
          <StatusHistorySection transitions={statusHistory} />

          {/* Section G: Data Availability */}
          <DataAvailabilitySection student={student} />
        </div>
      )}

      {activeTab === 'explainability' && (
        <div className="space-y-6">
          <ContributingFactorsSection
            factors={contributingFactors}
            currentStatus={student.currentStatus}
            riskScore={student.riskScore}
          />
          <DataAvailabilitySection student={student} />
        </div>
      )}

      {activeTab === 'ranking' && (
        <div className="space-y-6">
          <PerformanceRankHistorySection
            student={student}
            rankHistory={rankHistory}
          />
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="space-y-6">
          <AcademicPerformanceSection
            records={academicRecords}
            overallScore={student.academicScore}
          />
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <AttendanceSection
            records={attendanceRecords}
            attendancePercentage={student.attendancePercentage}
          />
        </div>
      )}

      {activeTab === 'engagement' && (
        <div className="space-y-6">
          <EngagementSection engagement={engagement} />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <StatusHistorySection transitions={statusHistory} />
        </div>
      )}

    </div>
  );
};
