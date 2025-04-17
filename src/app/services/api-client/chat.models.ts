export interface AnalyseResultResponseDto {
  classification: string;
  strongPoints: string[];
  pointsToImprove: PointToImprove[];
  resumeSuggestions: string[];
  matchScore: string;
  createdAt: string;
  recruiterView: RecruiterView;
}

export interface RecruiterView {
  alignmentView: string;
  misalignmentView: string;
  attentionView: string;
}

export interface PointToImprove {
  description: string;
  studyRecommendation: string;
}
