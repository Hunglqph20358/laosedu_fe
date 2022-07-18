export class Teacher {
id: number;
  createdTime: string;
  createdName: string;
  updateTime: string;
  updateName: string;
  fullName: string;
  code: string;
  deptId: number;// khoa
  deptName: string;
  subjectParentId: number;// to bo mon
  position: Array<string> = [];
  positionName: string;
  startDate: any;// ngay vao truong
  contractType: number;// loai hop dong
  contractTypeStr: string;
  phone: string;
  email: string;
  birthDay: string;
  religion: string;// ton giao
  homeTown: string;// que
  nation: string;//dan toc
  permanentAddress: string;// dc thuong tru
  temporaryAddress: string;// tam tru
  socialInsuranceNumber: string;// so bao hiem xh
  identityCard: string;// cmt
  issuedAddress: string;// noi cap chung minh thu
  issuedDate: string;// ngay cap cmt
  marriageStatus: number;// tinh trang hon nhan
  sex: number;
  sexStr: string;
  partyMember: number;
  unionMember: number;
  dateOfPartyMember: string;// ngay ket nap dang
  dateOfUnionMember: string;// ngay ket nap doan
  adrOfPartyMember: string;// noi ket nap dang
  adrOfUnionMember: string;// noiket nap doan
  specializeLevel: number;
  avatar: string;
  certificatePath: string;
  status: number;
  statusStr: string;
  textSearch: string;

  dateStart: any;
  dayBirth: any;
  dateIssued: any;
  datePartyMember: any;
  dateUnionMember: any;

  subjectParentName: string;
  unitName: string;
  marriageStatusStr: string;
  specializeLevels: any [];
  specializeLevelsDtos: any [];
  foreignLanguageDTOList: [];
  jobTransferHistories: any[];
  salaryAllowancesList: any[];
  rewardDisciplinesBonus: any[];
  rewardDisciplinesPunish: any[];
  avatarByte: [];
  diplomaByte: [];
  certificateBytes: [];
  certificatePathList: [];
  unitCode: string;
  deptCode: string;
  subjectParentCode: string;
  unitId: number;
  deptParentId: number;
  contractName: string;
  specializeLevelStr: string;
}
export class SpecializeLevel {// bang cap
  id: number;
  createdTime: any;
  createdName: string;
  updateTime: any;
  updateName: string;
  trainingPlaces: string;
  specialized: string;
  teacherId: number;
  sysEdu: number;
  degreePath: string;
  graduationYear: string;
  levelType: number;
  tranningCountry: string;
  diplomaByte: [];
}
export class ForeignLanguage {// ngoai ngu
  id: number;
  createdTime: any;
  createdName: string;
  updateTime: any;
  updateName: string;
  languageName: string;
  level: string;
  teacherId: number;
}
export class JobTransferHistoryOut {// lich su lam viec
  id: number;
  teacherCode: string;
  code: string;
  oldPosition: string;
  startDate: any;
  endDate: any;
  description: string;
  oldDept: string;
  dateStart:Date;
  dateEndDate:Date;
}
export class AddTeacherDTO{
  teacherDTO:Teacher;
  specializeLevelList: Array<SpecializeLevel>;
  jobTransferHistoryOutDTOList: Array<JobTransferHistoryOut>
  foreignLanguageDTOList: Array<ForeignLanguage>
  positionList: Array<string>
}
