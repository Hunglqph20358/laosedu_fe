export interface ParentInfo {
  schedule?:      Schedule;
  student?:       Student;
  attendance?:    Attendance;
  notifications?: Notifications;
}

export interface Attendance {
  recordNo?:                            null;
  messageStr?:                          null;
  fieldErr?:                            any[];
  messageErr?:                          any[];
  parentCode?:                          null;
  currentYear?:                         null;
  currentClassCode?:                    null;
  dayAndCheckDateOfMonth?:              null;
  studentCodes?:                        null;
  fromDate?:                            Date;
  toDate?:                              Date;
  month?:                               null;
  years?:                               null;
  semester?:                            null;
  lstData?:                             null;
  titleHead?:                           null;
  currentPage?:                         number;
  pageSize?:                            number;
  totalRecord?:                         number;
  studentCode?:                         string;
  studentName?:                         string;
  lstAttendanceDetailDTOByStudentCode?: LstAttendanceDetailDTOByStudentCode[];
  holidays?:                            Date[];
  totalCount?:                          number;
  totalRestByReason?:                   number;
  totalRestNoReason?:                   number;
  totalGoingSchool?:                    number;
}

export interface LstAttendanceDetailDTOByStudentCode {
  id?:          null;
  date?:        string;
  checkDate?:   any;
  parentCode?:  null;
  yearOfDate?:  null;
  studentName?: null;
  studentCode?: null;
  dateOfMonth?: number;
}

export interface Notifications {
  schoolYear?:               string;
  keySearch?:                null;
  objectReceivedType?:       null;
  lstReceived?:              null;
  totalReceivedMail?:        number;
  lstSentMail?:              null;
  totalSentMail?:            number;
  lstReceivedStudent?:       LstReceivedStudent[];
  totalReceivedMailStudent?: number;
  pathFileDownload?:         null;
}

export interface LstReceivedStudent {
  contactId?:       number;
  sentDate?:        string;
  title?:           string;
  contentSms?:      null;
  isContactParent?: null;
  senderAvatar?:    string;
  senderAvatarByte?: string;
  senderName?:      string;
  sendType?:        null;
  receivedCode?:    null;
  pathFile?:        null;
  lstReceiver?:     null;
  contentWeb?:      string;
  contentWebHome?: string;
  detailId?:        number;
  isOpen?:          number;
}


export interface Schedule {
  date?: string;
  data?: Datum[];
}

export interface Datum {
  lessonCode?: string;
  lessonName?: string;
  morning?:    Afternoon | null;
  afternoon?:  Afternoon | null;
}

export interface Afternoon {
  teacher?: string;
  subject?: string;
}

export interface Student {
  id?:                           number;
  createdTime?:                  Date;
  createdName?:                  string;
  updateTime?:                   null;
  updateName?:                   string;
  fullName?:                     string;
  code?:                         string;
  deptId?:                       number;
  startDate?:                    Date;
  phone?:                        string;
  email?:                        string;
  birthDay?:                     null;
  religion?:                     null;
  homeTown?:                     null;
  nation?:                       null;
  permanentAddress?:             null;
  temporaryAddress?:             null;
  socialInsuranceNumber?:        null;
  identityCard?:                 null;
  issuedAddress?:                null;
  issuedDate?:                   null;
  sex?:                          number;
  avatar?:                       null;
  avatarByte?:                    null;
  electFormat?:                  number;
  graduationType?:               number;
  contactId?:                    null;
  classRoomId?:                  null;
  status?:                       number;
  deptName?:                     string;
  className?:                    string;
  trainingSystem?:               number;
  totalSuccess?:                 null;
  years?:                        null;
  gradeName?:                    string;
  idContact1?:                   null;
  idContact2?:                   null;
  relationShip1?:                null;
  relationShip2?:                null;
  fullNameContact1?:             null;
  fullNameContact2?:             null;
  phoneContact1?:                null;
  phoneContact2?:                null;
  lineSuccess?:                  null;
  classRoomCode?:                string;
  gradeId?:                      number;
  gradeCode?:                    string;
  teacher?:                      string;
  phoneNumberTeacher?:           string;
  teacherId?:                    number;
  academicAbility?:              null;
  gradebookCode?:                null;
  avgScoreYear?:                 null;
  rateable?:                     boolean;
  academicName?:                 null;
  conductName?:                  null;
  competitionTitleName?:         null;
  attendanceP?:                  null;
  attendanceK?:                  null;
  rank?:                         null;
  gradebookSubjectsDetailsDTOS?: null;
  totalFail?:                    null;
  filePathError?:                null;
  listError?:                    null;
}
