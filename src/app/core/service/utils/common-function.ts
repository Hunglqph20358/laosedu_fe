import {PHONE_10_NUMBER, PHONE_9_NUMBER} from '../../../helpers/constants';

export class CommonFunction {
  static mapSemester(value) {
    switch (Number(value)) {
      case 1:
        return 'Học kỳ I';
      case 2:
        return 'Học kỳ II';
      case 3:
        return 'Học kỳ III';
      case 4:
        return 'Học kỳ IV';
      case 5:
        return 'Học kỳ V';
    }
  }
  static getCurrentUser(): any {
    return{
      currentUser:{
        activated: true,
        authorities: ['ROLE_ADMIN'],
        createdBy: "system",
        createdDate: "2021-08-05T17:00:00Z",
        email: "nguyen.dinh@migitek.com",
        expiredDate: null,
        firstName: null,
        fullName: "Administrators",
        id: 3,
        imageUrl: null,
        langKey: "en",
        lastModifiedBy: "anonymousUser",
        lastModifiedDate: "2022-06-08T10:31:30Z",
        lastName: "Administrator1",
        login: "0123456789"
      },
      jwttoken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMTIzNDU2Nzg5IiwiYXV0aCI6IlF14bqjbiBsw70iLCJleHAiOjE2NTgyMjU4MzJ9.RmuKs3S_3cC3n1iiOM8Bick72z98y1berRxrq99Meb2zSjmKtijPX6zBZDaICGFdg0z3PFQY7tPz8f7fMIOe2A"
    }
  }
  // Hàm validate sđt
  static validatePhoneNumber(phone: any) {
    const a = phone?.toString().slice(0, 3);
    if (PHONE_9_NUMBER.find(element => element === a)) {
      if (phone.length === 9)
        return 0;
      return 1;
    } else if (PHONE_10_NUMBER.find(element => element === a)) {
      if (phone.length === 10)
        return 0;
      return 2;
    }
    return 3;
  }

  static getLogo() {
    const item = sessionStorage.getItem('schoolInfo');
    if (!item) {
      return null;
    }
    const school = JSON.parse(item);
    school.logo = school.logo !== null ? school.logo.substring(school.logo.lastIndexOf('/assets'), school.logo.length) : null;
    return school.logo;
  }

  static getHost(){
    console.log(window.location.host)
    console.log(window.location.origin)
    console.log(window.location.hostname)
    return 'http://13.212.112.239:8084';
    // return window.location.host;
  }
}
