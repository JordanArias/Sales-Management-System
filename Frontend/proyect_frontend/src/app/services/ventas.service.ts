import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import { CajaService } from './caja.service';
import { SharedservicesService } from './sharedservices.service';
import {configuration} from "./configuration"

@Injectable({
    providedIn: 'root'
  })

export class VentaService {
 private URL = configuration.url; 

  ventas=[{cod_venta:'',cod_caja:1, factura:'', mesa:null, vent_llevar:false, total_bs:0, pagado_bs:null, cambio_bs:0, total_arg:0, pag_arg:null, cambio_arg:0, hora:'', estado:1, descrip_venta:''}];
  detalle=[{cod_item:'',cod_venta:'', cod_producto:'', unidad_item:'', descript_item:'', item_llevar:false,nom_pro:'',cod_categoria:''}];
  item_presa=[{cod_item:'', cod_presa:'', unidad_presa:'',nom_presa:''}];
  ventasConDetalles: any[] = [];
  last_caja:any={cod_venta:null, cod_item:null ,cod_caja:null,estado:null,hr_apertura:null};

  constructor(
      private http: HttpClient,
      private router: Router,
      private cajaService:CajaService,
      private sharedService: SharedservicesService
  ) { }

  //OBTENEMOS LISTA DE VENTAS
  get_Ventas_Api(caja:any){
    const cod_caja= caja[0].cod_caja; const hr_apertura= caja[0].hr_apertura;
    return this.http.get<any>(this.URL+'/ventas/'+cod_caja+'/'+hr_apertura);
  }
  get_Detalle_Api(){
    return this.http.get<any>(this.URL+'/ventas/detalle');
  }
  get_Item_Presa_Api(){
    return this.http.get<any>(this.URL+'/ventas/item');
  }

//AGREGAR VENTAS
  post_Venta_Api_backend(venta:unknown,detalle_venta:unknown, item_presa:unknown){
    const data = {
      venta: venta,
      detalle_venta: detalle_venta,
      item_presa: item_presa
    };
    return this.http.post<any>(this.URL+'/ventas',data);
  }
  post_Venta_Api(venta:unknown){
    return this.http.post<any>(this.URL+'/ventas',venta);
  }
  post_Detalle_Api(detalle:unknown){
    return this.http.post<any>(this.URL+'/ventas/detalle',detalle);
  }
  post_Item_Presa_Api(item:unknown){
    return this.http.post<any>(this.URL+'/ventas/item',item);
  }

//ACTUALIZAR VENTAS
  put_Venta_Api_backend(item_Del:unknown, detalle_Del:unknown, venta_Mod:unknown, detalle_Mod:unknown, detalle_Add:unknown, item_Add:unknown){
    const data = {
      item_Del: item_Del,
      detalle_Del: detalle_Del,
      venta_Mod: venta_Mod,
      detalle_Mod:detalle_Mod,
      detalle_Add:detalle_Add,
      item_Add:item_Add
    };
    return this.http.put<any>(this.URL+'/ventas',data);
  }
  put_Venta_Api(venta:unknown){
    return this.http.put<any>(this.URL+'/ventas',venta);
  }
  put_Detalle_Api(detalle:unknown){
    return this.http.put<any>(this.URL+'/ventas/detalle',detalle);
  }
  put_Item_Presa_Api(item:unknown){
    return this.http.put<any>(this.URL+'/ventas/item',item);
  }

//ELIMINAR VENTAS
  delete_Venta_ById(venta:unknown){
    const data ={venta}
    return this.http.post<any>(this.URL+'/ventas/delete',data);
  }
  delete_Detalle_ById(cod_item:unknown){
    return this.http.delete<any>(this.URL+'/ventas/detalle/'+cod_item);
  }
  delete_Item_Presa_ById(cod_item:unknown){
    return this.http.delete<any>(this.URL+'/ventas/item/'+cod_item);
  }
  put_Venta_estado(cod_venta:unknown,estado:unknown){
    const venta= {cod_venta:cod_venta,estado:estado}
    return this.http.put<any>(this.URL+'/ventas/estado',venta);
  }
  put_Venta_estado_l(cod_venta:unknown,estado:unknown){
    const venta= {cod_venta:cod_venta,estado:estado}
    return this.http.put<any>(this.URL+'/ventas/estado_l',venta);
  }

}
  