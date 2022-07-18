import {environment} from "../../../environments/environment";


export class MenuConfig {
  roleParam = environment.ROLE;
  ADMIN = this.roleParam.ADMIN;
  GV_CN = this.roleParam.GV_CN;
  GV_BM = this.roleParam.GV_BM;
  HP = this.roleParam.HP;
  HT = this.roleParam.HT;
  PH = this.roleParam.PH;
  TK = this.roleParam.TK;
  public defaults: any = {
    aside: {
      self: {},
      items: [
        {
          title: 'Nhà trường',
          // root: true,
          icon: 'flaticon-dashboard',
          translate: 'MENU.SCHOOL.TITLE',
          iconSvg: 'truonghoc.svg',
          permission: [this.ADMIN, this.HT],
          submenu: [
            {
              title: 'Cấu hình trường học',
              page: '/system/school/configuration',
              translate: 'MENU.SCHOOL.CONFIGUARATION',
              // permission: [this.ADMIN, this.BGH, this.HP, this.HT],
            },
            {
              title: 'Cấu hình năm học',
              page: '/system/school/school-year',
              translate: 'MENU.SCHOOL.SCHOOL_YEAR',
              // permission: [this.ADMIN, this.BGH, this.HP, this.HT, this.GV, this.TK],
            },
            {
              title: 'Môn học thuộc trường',
              page: '/system/school/school-subject',
              translate: 'MENU.SCHOOL.SCHOOL_SUBJECT',
              // permission: [this.ADMIN, this.BGH, this.HP, this.HT, this.GV, this.TK],
            },
            {
              title: 'Quản lý lớp học',
              page: '/system/school/class-room',
              translate: 'MENU.SCHOOL.CLASS_ROOM',
              // permission: [this.ADMIN, this.BGH, this.HP, this.HT, this.GV, this.TK],
            },
            {
              title: 'Khai báo môn học cho lớp',
              page: '/system/school/subject-declaration',
              translate: 'MENU.SCHOOL.SUBJECT_DECLARATION',
              // permission: [this.ADMIN, this.BGH, this.HP, this.HT, this.GV, this.TK],
            },
            {
              title: 'Xếp thời khóa biểu',
              page: '/system/school/schedule-timetable',
              translate: 'MENU.SCHOOL.SCHEDULE_TIMETABLE',
              // permission: [this.ADMIN, this.BGH, this.HP, this.HT, this.GV, this.TK],
            },
          ],
        },
        {
          title: 'Cấu hình hệ thống',
          root: true,
          icon: 'flaticon-dashboard',
          translate: 'MENU.SYSTEM.TITLE',
          page: '',
          iconSvg: 'cauhinhht.svg',
          permission: [this.ADMIN, this.HT],
          submenu: [
            {
              title: 'Cấu hình bảng điểm',
              page: '/system/system-configuration/scoreboard',
              translate: 'MENU.SYSTEM.SCOREBOARD',
            },
            {
              title: 'Cấu hình khóa nhập điểm',
              page: '/system/system-configuration/config-point-lock',
              translate: 'MENU.SYSTEM.CONFIG_POINT_LOCK',
            },
            {
              title: 'Quản lý liên lạc',
              page: '/system/system-configuration/manage-contact',
              translate: 'MENU.SYSTEM.MANAGE_CONTACT',
            },
          ],
        },
        {
          title: 'Giáo viên',
          root: true,
          icon: 'flaticon-dashboard',
          translate: 'MENU.TEACHER.TITLE',
          iconSvg: 'giaovien.svg',
          permission: [this.ADMIN, this.GV_BM, this.GV_CN, this.HT, this.HP, this.TK],
          submenu: [
            {
              title: 'Quản lý cán bộ giáo viên',
              page: '/system/teacher/teacher-management',
              permission: [this.ADMIN, this.HT, this.HP, this.TK],
              translate: 'MENU.TEACHER.MANAGEMENT',
            },
            {
              title: 'Đánh giá xếp loại giáo viên',
              page: '/system/teacher/teacher-ratings',
              permission: [this.ADMIN, this.HT, this.HP, this.TK, this.GV_BM, this.GV_CN],
              class: 'hidden-itemmenu',
              translate: 'MENU.TEACHER.RATINGS',
            },
            {
              title: 'Phân công giảng dạy',
              page: '/system/teacher/teaching-assignment',
              permission: [this.ADMIN, this.HT],
              translate: 'MENU.TEACHER.ASSIGNMENT',
            },
            {
              title: 'Thời khoá biểu lịch dạy',
              page: '/system/teacher/teaching-timetable',
              permission: [this.ADMIN, this.HT, this.HP, this.TK, this.GV_BM, this.GV_CN],
              translate: 'MENU.TEACHER.TIMETABLE',
            },
          ]
        },
        {
          title: 'Học sinh',
          root: true,
          icon: 'flaticon-dashboard',
          translate: 'MENU.STUDENT.TITLE',
          iconSvg: 'hocsinh.svg',
          permission: [this.ADMIN, this.GV_CN, this.GV_BM, this.HT, this.HP, this.TK],
          submenu: [
            {
              title: 'Quản lý học sinh',
              page: '/system/student/student-management',
              permission: [this.ADMIN, this.GV_CN, this.GV_BM, this.HT, this.HP, this.TK],
              translate: 'MENU.STUDENT.MANAGEMENT',
            },
            {
              title: 'Điểm danh chuyên cần',
              page: '/system/student/attendance-student',
              permission: [this.ADMIN, this.GV_CN, this.HT],
              translate: 'MENU.STUDENT.ATTENDANCE',
            },
            {
              title: 'Sổ điểm',
              page: '/system/student/students-gradebook',
              permission: [this.ADMIN, this.GV_CN, this.HT, this.GV_BM],
              translate: 'MENU.STUDENT.GRADEBOOK',
            },
            {
              title: 'Đánh giá học lực',
              permission: [this.ADMIN, this.GV_CN, this.HT],
              page: '/system/student/academic-abilities',
              translate: 'MENU.STUDENT.ACADEMIC_ASSESSMENT',
            },
            {
              title: 'Đánh giá hạnh kiểm',
              permission: [this.ADMIN, this.GV_CN, this.HT],
              page: '/system/student/conduct-assessment',
              translate: 'MENU.STUDENT.CONDUCT_ASSESSMENT',

            },
            {
              title: 'Kết chuyển học sinh',
              permission: [this.ADMIN, this.HT],
              page: '/system/student/transfer-students',
              translate: 'MENU.STUDENT.TRANSFER',
            },
          ]
        },
        {
          title: 'Báo cáo kết quả thi đua',
          root: true,
          icon: 'flaticon-dashboard',
          translate: 'MENU.REPORT',
          iconSvg: 'congvan-vb.svg',
          permission: [this.ADMIN, this.HT, this.HP, this.GV_BM, this.GV_CN, this.TK],
          submenu: [
            {
              title: 'Toàn trường',
              page: '/system/reports/school-report',
              translate: 'MENU.REPORT_SCHOOL.TITLE',
              permission: [this.ADMIN, this.HT, this.HP, this.GV_BM, this.GV_CN, this.TK],
            },
            {
              title: 'Theo từng lớp',
              page: '/system/reports/class-report',
              translate: 'MENU.REPORT_SCHOOL.BY_CLASS',
              permission: [this.ADMIN, this.HT, this.HP, this.GV_BM, this.GV_CN, this.TK],
            },]
        },
        {
          title: 'Công văn/Văn bản',
          root: true,
          icon: 'flaticon-dashboard',
          translate: 'MENU.OFFICIAL_LETTER_DOCUMENT.TITLE',
          iconSvg: 'congvan-vb.svg',
          permission: [this.ADMIN, this.HT, this.HP, this.GV_BM, this.GV_CN, this.TK],
          submenu: [
            {
              title: 'Quản lý công văn, văn bản',
              page: '/system/official-letter-document',
            translate: 'MENU.OFFICIAL_LETTER_DOCUMENT.MANAGEMENT',
            permission: [this.ADMIN, this.HT, this.HP, this.GV_BM, this.GV_CN, this.TK],
            },]
        },
        {
          title: 'Liên lạc',
          root: true,
          icon: 'flaticon-dashboard',
          translate: 'MENU.CONTACT.TITLE',
          permission: [this.ADMIN, this.GV_CN, this.HT, this.HP, this.TK, this.GV_BM],
          iconSvg: 'lienlac.svg',
          submenu: [
            {
              title: 'Liên lạc CBGV',
              translate: 'MENU.CONTACT.TEACHER',
              page: '/system/contact/send-mail',
              // translate: 'MENU.CONTACT.TEACHER',
              root: false,
              permission: [this.ADMIN,  this.HT],
              submenu: [
                {
                  title: 'DS nhóm liên lạc',
                  translate: 'MENU.CONTACT.TEACHER_GROUP',
                  // translate: 'MENU.CONTACT.TEACHER_GROUP',
                  page: '/system/contact/contact-group',
                  permission: [this.ADMIN,  this.HT],
                },
              ]
            },
            {
              title: 'Liên lạc PHHS',
              // translate: 'Liên lạc PHHS',
              root: false,
              page: '/system/contact-parents/send-mail',
              translate: 'MENU.CONTACT.PARENT_STUDENT',
              permission: [this.ADMIN, this.GV_CN, this.HT],
              submenu: [
                {
                  title: 'DS nhóm liên lạc',
                  // translate: 'DS nhóm liên lạc',
                  translate: 'MENU.CONTACT.PARENT_STUDENT_GROUP',
                  page: '/system/contact-parents/contact-group',
                  permission: [this.ADMIN, this.GV_CN, this.HT],
                },
              ]
            },
            {
              title: 'Hộp thư',
              page: '/system/school/inbox-admin',
              translate: 'MENU.SCHOOL.INBOX_STUDENT',
              permission: [this.ADMIN],
            },
            {
              title: 'Hộp thư',
              page: '/system/school/inbox-teacher',
              translate: 'MENU.SCHOOL.INBOX_STUDENT',
              permission: [this.HT, this.GV_CN],
            },
            {
              title: 'Hộp thư',
              page: '/system/school/inbox-other',
              translate: 'MENU.SCHOOL.INBOX_STUDENT',
              permission: [this.HP, this.TK, this.GV_BM],
            },
          ]
        },
        // xu ly giao dien chuyen can - sile phu huynh
        {
          title: 'Trang chủ',
          icon: 'flaticon-dashboard',
          translate: 'MENU.PARENTS.HOME',
          // permission: [this.PH],
          page: '/system/parents/home',
          iconSvg: 'home.svg',
          permission: [this.PH],
        },
        {
          title: 'Hồ sơ học sinh',
          page: '/system/parents/student-profile',
          translate: 'MENU.PARENTS.STUDENT_PROFILE',
          iconSvg: 'student-profile.svg',
          permission: [this.PH],
        },
        {
          title: 'Thời khóa biểu',
          page: '/system/school/view-timetable',
          translate: 'MENU.SCHOOL.VIEW_TIMETABLE',
          iconSvg: 'thoikhoabieu.svg',
          permission: [this.PH],
        },
        {
          title: 'Hộp thư',
          page: '/system/school/inbox-student',
          translate: 'MENU.SCHOOL.INBOX_STUDENT',
          iconSvg: 'thoikhoabieu.svg',
          permission: [this.PH],
        },
        {
          title: 'Thông tin chuyên cần',
          // root: true,
          icon: 'flaticon-dashboard',
          translate: 'MENU.PARENTS.EXPERTS_NEED',
          permission: [this.PH],
          page: '/system/diligence',
          iconSvg: 'chuyencan.svg',
        },
      ],
    },
  };

  public get configs(): any {
    return this.defaults;
  }
}
