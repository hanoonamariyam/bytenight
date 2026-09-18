import math
from typing import Dict, Any, List, Tuple

class BehaviorAnalyzer:
    """
    Analyzes temporal pose keypoints and joint angles to classify classroom behavior.
    Categories: ATTENTIVE, TALKING, PHONE_USAGE, SLEEPING, UNKNOWN.
    """

    def analyze_frame_keypoints(self, keypoints: Dict[str, Any]) -> Tuple[str, float, List[str]]:
        if not keypoints or keypoints.get("confidence", 0.0) < 0.40:
            return "UNKNOWN", 0.0, ["Insufficient detection confidence"]

        confidence = keypoints.get("confidence", 0.6)
        nose = keypoints.get("nose")
        l_sh = keypoints.get("left_shoulder")
        r_sh = keypoints.get("right_shoulder")
        l_wr = keypoints.get("left_wrist")
        r_wr = keypoints.get("right_wrist")

        if not (nose and l_sh and r_sh):
            return "UNKNOWN", 0.0, ["Essential upper-body landmarks missing"]

        indicators = []
        
        # 1. Shoulder center and width
        shoulder_center_x = (l_sh[0] + r_sh[0]) / 2.0
        shoulder_center_y = (l_sh[1] + r_sh[1]) / 2.0
        shoulder_width = max(1.0, abs(r_sh[0] - l_sh[0]))
        
        # 2. Head vertical drop (relative to shoulder center)
        head_drop_ratio = (shoulder_center_y - nose[1]) / shoulder_width

        # 3. Head lateral turn (yaw angle proxy)
        head_lateral_offset = abs(nose[0] - shoulder_center_x) / shoulder_width

        # 4. Wrist proximity to face/chest (phone usage proxy)
        wrist_raised = False
        if l_wr and r_wr:
            wrist_y = min(l_wr[1], r_wr[1])
            if wrist_y < shoulder_center_y + 0.3 * shoulder_width:
                wrist_raised = True

        # Classification Logic
        # Case A: SLEEPING (head slump, continuously low)
        if head_drop_ratio < 0.20:
            indicators.append("Head position lowered significantly below active posture threshold")
            indicators.append("Slumped upper-body posture detected")
            return "SLEEPING", round(min(0.92, confidence + 0.1), 2), indicators

        # Case B: PHONE USAGE (wrist raised to chest + head looking down)
        if wrist_raised and head_drop_ratio < 0.45:
            indicators.append("Hand proximity to chest/desk area observed")
            indicators.append("Downwards head orientation detected")
            return "PHONE_USAGE", round(min(0.85, confidence), 2), indicators

        # Case C: TALKING (visual talking indicator: significant lateral head turn)
        if head_lateral_offset > 0.35:
            indicators.append("Lateral head orientation facing peer detected")
            indicators.append("Visual talking indicator observed (non-definitive speech)")
            return "TALKING", round(min(0.82, confidence), 2), indicators

        # Case D: ATTENTIVE (upright posture, forward-facing orientation)
        if head_drop_ratio >= 0.40 and head_lateral_offset <= 0.25:
            indicators.append("Upright classroom posture verified")
            indicators.append("Forward-facing gaze orientation consistent with board attention")
            return "ATTENTIVE", round(min(0.95, confidence + 0.15), 2), indicators

        # Default fallback
        return "UNKNOWN", 0.45, ["Pose variation could not be classified with sufficient confidence"]

    def aggregate_temporal_behavior(self, frame_classifications: List[Tuple[str, float, List[str]]]) -> Dict[str, Any]:
        """
        Aggregates frame classifications into classroom behavior summary.
        """
        if not frame_classifications:
            return {
                "dominant_behavior": "UNKNOWN",
                "average_confidence": 0.0,
                "counts": {"attentive": 0, "talking": 0, "phone_usage": 0, "sleeping": 0, "unknown": 0},
                "engagement_index": 75.0, # Neutral baseline
                "data_quality": "DATA_UNAVAILABLE"
            }

        counts = {"attentive": 0, "talking": 0, "phone_usage": 0, "sleeping": 0, "unknown": 0}
        confidences = []

        for behavior, conf, _ in frame_classifications:
            key = behavior.lower()
            if key in counts:
                counts[key] += 1
            else:
                counts["unknown"] += 1
            confidences.append(conf)

        total = len(frame_classifications)
        attentive_ratio = counts["attentive"] / total
        talking_ratio = counts["talking"] / total
        phone_ratio = counts["phone_usage"] / total
        sleeping_ratio = counts["sleeping"] / total

        # Engagement index (0-100)
        # Attentive contributes positively; neutral unknown does not severely penalize
        engagement_index = (attentive_ratio * 95.0) + (talking_ratio * 55.0) + (phone_ratio * 40.0) + (sleeping_ratio * 20.0) + (counts["unknown"] / total * 75.0)

        # Dominant behavior
        dominant = max(counts, key=counts.get).upper()

        return {
            "dominant_behavior": dominant,
            "average_confidence": round(float(sum(confidences) / total), 2),
            "counts": counts,
            "engagement_index": round(engagement_index, 1),
            "data_quality": "VALID" if counts["unknown"] < total * 0.5 else "LOW_CONFIDENCE"
        }

behavior_analyzer = BehaviorAnalyzer()
