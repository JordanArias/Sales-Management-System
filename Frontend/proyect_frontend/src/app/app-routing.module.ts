import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {SigninComponent} from "./components/signin/signin.component";
import {UsuariosComponent} from "./components/usuarios/usuarios.component";
import {VentasComponent} from "./components/ventas/ventas.component";
import {ProductosComponent} from "./components/productos/productos.component";
import { CajaComponent } from './components/caja/caja.component';
import { CocinaComponent } from './components/cocina/cocina.component';

import { AuthGuard } from "./auth.guard";

const routes: Routes = [
    //ruta inicial
    {path: '',redirectTo:'/signin', pathMatch:'full'}, //al cargar el angular redirecciona automaticamente a /tasks
    //canActivate:[AuthGuard] : lo ponenmos a la ruta que queremos proteger si no tienen token
    {path: 'signin', component: SigninComponent},
    {path: 'usuario', component: UsuariosComponent, canActivate:[AuthGuard], data:{rol:'usuario'}},
    {path: 'venta', component: VentasComponent,canActivate:[AuthGuard],data:{rol:'venta'}},
    {path: 'producto', component: ProductosComponent,canActivate:[AuthGuard],data:{rol:'producto'}},
    {path: 'caja', component: CajaComponent,canActivate:[AuthGuard],data:{rol:'caja'}},
    {path: 'cocina', component: CocinaComponent,canActivate:[AuthGuard],data:{rol:'cocina'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
