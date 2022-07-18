import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'system-search',
  templateUrl: './search.component.html',
  styleUrls: []
})
export class SearchComponent{
  @Input() component: string;
  @Output() submitSearch = new EventEmitter();
  levelSchool = [
    'Khối 1','Khối 2', 'Khối 3','Khối 4','Khối 5'
  ];

  nameTeacher=[
    'Ngyễn Văn Anh', 'Trần Thị Thu','Hoàng Kiều Anh','...'
  ]

  khoi: Array<string> = ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5'];
  lop: Array<string> = ['1A','1B','1C','2A','2B','2C','3A','3B','3C'];
  trangThai: Array<string> = ['Đã chọn', 'Chưa chọn'];
  all = 'Tất cả';

  searchValue = {
    khoi: '',
    lop: '',
    trangThai: ''
  };

  isCollapsed: boolean = true;

  submit() {
    this.submitSearch.emit(this.searchValue);
  }

}
