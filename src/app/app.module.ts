import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { NgOptimizedImage } from '@angular/common';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideStorage,getStorage } from '@angular/fire/storage';

// NGX Pagination
import {NgxPaginationModule} from 'ngx-pagination';

import { HttpClientModule } from '@angular/common/http';

//COMPONENTES
import { AppComponent } from './app.component';
import { HeadpageComponent } from './components/headpage/headpage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { NofoundpageComponent } from './components/nofoundpage/nofoundpage.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BacktotopComponent } from './components/backtotop/backtotop.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { SellComponent } from './components/sell/sell.component';
import { PublicationsComponent } from './components/publications/publications.component';
import { ListPublicationsComponent } from './components/list-publications/list-publications.component';
import { PublicationDetailsComponent } from './components/publication-details/publication-details.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { MarketplaceSearchComponent } from './components/marketplace-search/marketplace-search.component';
import { AcercaComponent } from './components/acerca/acerca.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { AyudaComponent } from './components/ayuda/ayuda.component';
import { PreguntasfrecuentesComponent } from './components/preguntasfrecuentes/preguntasfrecuentes.component';
import { RecentscarComponent } from './components/recentscar/recentscar.component';
import { PublicationDayComponent } from './components/publication-day/publication-day.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { NewsComponent } from './components/news/news.component';



@NgModule({
  declarations: [
    AppComponent,
    HeadpageComponent,
    LoginComponent,
    RegisterComponent,
    VerifyEmailComponent,
    NofoundpageComponent,
    ForgotPasswordComponent,
    FooterComponent,
    HomeComponent,
    SpinnerComponent,
    NavbarComponent,
    ProfileComponent,
    BacktotopComponent,
    CarouselComponent,
    SellComponent,
    PublicationsComponent,
    ListPublicationsComponent,
    PublicationDetailsComponent,
    MarketplaceComponent,
    MarketplaceSearchComponent,
    AcercaComponent,
    ContactoComponent,
    AyudaComponent,
    PreguntasfrecuentesComponent,
    RecentscarComponent,
    PublicationDayComponent,
    NotificationsComponent,
    FacturacionComponent,
    NewsComponent,
  ],
  imports: [
    NgOptimizedImage,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), provideFirebaseApp(() => initializeApp(environment.firebase)), provideFirestore(() => getFirestore()), provideAuth(() => getAuth()), // ToastrModule added
   provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }