export const PAGE_SIZE = 10;

export const ROLES = ["ROLE_ADMIN", "ROLE_GVCN", "ROLE_GVBM", "ROLE_TK", "ROLE_HP", "ROLE_HT", "ROLE_USER"];

export const ROLES_STUDENT_MANAGEMENT_FULL = ["ROLE_ADMIN", "ROLE_GVCN", "ROLE_HT"];
export const ROLES_STUDENT_MANAGEMENT = ["ROLE_GVBM", "ROLE_TK", "ROLE_HP"];

export const ROLES_TEACHER_MANAGEMENT = ["ROLE_TK", "ROLE_HP"];

export const EXTENSION_IMAGE = [".png", ".jpg", ".PNG", ".JPG"]

export const MAX_LENGTH_500 = 500
export const MAX_LENGTH_250 = 250
export const MAX_FILE_SIZE_UPLOAD = 5242880 // 5MB

export const KEYCODE_0 = 48
export const KEYCODE_9 = 57
export const KEYCODE_BACKSPACE = 8

export const TABLE_CELL_STYLE = {
  'font-weight': '500',
  'font-size': '12px',
  'font-family': 'Inter',
  'font-style': 'normal',
  'align-items': 'center',
  display: 'flex',
  displayce: 'nowrap',
  'text-overflow': 'ellipsis',
  overflow: 'hidden',
  padding: '10px',
  height: '100%',
}

export let NO_ROW_GRID_TEMPLATE = `
  <div>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.69873 25H30.2467V48H7.45215C6.98712 48 6.54113 47.8136 6.2123 47.4818C5.88347 47.15 5.69873 46.7 5.69873 46.2308V25Z" fill="#C1C4D6"/>
      <path d="M30.2466 25H42.5206V46.2308C42.5206 46.7 42.3358 47.15 42.007 47.4818C41.6782 47.8136 41.2322 48 40.7671 48H30.2466V25Z" fill="#8F95B2"/>
      <path d="M30.2466 25L35.726 31.1923H48L42.5206 25H30.2466Z" fill="#D8DAE5"/>
      <path d="M30.4658 25L24.9863 31.1923H0L5.47945 25H30.4658Z" fill="#D8DAE5"/>
      <path d="M24 20C29.5228 20 34 15.5228 34 10C34 4.47715 29.5228 0 24 0C18.4772 0 14 4.47715 14 10C14 15.5228 18.4772 20 24 20Z" fill="#C1C4D6"/>
      <path d="M23.7475 6.84449L24.0657 7.3131L24.3827 6.84449C24.5962 6.62203 24.8523 6.44481 25.1358 6.32338C25.4192 6.20196 25.7242 6.13881 26.0325 6.13771C26.3409 6.13661 26.6463 6.19756 26.9306 6.31696C27.2149 6.43635 27.4723 6.61173 27.6874 6.83266L27.7514 6.89359C28.2155 7.3479 28.4821 7.9666 28.4937 8.61593C28.5053 9.26526 28.2608 9.89307 27.8132 10.3636L27.7514 10.4267L24.0657 14.0274L20.4712 10.4267C20.2361 10.1965 20.0493 9.92169 19.9217 9.61834C19.7942 9.31499 19.7285 8.98923 19.7285 8.66017C19.7285 8.3311 19.7942 8.00534 19.9217 7.70199C20.0493 7.39864 20.2361 7.1238 20.4712 6.89359C20.6743 6.66067 20.9242 6.4731 21.2045 6.34306C21.4848 6.21301 21.7894 6.14342 22.0984 6.13879C22.4074 6.13416 22.7139 6.1946 22.998 6.31618C23.2821 6.43776 23.5375 6.61777 23.7475 6.84449Z" fill="white"/>
      <defs>
      <clipPath id="clip0">
      <rect width="48" height="48" fill="white"/>
      </clipPath>
      </defs>
    </svg>
    <p style='margin-top: 6px;'>{{field}}</p>
  </div>
`

export const REGEX_VIETNAMESE = /[ỹáàạảãâấầậẩẫăắằặẳẵÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴéèẹẻẽêếềệểễÉÈẸẺẼÊẾỀỆỂỄóòọỏõôốồộổỗơớờợởỡÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠúùụủũưứừựửữÚÙỤỦŨƯỨỪỰỬỮíìịỉĩÍÌỊỈĨđĐýỳỵỷỹÝỲỴỶỸ]/

