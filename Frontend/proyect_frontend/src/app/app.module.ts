import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule,HTTP_INTERCEPTORS} from "@angular/common/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { CajaComponent } from './components/caja/caja.component';
import { ProductosComponent } from './components/productos/productos.component';
import { SigninComponent } from './components/signin/signin.component';
import { FilterPipe } from './pipes/filter.pipe';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {NgxExtendedPdfViewerModule, } from 'ngx-extended-pdf-viewer';
import { CocinaComponent } from './components/cocina/cocina.component';
import { SharedservicesService } from './services/sharedservices.service';

@NgModule({
  declarations: [
    AppComponent,
    UsuariosComponent,
    VentasComponent,
    CajaComponent,
    ProductosComponent,
    SigninComponent,
    FilterPipe,
    CocinaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    NgxExtendedPdfViewerModule
  ],
  providers: [SharedservicesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
