export class JobTransferHistoryModel{
  id: number;
  teacherCode: string;
  oldDepartmentId: number;
  oldPosition: string;
  oldDeptId: number;
  transferDate: Date;
  type: number;
  newDeptId: number;
  newDepartmentId: number;
  reason: string;
  description: string;
  oldSubject: string;
  newSubject: string;
  code: string;
  dateEnd: Date;
  dateTransfer: Date;
}
