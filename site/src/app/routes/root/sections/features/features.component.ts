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
      image: 'booster.jpg',
    }, {
      image: 'balance.jpg',
    }]
  }, {
    category: 'Equalizers',
    height: 250,
    features: [{
      image: 'basic-equalizer.jpg',
    }, {
      image: 'advanced-equalizer.jpg',
    }, {
      feature: 'Expert',
      image: 'expert-equalizer.svg',
      comment: 'Coming soon',
      border: false
    }]
  }]
  constructor () { }

  ngOnInit () {
  }

}
