import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'functionFilter'
})
export class FunctionFilterPipe implements PipeTransform {

  transform(items: any[], filter: Object): any {
    if(!filter){
      return [];
    }
    else if (!items) {
      return items;
    }
    return items.filter((element: any)=>(element.category_id==filter));
  }

}
