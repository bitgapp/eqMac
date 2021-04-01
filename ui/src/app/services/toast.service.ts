import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor (private readonly snackBar: MatSnackBar) {}

  open ({ message, action }: {
    message: string
    action?: string
  }) {
    action = action || 'Hide'
    const duration = 1000
    const toast = this.snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 10000,
      panelClass: [ 'dark-bg', 'light' ]
    })
    setTimeout(() => {
      toast?.dismiss()
    }, duration)
  }
}
