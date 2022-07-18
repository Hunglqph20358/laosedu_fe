export const environment = {
	production: true,
	isMockEnabled: true, // You have to switch this, when your real back-end is done
	authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',
  AUTH_SERVER: 'http://13.212.112.239:8083',
  API_GATEWAY_ENDPOINT: 'http://13.212.112.239:8083/api/',
  // SCHOOL_NAME: 'Trường THPT Chuyên Nguyễn Huệ',
  SCHOOL_NAME: 'ໂຮງຮຽນມິດຕະພາບລາວ-ຫວຽດນາມ',
  SCHOOL_CODE: 'THPT_NH_HN',
  timer: 120, // seconds
  ROLE: {
    // admin
    ADMIN: 'ROLE_ADMIN', // qua ly
    GV_CN: 'ROLE_GVCN', // giao vien chu nhiem
    GV_BM: 'ROLE_GVBM', // giao vien bo mon
    TK: 'ROLE_TK', // giao vien bo mon
    HP: 'ROLE_HP', // hieu pho
    HT: 'ROLE_HT', // hieu truong
    PH: 'ROLE_USER', // phu huynh
  }
};
