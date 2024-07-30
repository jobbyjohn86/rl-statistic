import { CommonModule } from '@angular/common';
import { Component, NgModule, Input } from '@angular/core';
import { DxiItemModule } from 'devextreme-angular/ui/nested';

@Component({
  selector: 'app-card-progress',
  templateUrl: './card-progress.component.html',
  styleUrls: ['./card-progress.component.scss'],
})
export class CardProgressComponent {
  @Input()
  title!: string;

  @Input()
  description!: string;

  loadingText: string = 'Page Loading';

}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [CardProgressComponent],
  exports: [CardProgressComponent],
})
export class CardProgressModule { }
