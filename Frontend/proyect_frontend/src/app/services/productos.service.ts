import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {configuration} from "./configuration"

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
   private URL = configuration.url; 

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  //OBTENEMOS LA LISTA DE PRODUCTOS
  getProductosApi(){
    return this.http.get<any>(this.URL+'/productos');
  }

  //AGREGAMOS NUEVO PRODUCTO
  postProductosApi(producto:unknown){
    console.log("PRODUCTO POST SERVICE::::");   
    console.log(producto);
    return this.http.post<any>(this.URL+'/productos',producto);
  }

  //MODIFICAMOS PRODUCTO
  putProductosApi(producto:unknown){
    console.log('Api producto',producto);
    
    return this.http.put<any>(this.URL+'/productos',producto);
  }

  //ELIMINAMOS PRODUCTO
  deleteProductosApi(cod_producto:unknown){
    return this.http.delete<any>(this.URL+'/productos/'+cod_producto);
  }



  //OBTENEMOS LA LISTA DE PRODUCTOS
  getCategoriasApi(){
    return this.http.get<any>(this.URL+'/categorias');
  }
  //AGREGAMOS NUEVA CATEGORIA
  postCategoriasApi(categoria:unknown){
    console.log(categoria);
    return this.http.post<any>(this.URL+'/categorias',categoria);
  }
  //MODIFICAMOS CATEGORIA
  putCategoriaApi(categoria:unknown){
    return this.http.put<any>(this.URL+'/categorias',categoria);
  }
  //ELIMINAMOS PRODUCTO
  deleteCategoriaApi(cod_categoria:unknown){
    return this.http.delete<any>(this.URL+'/categorias/'+cod_categoria);
  }
  
}
