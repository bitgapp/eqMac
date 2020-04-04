import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'eqm-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {
  categories = [{
    category: 'Volume',
    height: 99,
    features: [{
      screenshot: 'booster.jpg',
      price: 'Free'
    }, {
      screenshot: 'balance.jpg',
      price: 'Free'
    }]
  }, {
    category: 'Equalizers',
    height: 250,
    features: [{
      screenshot: 'basic-equalizer.jpg',
      price: 'Free'
    }, {
      screenshot: 'advanced-equalizer.jpg',
      price: 'Free'
    }, {
      feature: 'Expert',
      screenshot: 'expert-equalizer.svg',
      price: 'Coming soon',
      border: false
    }]
  }]
  constructor () { }

  ngOnInit () {
  }

}
