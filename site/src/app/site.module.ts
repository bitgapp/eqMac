import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { HttpClientModule } from '@angular/common/http'
import { SiteComponent } from './site.component'
import { ButtonComponent } from './components/button/button.component'
import { RootComponent } from './routes/root/root.component'
import { FlexLayoutModule } from '@angular/flex-layout'
import { OverviewComponent } from './routes/root/sections/overview/overview.component'
import { FeaturesComponent } from './routes/root/sections/features/features.component'
import { HeaderComponent } from './components/header/header.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HelpComponent } from './routes/root/sections/help/help.component'
import { FooterComponent } from './components/footer/footer.component'
import { Routes, RouterModule } from '@angular/router'
import { TermsAndConditionsComponent } from './routes/terms/terms.component'
import { FAQComponent } from './routes/faq/faq.component'
import { MatExpansionModule } from '@angular/material/expansion'

const routes: Routes = [{
  path: '',
  component: RootComponent
}, {
  path: 'terms',
  component: TermsAndConditionsComponent
}, {
  path: 'faq',
  component: FAQComponent
}]

@NgModule({
  declarations: [
    SiteComponent,
    ButtonComponent,
    RootComponent,
    OverviewComponent,
    FeaturesComponent,
    HeaderComponent,
    HelpComponent,
    FooterComponent,
    TermsAndConditionsComponent,
    FAQComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FlexLayoutModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    HttpClientModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [SiteComponent]
})
export class SiteModule { }
