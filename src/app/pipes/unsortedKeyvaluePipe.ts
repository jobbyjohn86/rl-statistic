import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unsortedKeyvalue'
})
export class UnsortedKeyvaluePipe implements PipeTransform {

  transform(value: any): any[] {
    if (!value || typeof value !== 'object') {
      return [];
    }
    return Object.keys(value).map(key => ({ key, value: value[key] }));
  }

}
