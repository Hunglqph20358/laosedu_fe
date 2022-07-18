export interface TransferStudent {
  id: number
  code: string
  schoolYear: string
  gradeLevel: number
  gradeCode: string
  classCode: string
  className: string
  competitionTitle: string
  details: Details
  assess: Assess
  assessDetails: AssessDetails
}

export interface Details {
  id: number
  code: string
  currentSchoolYear: string
  currentClassCode: string
  studentCode: string
  studentName: string
  academicAbility: string
  conduct: string
  status: number
  newClassCode: string
  newSchoolYear: string
  newGradeLevel: number
  parentCode: string
}

export interface Assess {
  id: any
  code: string
  classCode: string
  semester: string
  schoolYear: string
  createDate: any
  creator: string
  updateDate: any
  updater: string
}

export interface AssessDetails {
  id: any
  studentCode: string
  numberOff: number
  numberOffAllowed: number
  academicAbility: string
  conduct: string
  competitionTitle: string
  parentCode: string
}
