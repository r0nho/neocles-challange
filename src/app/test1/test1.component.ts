import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FilterService } from '../services/filter.service';
import { TableService } from '../services/table.service';

export interface IEntry {
  name: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.scss']
})
export class Test1Component implements OnInit {

  data: IEntry[] = [];
  searchTerm$ = new Subject<String>();
  emptyArray = new Array(1000);
  form: FormGroup;
  filteredData: IEntry[] = [];

  options = {
    page: 1,
    maxPages : 0,
    offSet: 0,
    itemsPerPage: 25,
  };

  constructor(
    private filterService: FilterService,
    private tableService: TableService,
  ) {
    this.form = new FormGroup({
      filterInput: new FormControl(''),
    });
    
    this.tableService.data
      .subscribe(result => this.data.push(result));
  }

  ngOnInit() {
    const input =  this.form.get('filterInput');

    this.filterService
      .filterData(this.data, this.searchTerm$)
      .subscribe((results: IEntry[]) => { 
        this.options.page = 1;
        this.options.offSet = 0;
        this.filteredData = results;
        this.options.maxPages = this.filteredData.length;
      });

    this.searchTerm$.next('');

    input
      .valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(term =>  this.searchTerm$.next(term));
  }


  onPageChange(data: { offset: number, page: number}) {
    this.options.offSet = data.offset;
    this.options.page = data.page;
  }

}
