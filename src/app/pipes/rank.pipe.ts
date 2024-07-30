import { NgModule, Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'rank' })
export class RankPipe implements PipeTransform {
  transform(values: number[], currentValue: number): number {
    const sortedValues = values.slice().sort((a, b) => b - a);
    const rank = sortedValues.indexOf(currentValue) + 1;
    return rank;
  }
}

@NgModule({
    imports: [],
    providers: [],
    exports: [RankPipe],
    declarations: [RankPipe],
  })
  export class RankPipeModule { }