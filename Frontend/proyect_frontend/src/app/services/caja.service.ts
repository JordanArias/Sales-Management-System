import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {configuration} from "./configuration"

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  private URL = configuration.url;

  private cod_caja :any; private hr_apertura :any; private estado :any;
  constructor(
    private http: HttpClient
  ) { }

   //OBTENEMOS LA LISTA DE PRODUCTOS
  get_Caja_Api(){
    return this.http.get<any>(this.URL+'/caja');
  }
  get_Caja_by_Mes(fechaini:any, fechaFin:any){
    // console.log('4. ------------ Get Caja by Mes - Service ---------------');
    // console.log('Fecha Inicial:: ', fechaini);    console.log('Fecha Fin:: ', fechaFin);
    return this.http.get<any>(`${this.URL}/caja/mes?fechaini=${fechaini}&fechafin=${fechaFin}`);
  }
  get_LastCaja_Api(){
    return this.http.get<any>(this.URL+'/caja/last');
  }

  post_Caja_Api(caja:unknown){
    console.log("PRODUCTO POST SERVICE::::");   
    console.log(caja);
    return this.http.post<any>(this.URL+'/caja',caja);
  }

  put_Caja_Api(caja:unknown){
    return this.http.put<any>(this.URL+'/caja',caja);
  }

  delete_Caja_Api(cod_caja:unknown){
    return this.http.delete<any>(this.URL+'/caja/'+cod_caja);
  }

  put_Cerrar_Api(caja:unknown){
    return this.http.put<any>(this.URL+'/caja/cerrar',caja);
  }

  setCodCaja(cod_caja:any,hr_apertura:any,estado:any){this.cod_caja=cod_caja; this.hr_apertura=hr_apertura; this.estado= estado;
  console.log("caja a Listar::", this.cod_caja);
  }

     //OBTENEMOS LA LISTA DE PRODUCTOS
  get_detalles_Mes(fechaini:any, fechaFin:any){
      return this.http.get<any>(`${this.URL}/caja/detalleM?fechaini=${fechaini}&fechafin=${fechaFin}`);
    }
  get_detalles_Caja(cod_caja:any){
      return this.http.get<any>(this.URL+'/caja/detalleD/'+cod_caja);
    }
  
  delete_All_Caja_Api(cod_caja:unknown){
    return this.http.delete<any>(this.URL+'/caja/allcaja/'+cod_caja);
  }

  getCodCaja(){return this.cod_caja;}
  getHrApertura(){return this.hr_apertura;}
  getEstado(){return this.estado;}
}
