import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcercaComponent } from './components/acerca/acerca.component';
import { AyudaComponent } from './components/ayuda/ayuda.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { ListPublicationsComponent } from './components/list-publications/list-publications.component';
import { LoginComponent } from './components/login/login.component';
import { MarketplaceSearchComponent } from './components/marketplace-search/marketplace-search.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { NewsComponent } from './components/news/news.component';
import { NofoundpageComponent } from './components/nofoundpage/nofoundpage.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PreguntasfrecuentesComponent } from './components/preguntasfrecuentes/preguntasfrecuentes.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicationDetailsComponent } from './components/publication-details/publication-details.component';
import { PublicationsComponent } from './components/publications/publications.component';
import { RegisterComponent } from './components/register/register.component';
import { SellComponent } from './components/sell/sell.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'verify-email', component: VerifyEmailComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'sell', component: SellComponent},
  { path: 'publications/edit/:id', component: PublicationsComponent},
  { path: 'list-publications', component: ListPublicationsComponent},
  { path: 'marketplace', component: MarketplaceComponent},
  { path: 'marketplace-search/:categoria/:search', component: MarketplaceSearchComponent},
  { path: 'publication-details/view/:id', component: PublicationDetailsComponent},
  { path: 'acerca', component: AcercaComponent},
  { path: 'contacto', component:ContactoComponent},
  { path: 'ayuda', component:AyudaComponent},
  { path: 'notificaciones', component:NotificationsComponent},
  { path: 'facturacion', component:FacturacionComponent},  
  { path: 'preguntas-frecuentes', component:PreguntasfrecuentesComponent},
  { path: 'noticias', component:NewsComponent},
  { path: '**', component: NofoundpageComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
