import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { HttpClientModule } from '@angular/common/http'
import { HomeComponent } from './routes/root/home/home.component'
import { ButtonComponent } from './components/button/button.component'
import { RootComponent } from './routes/root/root.component'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FlexLayoutServerModule } from '@angular/flex-layout/server'
import { OverviewComponent } from './routes/root/home/sections/overview/overview.component'
import { FeaturesComponent } from './routes/root/home/sections/features/features.component'
import { HeaderComponent } from './components/header/header.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HelpComponent } from './routes/root/home/sections/help/help.component'
import { FooterComponent } from './components/footer/footer.component'
import { Routes, RouterModule } from '@angular/router'
import { TermsAndConditionsComponent } from './routes/root/terms/terms.component'
import { FAQComponent } from './routes/root/faq/faq.component'
import { MatExpansionModule } from '@angular/material/expansion'
import { GithubStatsComponent } from './components/github-stats/github-stats.component'
import { SiteComponent } from './site.component'

const routes: Routes = [{
  path: '',
  component: RootComponent,
  children: [{
    path: '',
    component: HomeComponent
  }, {
    path: 'terms',
    component: TermsAndConditionsComponent
  }, {
    path: 'faq',
    component: FAQComponent
  }]
}]

@NgModule({
  declarations: [
    SiteComponent,
    HomeComponent,
    ButtonComponent,
    RootComponent,
    OverviewComponent,
    FeaturesComponent,
    HeaderComponent,
    HelpComponent,
    FooterComponent,
    TermsAndConditionsComponent,
    FAQComponent,
    GithubStatsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FlexLayoutModule,
    FlexLayoutServerModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    HttpClientModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [SiteComponent]
})
export class SiteModule { }
