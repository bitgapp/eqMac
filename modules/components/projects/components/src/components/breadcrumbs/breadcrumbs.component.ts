import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'eqm-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: [ './breadcrumbs.component.scss' ]
})
export class BreadcrumbsComponent implements OnInit {
  @Input() crumbs: string[]
  @Input() underline = true
  @Output() crumbClicked = new EventEmitter<{ crumb: string, index: number }>()

  ngOnInit (): void {
  }
}
