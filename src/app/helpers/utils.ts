import * as moment from 'moment';

export function removeEmptyQuery(query: object) {

  Object.keys(query).forEach(key => {
    if (
      query[key] === '' ||
      query[key] === undefined ||
      query[key] === null ||
      query[key] === 'undefined' ||
      query[key] === 'null'
    ) delete query[key];
  });

  return query;
}

export function calculateFistLastPageTable(rowData, total, pageSize, currentPage) {
  let first, last, pages;

  if (!rowData && rowData.length === 0) {
    first = 0;
    last = 0;
  } else {
    pages = Array(Math.ceil(total / pageSize)).fill(0).map((value, index) => index + 1);
    first = pageSize * (currentPage - 1) + 1;
    last = rowData.length + (pageSize * (currentPage - 1));
  }

  return { first, last, pages };
}

export function removeAccents(str: string) {
  str = str.trim();
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ|Ì|Í|Ị|Ỉ|Ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ|Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'y');
  str = str.replace(/đ|Đ/g, 'd');
  // str = str.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, "");
  // str = str.replace(/-/g, " ");
  str = str.replace(/\s+/g, "");
  return str
}

export function convertDateToString(time: any) {
  if(!time) return '';
  time = new Date(time);
  var year = time.getFullYear();
  var date = time.getDate();
  var month = time.getMonth() + 1;
  // var hours = time.getHours();
  // var minutes = time.getMinutes();
  // var seconds = time.getSeconds();
  if (date < 10) {
    date = "0" + date;
  }
  if (month < 10) {
    month = "0" + month;
  }
  // if (hours < 10) {
  //   hours = "0" + hours;
  // }
  // if (minutes < 10) {
  //   minutes = "0" + minutes;
  // }
  // if (seconds < 10) {
  //   seconds = "0" + seconds;
  // }
  // return `${date}\/${month}\/${year} ${hours}:${minutes}:${seconds}`;
  return `${date}\/${month}\/${year}`;
}

export function pagination(currentPage, totalPage) {
  var delta = 2,
    left = currentPage - delta,
    right = currentPage + delta + 1,
    range = [],
    rangeWithDots = [],
    l;

  for (let i = 1; i <= totalPage; i++) {
    if (i == 1 || i == totalPage || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

export function next(currentPage, totalPage) {
  currentPage++;

  if (currentPage > totalPage) {
    currentPage = totalPage;
    return;
  }

  return currentPage;
}

export function prev(currentPage) {
  currentPage--;

  if (currentPage < 1) {
    currentPage = 1;
    return;
  }

  return currentPage;
}

export function exportName(title: string) {
  title = title + moment().format('DDMMYYYY').toString();
  return title;
}

export function download(data, title: string) {
  const file = new Blob([data], { type: 'application/vnd.ms-excel' });
  const fileURL = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.download = title;
  anchor.href = fileURL;
  anchor.click();
}

export function getField(object, field) {
  if (object && object.hasOwnProperty(field)) {
    return object[field];
  }

  return object;
}
