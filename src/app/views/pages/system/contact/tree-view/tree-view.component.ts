import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {INVALID, NOT_FOUND, NOT_FOUNDs} from '../../../../../helpers/constants'
import {TreeviewI18n,DefaultTreeviewI18n, TreeviewItem} from 'ngx-treeview';

@Component({
  selector: 'kt-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
  providers: [
    {
      provide: TreeviewI18n , useValue: Object.assign(new DefaultTreeviewI18n(), {
        getFilterNoItemsFoundText(): string {
          const language = localStorage.getItem('language')
          return NOT_FOUNDs[language || 'en'];
        }
      })
    }
  ],
})
export class TreeViewComponent implements OnInit, OnChanges {
  @Input() config: any = {};
  @Input() items: any;
  @Input() selectAllTitle: any = '';
  @Input() total: any;
  @Output() valueChange = new EventEmitter<any>();
  @Output() selectByGroupValueChange = new EventEmitter<any>();
  @Output() onCustomFilter = new EventEmitter();
  @Output() reloadData = new EventEmitter<boolean>();
  @Input() year: any = '';
  @Output() checkboxItemChange = new EventEmitter<TreeviewItem>()
  filterText: any;
  treeviewAll: TreeviewItem
  isFindingMode: boolean = false

  get itemsList() {
    if(this.items.lengh)
    return this.items;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
  }

  onFilterChange($event: string) {
    console.log($event);
  }

  selectedChange($event: any[]) {
    if (this.isFindingMode) {
      this.treeviewAll.checked = false
    }
    this.valueChange.emit($event);
  }

  shouldShowCheckbox(item): boolean {
    if(!this.config.showCheckbox) return false;
    if (this.config?.selectByGroupValue) {
      return !item.value.isTeacher;
    }
    return item.value?.isTeacher;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.detectChanges();
  }

  selectByGroupChange($event: any) {
    console.log($event);
    this.selectByGroupValueChange.emit($event);
  }

  setTreeviewAll(item) {
    this.treeviewAll = item
    this.config.treeviewAll = item
    return true
  }

  getCurrentTreeItem(item: TreeviewItem) {
    this.checkboxItemChange.emit(item)
  }

  customFilter(searchCallback, text: string, item) {
    searchCallback(text)
    item.checked = false
    item.internalChecked = false
    this.isFindingMode = !INVALID.includes(text)
  }

  onReloadData($event: any, searchCallback: any) {
    this.filterText = '';
    this.isFindingMode = false
    searchCallback(this.filterText);
    this.reloadData.emit($event);
  }
}
