import { trigger, style, animate, transition } from '@angular/animations'

const DURATION = 100

const INITIAL_STATE = {
  transform: 'translateY(-100%)'
}

const END_FRAME_STATE = {
  transform: 'translateY(0%)'
}

export const FromTopAnimation = trigger('FromTop', [
  transition(':enter', [   // :enter is alias to 'void => *'
    style(INITIAL_STATE),
    animate(DURATION, style(END_FRAME_STATE))
  ]),
  transition(':leave', [   // :leave is alias to '* => void'
    animate(DURATION, style(INITIAL_STATE))
  ])
])
