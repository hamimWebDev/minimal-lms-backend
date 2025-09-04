export interface IEnrollmentRequest {
  userId: string;
  courseId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestMessage?: string;
  adminResponse?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEnrollmentRequestFilters {
  status?: 'pending' | 'approved' | 'rejected';
  userId?: string;
  courseId?: string;
  search?: string;
}
