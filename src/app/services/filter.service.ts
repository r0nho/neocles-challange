import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface IEntry {
  name: string;
  description: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {

filteredData: IEntry[] = [];

constructor() { }

filterData(data: Array<{}>, filter: Observable<any>) {
  return filter.pipe(
    switchMap(term => this.searchOnData(data, term))
  );
}

searchOnData(data: Array<{}>, filter: string) {
  return of(data).pipe(
    map((results: IEntry[]) => {

      if (filter.trim().length === 0) {
        return results;
      }

      this.filteredData = [];
      const allTerms = filter.split(' ').filter(item => item.trim() !== '');

      results.map(entry => {
        allTerms.forEach(term => {
          if (entry.name.includes(term) || entry.description.includes(term) || entry.status.includes(term)) {
            this.filteredData.push(entry);
          }
        });
      });

      return this.filteredData;
    })
  );
}

}
