import { trigger, style, animate, transition, state } from '@angular/animations'

const DURATION = 100

export const FadeInOutAnimation = trigger('FadeInOut', [
  transition(':enter', [   // :enter is alias to 'void => *'
    style({ opacity: 0 }),
    animate(DURATION, style({ opacity: 1 }))
  ]),
  transition(':leave', [   // :leave is alias to '* => void'
    animate(DURATION, style({ opacity: 0 }))
  ])
])
