import { apiRequest, simulateLatency, USE_MOCK_API } from './api';

export interface VisionSessionData {
  classroomId: string;
  classroomName: string;
  cameraStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  detectionFps: number;
  activeStudentsDetected: number;
  averageEngagementIndex: number;
  confidenceScore: number;
  lightingQuality: 'OPTIMAL' | 'FAIR' | 'POOR';
  frameResolution: string;
  dataAvailabilityNote: string;
  simulatedDetections: Array<{
    id: string;
    deskLabel: string;
    studentName: string;
    headPoseStatus: 'ACTIVE_ATTENTION' | 'LOOKING_DOWN' | 'LOOKING_AWAY';
    presenceConfidence: number;
    engagementScore: number;
  }>;
}

class VisionService {
  // Corresponds to GET /api/vision/status
  async getVisionStatus(): Promise<VisionSessionData> {
    if (!USE_MOCK_API) {
      try {
        return await apiRequest<VisionSessionData>('/vision/status');
      } catch (err) {
        console.warn('Live API error fetching vision status, falling back to mock:', err);
      }
    }

    await simulateLatency(250);

    return {
      classroomId: 'cls_cs101_hall_b',
      classroomName: 'Lecture Hall B — CS101 Section A',
      cameraStatus: 'ONLINE',
      detectionFps: 24,
      activeStudentsDetected: 14,
      averageEngagementIndex: 78.4,
      confidenceScore: 0.92,
      lightingQuality: 'OPTIMAL',
      frameResolution: '1920x1080 (HD)',
      dataAvailabilityNote: 'Vision signals serve exclusively as auxiliary, non-punitive support indicators. Incomplete or offline streams do not penalize student academic risk evaluation.',
      simulatedDetections: [
        { id: 'det_1', deskLabel: 'Row 1, Seat 1', studentName: 'Sophia Al-Mansoor', headPoseStatus: 'ACTIVE_ATTENTION', presenceConfidence: 0.98, engagementScore: 94 },
        { id: 'det_2', deskLabel: 'Row 1, Seat 2', studentName: 'Liam Chen', headPoseStatus: 'ACTIVE_ATTENTION', presenceConfidence: 0.85, engagementScore: 89 },
        { id: 'det_3', deskLabel: 'Row 1, Seat 3', studentName: 'Ananya Sharma', headPoseStatus: 'ACTIVE_ATTENTION', presenceConfidence: 0.96, engagementScore: 91 },
        { id: 'det_4', deskLabel: 'Row 2, Seat 1', studentName: 'Marcus Vance', headPoseStatus: 'ACTIVE_ATTENTION', presenceConfidence: 0.94, engagementScore: 86 },
        { id: 'det_5', deskLabel: 'Row 2, Seat 2', studentName: 'Aria Patel', headPoseStatus: 'LOOKING_DOWN', presenceConfidence: 0.91, engagementScore: 72 },
        { id: 'det_6', deskLabel: 'Row 2, Seat 3', studentName: 'Chloe Bennett', headPoseStatus: 'LOOKING_AWAY', presenceConfidence: 0.88, engagementScore: 68 },
        { id: 'det_7', deskLabel: 'Row 3, Seat 2', studentName: 'Jane Doe', headPoseStatus: 'LOOKING_DOWN', presenceConfidence: 0.82, engagementScore: 54 }
      ]
    };
  }

  // Corresponds to POST /api/vision/analyze
  async analyzeVideo(file: File): Promise<VisionAnalyzeResponse> {
    if (!USE_MOCK_API) {
      const formData = new FormData();
      formData.append('file', file);
      return await apiRequest<VisionAnalyzeResponse>('/vision/analyze', {
        method: 'POST',
        body: formData,
      });
    }

    await simulateLatency(800);
    return {
      video_id: 'vid_sim_' + Math.random().toString(36).substring(7),
      status: 'completed',
      students_detected: 5,
      analysis_duration: '1.2s',
      data_quality: 'VALID',
      confidence: 0.88,
      behaviour_summary: {
        attentive: 2,
        talking: 1,
        phone_usage: 1,
        sleeping: 0,
        unknown: 1
      },
      students: [
        { student_id: 'person_zone_r1_s1', desk_label: 'Row 1, Seat 1', behaviour: 'ATTENTIVE', confidence: 0.94, indicators: ['Upright posture verified', 'Forward-facing gaze detected'] },
        { student_id: 'person_zone_r1_s2', desk_label: 'Row 1, Seat 2', behaviour: 'ATTENTIVE', confidence: 0.89, indicators: ['Upright classroom posture verified'] },
        { student_id: 'person_zone_r2_s1', desk_label: 'Row 2, Seat 1', behaviour: 'TALKING', confidence: 0.82, indicators: ['Lateral head orientation observed towards adjacent seat'] },
        { student_id: 'person_zone_r2_s2', desk_label: 'Row 2, Seat 2', behaviour: 'PHONE_USAGE', confidence: 0.84, indicators: ['Hand proximity to desk with downward gaze angle'] },
        { student_id: 'person_zone_r3_s1', desk_label: 'Row 3, Seat 1', behaviour: 'UNKNOWN', confidence: 0.45, indicators: ['Partial occlusion by lecture podium; low confidence'] }
      ],
      processing_warnings: []
    };
  }
}

export interface VisionAnalyzeResponse {
  video_id: string;
  status: string;
  students_detected: number;
  analysis_duration: string;
  data_quality: string;
  confidence: float;
  behaviour_summary: {
    attentive: number;
    talking: number;
    phone_usage: number;
    sleeping: number;
    unknown: number;
  };
  students: Array<{
    student_id: string;
    desk_label?: string;
    behaviour: string;
    confidence: number;
    indicators: string[];
  }>;
  processing_warnings: string[];
}

type float = number;

export const visionService = new VisionService();

