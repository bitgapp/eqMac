import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ColorsService {
  static readonly accent = '#4f8d71'
  static readonly accentLight = '#4DAD82'
  static readonly warning = '#eb3f42'
  static readonly caution = '#FFD500'
  static readonly gradientStart = '#5a5b5f'
  static readonly gradientEnd = '#2c2c2e'
  static readonly iconGradientStart = '#05FF71'
  static readonly iconGradientMiddle = '#03F193'
  static readonly iconGradientEnd = '#04E2B5'
  static readonly light = '#c9cdd0'
  static readonly dark = '#16191c'

  readonly accent = ColorsService.accent
  readonly accentLight = ColorsService.accentLight
  readonly warning = ColorsService.warning
  readonly caution = ColorsService.caution
  readonly gradientStart = ColorsService.gradientStart
  readonly gradientEnd = ColorsService.gradientEnd
  readonly iconGradientStart = ColorsService.iconGradientStart
  readonly iconGradientMiddle = ColorsService.iconGradientMiddle
  readonly iconGradientEnd = ColorsService.iconGradientEnd
  readonly light = ColorsService.light
  readonly dark = ColorsService.dark
}