export const STUDENTS = {
  STATUS: [
    { name: 'CONSTANT.STUDENT.STATUS.STUDYING', id: 0, color: '#52BD94'},
    { name: 'CONSTANT.STUDENT.STATUS.RESERVE', id: 1, color: '#696F8C' },
    { name: 'CONSTANT.STUDENT.STATUS.LEAVE', id: 2, color: '#F26522' },
    { name: 'CONSTANT.STUDENT.STATUS.TRANSFERED', id: 3, color: '#D14343' },
  ],
  TRAINING_SYSTEM: [
    { name: 'CONSTANT.STUDENT.TRAINING_SYSTEM.FORMAL', id: 1 },
    { name: 'CONSTANT.STUDENT.TRAINING_SYSTEM.IN_OFFICE', id: 2 },
    { name: 'CONSTANT.STUDENT.TRAINING_SYSTEM.WORK_STUDY', id: 3 },
    { name: 'CONSTANT.STUDENT.TRAINING_SYSTEM.CONNECTION', id: 4 },
    { name: 'CONSTANT.STUDENT.TRAINING_SYSTEM.VOCATIONAL', id: 5 },
    { name: 'CONSTANT.STUDENT.TRAINING_SYSTEM.COOPERATION', id: 6 },
  ],
  SEX: [
    { name: 'COMMON.MALE', id: 0 },
    { name: 'COMMON.FEMALE', id: 1 },
  ],
  ELECT_FORMAT: [
    { name: 'CONSTANT.STUDENT.ELECT_FORMAT.ADMISSION', id: 0 },
    { name: 'CONSTANT.STUDENT.ELECT_FORMAT.EXAMINATION', id: 1 },
  ],
  GRADUATION_TYPE: [
    { name: 'CONSTANT.STUDENT.GRADUATION_TYPE.VERY_GOOD', id: 1 },
    { name: 'CONSTANT.STUDENT.GRADUATION_TYPE.GOOD', id: 2 },
    { name: 'CONSTANT.STUDENT.GRADUATION_TYPE.AVERAGE', id: 3 },
  ],
  RELATIONSHIP: [
    { name: 'CONSTANT.STUDENT.RELATIONSHIP.DAD', id: 0 },
    { name: 'CONSTANT.STUDENT.RELATIONSHIP.MOM', id: 1 },
    { name: 'CONSTANT.STUDENT.RELATIONSHIP.GRAND_PARENTS', id: 2 },
    { name: 'CONSTANT.STUDENT.RELATIONSHIP.SIBLINGS', id: 3 },
    { name: 'CONSTANT.STUDENT.RELATIONSHIP.AUNT_UNCLE', id: 4 },
    { name: 'CONSTANT.STUDENT.RELATIONSHIP.GUARDIAN', id: 5 },
  ]
};

export const SCHOOL_YEAR = {

    MINIMUM_YEAR: 1000

}

export const TEACHER = {
  STATUS: [
    { name: 'Đang làm việc', id: 0, color: '#52BD94'},
    { name: 'Đã nghỉ việc', id: 1, color: '#D14343' },
    { name: 'Đã nghỉ hưu', id: 2, color: '#474D66' },
    { name: 'Tạm nghỉ', id: 3, color: '#F26522' },
  ],

  TEACHER_RATING_STATUS: [
    { name: 'CONSTANT.TEACHER.TEACHER_RATING_STATUS.NOT_RATE', code: 'not_rate', id: 0, color: '#696F8C;'},
    { name: 'CONSTANT.TEACHER.TEACHER_RATING_STATUS.SELF_RATE', code: 'self_rate', id: 1, color: '#F26522' },
    { name: 'CONSTANT.TEACHER.TEACHER_RATING_STATUS.MNG_RATE', code: 'Rated', id: 2, color: '#3366FF' },
    { name: 'CONSTANT.TEACHER.TEACHER_RATING_STATUS.APPROVED', code: 'Approved', id: 3, color: '#52BD94' },
    { name: 'CONSTANT.TEACHER.TEACHER_RATING_STATUS.NOT_APPROVE', code: 'NotApprove', id: 4, color: '#D14343' },
    { name: 'CONSTANT.TEACHER.TEACHER_RATING_STATUS.REJECT_RATE', code: 'NotRate', id: 5, color: '#F3A412' },
  ]
}

export const URL_AVATAR_STUDENT = '/assets/media/users/blank.png'

export const FILE_NAME_EXPORT_ERROR_CLASS = 'DS_Import_Loi.xls';

export const FILE_NAME_EXPORT_SUBJECT = 'DS_monhocthuoctruong.xls';

export const NOT_FOUND = 'Không tìm thấy kết quả';

export const NOT_FOUNDs = {
  la: 'ບໍ່ພົບຂໍ້ມູນ',
  vn: 'Không tìm thấy kết quả',
  en: 'No result',
}

export const INVALID = [null, undefined, '', 'null'];

export const PHONE_9_NUMBER = ['309', '304', '305', '302', '307'];

export const PHONE_10_NUMBER = ['209', '205', '202', '207'];
