import { Component, Renderer2 } from '@angular/core';
import { CajaService } from "../../services/caja.service";
import * as bootstrap from 'bootstrap';

declare var $: any
@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent {
  cod_caja:any;
  // cajaList=[{cod_caja:0, fecha:'', hr_apertura:'', hr_cierre:'', saldoini_bs:0, saldofin_bs:0, saldoini_arg:0, saldofin_arg:0, cant_items:0, estado:0}];
  cajaList: {cod_caja: number;fecha: string;hr_apertura: string; hr_cierre: string;saldoini_bs: number;saldofin_bs: number;saldoini_arg: number;saldofin_arg: number;cant_items: number;estado: number;
            }[] = [];
  
  cajaShow={cod_caja:0, fecha:'', hr_apertura:'', hr_cierre:'', saldoini_bs:0, saldofin_bs:0, saldoini_arg:0, saldofin_arg:0, cant_items:0, estado:0};
  fechaShow=''; mes=true;
  cajap={cod_caja:0, fecha:'', hr_apertura:'', hr_cierre:'', saldoini_bs:null, saldofin_bs:0, saldoini_arg:null, saldofin_arg:0, cant_items:0, estado:0};

  detalle_productos:any[]=[];
  detalle_Bebida: any[] = []; detalle_Pollo: any[] = []; detalle_Guarniciones: any[] = []; detalle_Hamburguesa: any[] = [];

  monthSelected=0; yearSelected=0;
  showDetalles=false; mensaje_toast='';//Mensaje toast
  flag=false;
  constructor( 
    private cajaService:CajaService,
    private renderer: Renderer2,
    ){
      this.listarCaja();
   }

  limparDatos(){
    this.cajap={cod_caja:0, fecha:'', hr_apertura:'', hr_cierre:'', saldoini_bs:null, saldofin_bs:0, saldoini_arg:null, saldofin_arg:0, cant_items:0, estado:0};
    this.cajaList=[];
  }


  separarFecha(fechaStr:any) {
    const parts = fechaStr.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) ; // Restar 1 porque los meses en JavaScript son de 0 a 11
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

  // *************** MODALES ***************
  showModalAgregar(){
    // this.limpiarProductoForm();
    $("#modalAgregarCaja").modal('show');
  }
  showModalModificar(caja:any):void{
    this.cajap=caja;
    $("#modalModificarCaja").modal('show');
    //Guardamos los datos del Producto seleccionado para mostrar en el formulario
  }
  showModalEliminar(caja:any):void{
    this.cajap=caja;
    console.log("Del:", this.cajap);  
    $("#modalEliminarCaja").modal('show');
  }
  showModalCerrar(caja:any):void{
    this.cajap=caja;
    console.log("Cerrar:", this.cajap);  
    $("#modalCerrarCaja").modal('show');
  }
  showModalEliminarTodo(caja:any):void{
    this.cajap=caja;
    console.log("Del:", this.cajap);  
    $("#modalEliminarTodaCaja").modal('show');
  }

  // *************** LISTAR CAJA ***************
  listarCaja(){
    this.cajaService.get_Caja_Api()
    .subscribe(
      res => {
        this.cajaList = res[0];
        this.monthSelected= res[1];
        this.yearSelected= res[2];
        console.log('month:: ',this.monthSelected);
        
        console.log("1. ------------ Listar Cajas ----------::",this.cajaList);
      },
      err => {console.log(err), this.limparDatos()}
    ) 
  }
 // *************** AGREGAR CAJA ***************
  agregarCaja(){
    this.cajap.fecha=this.obtener_fecha();
    this.cajap.hr_apertura = this.obtener_hora();
    this.cajap.cod_caja = this.obtener_Last_CodCaja()+1;
    this.cajaService.setCodCaja( this.cajap.cod_caja,this.cajap.hr_apertura,0);
    // this.cajaService.setCodCaja(this.cajap.cod_caja);
    // console.log("Caja:", this.cajap);
    // console.log(this.cajaList[this.cajaList.length-1].estado);
    console.log("Caja ultima",this.cajaList);
    //SI la caja esta con lista vacia llenamos uno nuevo
    if (this.cajaList.length==0) {
      console.log("Caja llena"); 
      this.cajaService.post_Caja_Api(this.cajap)
      .subscribe(
        res => {
          console.log('Caja Agregado');
          this.mensajeToast('exito','Caja Agregada');
          this.listarCaja();
          this.limparDatos();
        },
        err => console.log(err)
      )
    $("#modalAgregarCaja").modal('hide'); 
    }
    else if (this.cajaList[this.cajaList.length-1].estado==1) {
        this.cajaService.post_Caja_Api(this.cajap)
        .subscribe(
          res => {
            console.log('Caja Agregado');
            this.mensajeToast('exito','Caja Agregada');
            this.listarCaja();
            this.limparDatos();
          },
          err => console.log(err)
        )
      $("#modalAgregarCaja").modal('hide'); 
    }else{
      this.mensajeToast('error','Error: Debe Cerrar la ultima Caja');
      $("#modalAgregarCaja").modal('hide'); 
    }

  }
 // *************** MODIFICAR CAJA ***************
  modificarCaja(){
    console.log("Modificar: ",this.cajap);
    
    console.log("se cambio a: "+this.cajap);  
    this.cajaService.put_Caja_Api(this.cajap)
      .subscribe(
        res => {
          console.log('Producto Modificado');
          this.mensajeToast('modificar','Caja Modificada')
          this.listarCaja();
        },
        err => console.log(err)
      )
        $("#modalModificarCaja").modal('hide');   
  }
 // *************** ELIMINAR CAJA ***************
  eliminarCaja(){

    this.cajaService.delete_Caja_Api(this.cajap.cod_caja)
    .subscribe(
      res => {
        console.log('Caja eliminada');
        this.mensajeToast('exito','Caja Eliminada');
        this.listarCaja();
        this.limparDatos();
      },
      err => {
        this.mensaje_toast='La Caja tiene ventas registradas';
        this.mensajeToast('error','Error, la Caja tiene ventas registradas');
        console.log(err);
      }
    )
    $("#modalEliminarCaja").modal('hide'); 
  }
 // *************** LISTAR CAJA SELECCIONADA ***************
  listar_CajaSeleccionada(caja:any){
    this.cajaService.setCodCaja(caja.cod_caja,caja.hr_apertura,caja.estado)
  }
 // *************** CERRAR CAJA ***************
  cerrarCaja(){  
    this.cajaService.put_Cerrar_Api(this.cajap)
      .subscribe(
        res => {
          console.log('Caja Cerrada');
          this.mensajeToast('exito','Caja Cerrada');
          this.listarCaja();
          this.limparDatos();
        },
        err => {
          console.log(err)
          this.mensajeToast('error','Error al cerrar la Caja');
        }
      )
        $("#modalCerrarCaja").modal('hide');   
  }

  obtener_fecha(){
    const fechaHoraActual = new Date();// Obtener la fecha y hora actual
    const dia = fechaHoraActual.getDate();// Obtener el día actual
    const mes = fechaHoraActual.getMonth() + 1;// Obtener el mes actual (agregamos 1 ya que los meses en JavaScript se cuentan desde 0)
    const año = fechaHoraActual.getFullYear();// Obtener el año actual
    const fecha = `${dia}/${mes}/${año}`;// Formatear la fecha en el formato deseado (dd/mm/yyyy)
    return fecha;
  }
  obtener_hora() {
    const ahora = new Date();
    const hora = ahora.getHours().toString().padStart(2, '0'); // Obtener hora en formato de 24 horas
    const minuto = ahora.getMinutes().toString().padStart(2, '0'); // Obtener minutos
    return `${hora}:${minuto}`;
  }
  obtener_Last_CodCaja(){
    if (this.cajaList.length) {
      const last_index = this.cajaList.length - 1;
      const cod_caja= this.cajaList[last_index].cod_caja;
      return cod_caja;
    }else{
      return 0;
    }
  }
 // *************** MOSTRAR DETALLE MES ***************
  show_Detalles_Mes(listar:any){
    
    this.detalle_productos=[];

    if (this.monthSelected==0 || this.yearSelected==0) {
      // toast.show();
      this.mensajeToast('error','Seleccionar Mes o Año');
    }
    else{
      this.cambiar_Vista(listar);
      this.detalles_Backend_Mes();
     } 
  }

  detalles_Backend_Mes(){
    console.log("1. ----------- Detalle Backend Mes -----------");

    //Primero definimos FechaIni y FechaFin
    //Fecha Ini
    const fechaIni ='01/' + this.monthSelected + '/' + this.yearSelected;  console.log("Fecha Inicio: ", fechaIni);
    let mes =parseInt(this.monthSelected.toString());
    if (mes==12) {//Si mes es 12 entonces fechaFin es de enero del siguiente year
      mes=0; this.yearSelected=parseInt(this.yearSelected.toString())+1
    }
    //Fecha Fin
    const fechaFin= '01/' + (mes+1)+ '/' + this.yearSelected;    console.log("Fecha Fin: ", fechaFin);
    //Mostramos el titulo de los detalles
    this.fechaShow=this.monthSelected + '/' + this.yearSelected;
    this.mes=true;
    // Hacemos la llamada al servidor
    this.cajaService.get_detalles_Mes(fechaIni,fechaFin)
    .subscribe(
      res => {
        console.log('2.----------- Obtenemos Detalle Caja ----------- ');
        this.detalle_productos= res;
        console.log(this.detalle_productos);
      },
      err => console.log(err)
    )
    this.get_Caja_lista_Mes(fechaIni,fechaFin)
  }
 // *************** MOSTRAR DETALLE CAJA ***************
  show_Detalles_Caja(caja:any){
    console.log("caja: ",caja);
    this.cajaShow=caja; this.mes=false; console.log("Caja Show:::", this.cajaShow);
    
    this.cambiar_Vista(1);
    this.cajaService.get_detalles_Caja(caja.cod_caja)
    .subscribe(
      res => {
        console.log('1.----------- Obtenemos Detalle Caja ----------- ');
        this.detalle_productos= res;
        console.log(this.detalle_productos);
        // console.log('Obtencion 1 :',this.detalle_productos[0]);
        // console.log('Obtencion 2 :',this.detalle_productos[0].categoria);
        // console.log('Obtencion 3 :',this.detalle_productos[0].productos[0].cantidad_vendida);
        
      },
      err => console.log(err)
    )
  }
 
  cambiar_Vista(listar:any){
    var contenedor_lista = document.getElementById("container-lista-principal");
    var contenedor_cards = document.getElementById("container-detalles-cards");
    if (contenedor_cards && contenedor_lista) {
      if (listar==1) {
        contenedor_cards.style.display = "block";
        contenedor_lista.style.display = "none";
      }else{
        contenedor_cards.style.display = "none";
        contenedor_lista.style.display = "block";
      }    
    }
  }

  get_Caja_lista_Mes(fechaIni:any,fechaFin:any){
    console.log("3. ----------------Lista Caja Segun un MES ----------------");
    console.log("Fecha Inicio: ", fechaIni);
    console.log("Fecha Fin: ", fechaFin);
    
    this.cajaService.get_Caja_by_Mes(fechaIni,fechaFin)
    .subscribe(
      res => {
        this.cajaList = res;
        console.log("Lista segun fecha de ultima caja: ", this.cajaList);
        
      },
      err => console.log(err)
    )
  }

  eliminar_TodaCaja(){
    this.cajaService.delete_All_Caja_Api(this.cajap.cod_caja)
    .subscribe(
      res => {
        console.log('Caja eliminada');
        this.mensajeToast('exito','Caja Eliminada');
        this.listarCaja();
        this.limparDatos();
      },
      err => {
        this.mensajeToast('error','Error, no se pudo eliminar');
        console.log(err);
      }
    )
    $("#modalEliminarTodaCaja").modal('hide'); 
  }

  mensajeToast(tipo_mensaje:any,mensaje:any){
    //Mensaje Toast
    var miToast = document.getElementById('toast'); 
    var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; 
    this.mensaje_toast=mensaje;
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      if (tipo_mensaje=='exito') {
        this.renderer.setStyle(toast_cabezera, 'background', '#437848ee');
      }
      if (tipo_mensaje=='modificar') {
        this.renderer.setStyle(toast_cabezera, 'background', '#4e8b8b');
      }
      if (tipo_mensaje=='error') {
        this.renderer.setStyle(toast_cabezera, 'background', '#8d4646ee');
      }
    }
    toast.show()
  }




  
}
