import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core'

@Component({
  selector: 'eqm-analyzer',
  templateUrl: './analyzer.component.html',
  styleUrls: ['./analyzer.component.scss']
})

export class AnalyzerComponent implements OnInit {
  @ViewChild('grid', { static: true }) gridCanvas
  @ViewChild('container', {
    read: ElementRef,
    static: true
}) container

  height = 0
  width = 0
  halfHeight = 0
  halfWidth = 0

  constructor (private elRef: ElementRef) {}

  ngOnInit () {
  }

  drawGrid () {
    // Get canvas context
    const gridCanvas: HTMLCanvasElement = this.gridCanvas.nativeElement

    gridCanvas.style.height = this.container.nativeElement.offsetHeight + 'px'
    gridCanvas.style.width = this.container.nativeElement.offsetWidth + 'px'

    this.width = gridCanvas.offsetWidth
    this.height = gridCanvas.offsetHeight

    this.halfWidth = this.width / 2
    this.halfHeight = this.height / 2

    gridCanvas.width = this.width
    gridCanvas.height = this.height

    // Get canvas context
    const canvas: HTMLCanvasElement = this.gridCanvas.nativeElement
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

    // Clear canvas
    ctx.clearRect(0, 0, this.width, this.height)

    // Draw Misc assets

    // Draw fraction lines
    // Horizontal
    ctx.strokeStyle = '#333'
    let step = 20
    let offset = step
    while (this.halfHeight - offset >= 0) {
      let lineYPos = this.halfHeight - offset
      ctx.beginPath()
      ctx.moveTo(0, lineYPos)
      ctx.lineTo(this.width, lineYPos)
      ctx.closePath()
      ctx.stroke()

      lineYPos = this.halfHeight + offset
      ctx.beginPath()
      ctx.moveTo(0, lineYPos)
      ctx.lineTo(this.width, lineYPos)
      ctx.closePath()
      ctx.stroke()

      offset += step
    }

    // Vertical
    step = 24
    offset = step
    while (this.halfWidth - offset >= 0) {
      let lineXPos = this.halfWidth - offset
      ctx.beginPath()
      ctx.moveTo(lineXPos, 0)
      ctx.lineTo(lineXPos, this.height)
      ctx.closePath()
      ctx.stroke()

      lineXPos = this.halfWidth + offset
      ctx.beginPath()
      ctx.moveTo(lineXPos, 0)
      ctx.lineTo(lineXPos, this.height)
      ctx.closePath()
      ctx.stroke()

      offset += step
    }

    // Draw center lines
    ctx.strokeStyle = '#555'
    ctx.lineWidth = 1

    // Vertical line
    ctx.beginPath()
    ctx.moveTo(this.halfWidth, 0)
    ctx.lineTo(this.halfWidth, this.height)
    ctx.closePath()
    ctx.stroke()

    // Horizontal line
    ctx.beginPath()
    ctx.moveTo(0, this.halfHeight)
    ctx.lineTo(this.width, this.halfHeight)
    ctx.closePath()
    ctx.stroke()
  }
}
