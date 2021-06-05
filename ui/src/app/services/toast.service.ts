import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'

interface ToastShowOptions {
  message: string
  type?: 'success' | 'warning' | 'normal'
  action?: string
  duration?: number
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor (private readonly snackBar: MatSnackBar) {}

  show ({ message, action, type, duration }: ToastShowOptions) {
    action ||= 'Hide'
    type ||= 'normal'
    duration ??= 2000
    duration <= 0 && (duration = 2000)
    const [ bgClass, textClass ] = (() => {
      switch (type) {
        case 'success': return [ 'accent-bg', 'dark' ]
        case 'warning': return [ 'warning-bg', 'dark' ]
        default: return [ 'dark-bg', 'light' ]
      }
    })()
    const toast = this.snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration,
      panelClass: [ bgClass, textClass ]
    })
    setTimeout(() => {
      toast?.dismiss()
    }, duration)
  }
}
