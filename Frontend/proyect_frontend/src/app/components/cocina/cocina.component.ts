import { Component,ElementRef,Renderer2, ViewChild  } from '@angular/core';
import { VentaService } from "../../services/ventas.service";
import { SharedservicesService } from 'src/app/services/sharedservices.service';
import { SocketService } from '../../services/socket.service';
import { CajaService } from '../../services/caja.service';
import { forkJoin } from 'rxjs';
import chroma from 'chroma-js';


@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.css']
})
export class CocinaComponent {
  @ViewChild('ventasContainer', { static: false }) ventasContainerRef!: ElementRef;
  scrollPosition = window.scrollY;
  scrollPosition_Pedidos = window.scrollY;
  scrollPosition_Llevar = window.scrollY;
  ventas=[{cod_venta:'',cod_caja:1, factura:'', mesa:null, vent_llevar:false, total_bs:0, pagado_bs:null, cambio_bs:0, total_arg:0, pag_arg:null, cambio_arg:0, hora:'', estado:1, descrip_venta:'',estado_l:1,ticket:0}];
  detalle=[{cod_item:'',cod_venta:'', cod_producto:'', unidad_item:'', descript_item:'', item_llevar:false,nom_pro:'',cod_categoria:''}];
  item_presa=[{cod_item:'', cod_presa:'', unidad_presa:'',nom_presa:''}];
  ventasConDetalles: any[] = [];
  ventasConDetallesLlevar: any[] = [];
  last_caja:any={cod_venta:null, cod_item:null ,cod_caja:null,estado:null,hr_apertura:null};
  flag_Inicio:boolean=false;
  searchedMesa: string = '';
  mesaFound: boolean = false;
  container_lista=true;

  constructor(
    private ventaService: VentaService,
    private socketService: SocketService,
    private cajaService: CajaService,
    private renderer: Renderer2
  ){
  if (this.flag_Inicio==false) {
       this.obtener_codCaja();
       this.flag_Inicio=true;
       console.log("1.- Cocina Ventas: ", this.ventasConDetalles);
   }


  }

  ngOnInit() {
    this.socketService.receiveEvent((data: any) => {
      console.log('Evento personalizado recibido en Angular:', data);
      this.obtenerScrollPosition();
      console.log("2.- Cocina Ventas: ", this.ventasConDetalles);
      this.obtener_codCaja();
    });
  }


  obtenerScrollPosition() {
    if (this.ventasContainerRef) {
      this.scrollPosition = this.ventasContainerRef.nativeElement.scrollTop;
      console.log('Scroll 1:::', this.scrollPosition);
    }
  }  

 //BUSCADOR
 searchMesa() {
    console.log("busando...");
    
    this.mesaFound = false;
    const mesaToSearch = parseInt(this.searchedMesa);
    
    if (mesaToSearch === null) {
      // Si la búsqueda está vacía, no hacemos nada especial
      return;
    }
  
    // Itera a través de las tarjetas y busca la mesa
    this.ventasConDetalles.forEach((ventaDetalles, i) => {
      if (ventaDetalles.venta.mesa === mesaToSearch) {
        this.mesaFound = true;
  
        // Utiliza JavaScript para desplazar el scroll al elemento
        const element = document.getElementById(`element-${i}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
 }

 searchMesa_L() {
  console.log("busando...");
  
  this.mesaFound = false;
  const mesaToSearch = parseInt(this.searchedMesa);
  
  if (mesaToSearch === null) {
    // Si la búsqueda está vacía, no hacemos nada especial
    return;
  }

  // Itera a través de las tarjetas y busca la mesa
  this.ventasConDetallesLlevar.forEach((ventaDetalles, i) => {
    if (ventaDetalles.venta.mesa === mesaToSearch) {
      this.mesaFound = true;

      // Utiliza JavaScript para desplazar el scroll al elemento
      const element = document.getElementById(`element_p-${i}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

//  Estado Pedido
 pedido_Proceso(venta:any,index:any){
    const cod_venta=venta.venta.cod_venta;  const estado= venta.venta.estado;

    const cabezera = document.getElementById('cabezera'+index);
    const process = document.getElementById('process'+index);
    const hecho = document.getElementById('hecho'+index);
    const llevarPedido = document.getElementById('llevarPedido'+index);
    const llevarItems = document.querySelectorAll('.llevarItem' + index);

    let colorP='any';

    if (process) {
      const background = getComputedStyle(process);
      console.log("color rgb",background.backgroundColor);
      colorP = chroma(background.backgroundColor).hex();
    }
      console.log("color hexadecimal",colorP);
    //CAMBIAR ESTADO A 2 = EN PROCESO
    if (colorP == '#e9e9e900') {
      this.renderer.setStyle(cabezera, 'background-color', '#8e5c39');
      this.renderer.setStyle(process, 'background-color', '#8c8c8c5e');
      this.cambiarEstado(cod_venta,2);
      this.ventas[index].estado=2
    } //CAMBIAR ESTADO A 1 = NO EN PROCESO
    else if (colorP == '#8c8c8c5e') {
      this.renderer.setStyle(cabezera, 'background-color', '#22475d');
      this.renderer.setStyle(process, 'background-color', '#e9e9e900');
      this.renderer.setStyle(hecho, 'background-color', '#e9e9e900');
      if (llevarPedido) {
        this.renderer.setStyle(llevarPedido, 'color', '#ff995f');
      }
      if (llevarItems) {
        llevarItems.forEach((llevarItem: Element) => {
          // Verificar que el elemento sea un HTMLElement antes de intentar establecer estilos
          if (llevarItem instanceof HTMLElement) {
            this.renderer.setStyle(llevarItem, 'color', '#ee7c3a');
          }
        });
      }
      this.cambiarEstado(cod_venta,1);
      this.ventas[index].estado=1
    }

 }

 pedido_Entregado(venta:any,index:any){
  const cod_venta=venta.venta.cod_venta;  const estado= venta.venta.estado;

    const cabezera = document.getElementById('cabezera'+index);
    const hecho = document.getElementById('hecho'+index);
    const process = document.getElementById('process'+index);
    const llevarPedido = document.getElementById('llevarPedido'+index);
    const llevarItems = document.querySelectorAll('.llevarItem' + index);

    let colorH='any'; let colorC='any'; let colorP='any';

    if (hecho && cabezera && process) {
      const backgroundH = getComputedStyle(hecho);      colorH = chroma(backgroundH.backgroundColor).hex();
      const backgroundC = getComputedStyle(cabezera);   colorC = chroma(backgroundC.backgroundColor).hex();
      const backgroundP = getComputedStyle(process);    colorP = chroma(backgroundP.backgroundColor).hex();
    }

    //CAMBIAR ESTADO A 3 = ENTREGADO
    if (colorH == '#e9e9e900') {
      this.renderer.setStyle(cabezera, 'background-color', '#5d5d5d');
      this.renderer.setStyle(hecho, 'background-color', '#8c8c8c5e');
      this.renderer.setStyle(process, 'background-color', '#8c8c8c5e');
      if (llevarPedido) {
        this.renderer.setStyle(llevarPedido, 'color', '#ffff');
      }
      if (llevarItems) {
        llevarItems.forEach((llevarItem: Element) => {
          // Verificar que el elemento sea un HTMLElement antes de intentar establecer estilos
          if (llevarItem instanceof HTMLElement) {
            this.renderer.setStyle(llevarItem, 'color', '#555555');
          }
        });
      }
      
      this.cambiarEstado(cod_venta,3);
      this.ventas[index].estado=3
    }
    //CAMBIAR ESTADO A 2 = EN PROCESO
    else if (colorH == '#8c8c8c5e') {
      if (colorP == '#e9e9e900') {
        this.renderer.setStyle(cabezera, 'background-color', '#8c8c8c5e');
      }else{
        this.renderer.setStyle(cabezera, 'background-color', '#8e5c39');
      }
      this.renderer.setStyle(hecho, 'background-color', '#e9e9e900');
      if (llevarPedido) {
        this.renderer.setStyle(llevarPedido, 'color', '#ff995f');
      }
      if (llevarItems) {
        llevarItems.forEach((llevarItem: Element) => {
          // Verificar que el elemento sea un HTMLElement antes de intentar establecer estilos
          if (llevarItem instanceof HTMLElement) {
            this.renderer.setStyle(llevarItem, 'color', '#ee7c3a');
          }
        });
      }
      this.cambiarEstado(cod_venta,2);
      this.ventas[index].estado=2;
    }
  
 }
// Estado Pedido Para Llevar
 pedido_Proceso_L(venta:any,index:any){
    const cod_venta=venta.venta.cod_venta;  const estado= venta.venta.estado;

    const cabezera = document.getElementById('cabezera_p'+index);
    const process = document.getElementById('process_p'+index);
    const hecho = document.getElementById('hecho_p'+index);
    const llevarPedido = document.getElementById('llevarPedido_p'+index);
    const llevarItems = document.querySelectorAll('.llevarItem_p' + index);

    let colorP='any';

    if (process) {
      const background = getComputedStyle(process);
      console.log("color rgb",background.backgroundColor);
      colorP = chroma(background.backgroundColor).hex();
    }
      console.log("color hexadecimal",colorP);
    //CAMBIAR ESTADO A 2 = EN PROCESO
    if (colorP == '#e9e9e900') {
      this.renderer.setStyle(cabezera, 'background-color', '#8e5c39');
      this.renderer.setStyle(process, 'background-color', '#8c8c8c5e');
      this.cambiarEstado_L(cod_venta,2);
      this.ventasConDetallesLlevar[index].venta.estado_l=2;
      console.log('::::',this.ventasConDetallesLlevar[index].venta );
      
    } //CAMBIAR ESTADO A 1 = NO EN PROCESO
    else if (colorP == '#8c8c8c5e') {
      this.renderer.setStyle(cabezera, 'background-color', '#22475d');
      this.renderer.setStyle(process, 'background-color', '#e9e9e900');
      this.renderer.setStyle(hecho, 'background-color', '#e9e9e900');
      if (llevarPedido) {
        this.renderer.setStyle(llevarPedido, 'color', '#ff995f');
      }
      if (llevarItems) {
        llevarItems.forEach((llevarItem: Element) => {
          // Verificar que el elemento sea un HTMLElement antes de intentar establecer estilos
          if (llevarItem instanceof HTMLElement) {
            this.renderer.setStyle(llevarItem, 'color', '#ee7c3a');
          }
        });
      }
      this.cambiarEstado_L(cod_venta,1);
      this.ventasConDetallesLlevar[index].venta.estado_l=1;
      console.log('::::',this.ventasConDetallesLlevar[index].venta );
    }

 }

 pedido_Entregado_L(venta:any,index:any){
  const cod_venta=venta.venta.cod_venta;  const estado= venta.venta.estado;

    const cabezera = document.getElementById('cabezera_p'+index);
    const hecho = document.getElementById('hecho_p'+index);
    const process = document.getElementById('process_p'+index);
    const llevarPedido = document.getElementById('llevarPedido_p'+index);
    const llevarItems = document.querySelectorAll('.llevarItem_p' + index);

    let colorH='any'; let colorC='any'; let colorP='any';

    if (hecho && cabezera && process) {
      const backgroundH = getComputedStyle(hecho);      colorH = chroma(backgroundH.backgroundColor).hex();
      const backgroundC = getComputedStyle(cabezera);   colorC = chroma(backgroundC.backgroundColor).hex();
      const backgroundP = getComputedStyle(process);    colorP = chroma(backgroundP.backgroundColor).hex();
    }

    //CAMBIAR ESTADO A 3 = ENTREGADO
    if (colorH == '#e9e9e900') {
      this.renderer.setStyle(cabezera, 'background-color', '#5d5d5d');
      this.renderer.setStyle(hecho, 'background-color', '#8c8c8c5e');
      this.renderer.setStyle(process, 'background-color', '#8c8c8c5e');
      if (llevarPedido) {
        this.renderer.setStyle(llevarPedido, 'color', '#ffff');
      }
      if (llevarItems) {
        llevarItems.forEach((llevarItem: Element) => {
          // Verificar que el elemento sea un HTMLElement antes de intentar establecer estilos
          if (llevarItem instanceof HTMLElement) {
            this.renderer.setStyle(llevarItem, 'color', '#555555');
          }
        });
      }
      
      this.cambiarEstado_L(cod_venta,3);
      this.ventasConDetallesLlevar[index].venta.estado_l=3;
      console.log('::::',this.ventasConDetallesLlevar[index].venta );
    }
    //CAMBIAR ESTADO A 2 = EN PROCESO
    else if (colorH == '#8c8c8c5e') {
      if (colorP == '#e9e9e900') {
        this.renderer.setStyle(cabezera, 'background-color', '#8c8c8c5e');
      }else{
        this.renderer.setStyle(cabezera, 'background-color', '#8e5c39');
      }
      this.renderer.setStyle(hecho, 'background-color', '#e9e9e900');
      if (llevarPedido) {
        this.renderer.setStyle(llevarPedido, 'color', '#ff995f');
      }
      if (llevarItems) {
        llevarItems.forEach((llevarItem: Element) => {
          // Verificar que el elemento sea un HTMLElement antes de intentar establecer estilos
          if (llevarItem instanceof HTMLElement) {
            this.renderer.setStyle(llevarItem, 'color', '#ee7c3a');
          }
        });
      }

      this.cambiarEstado_L(cod_venta,2);
      this.ventasConDetallesLlevar[index].venta.estado_l=2;
      console.log('::::',this.ventasConDetallesLlevar[index].venta );
    }

 }



 cambiarEstado(cod_venta:any,estado:any){
  this.ventaService.put_Venta_estado(cod_venta,estado)
  .subscribe(
    res => {
      console.log('Venta estado cambiado');
      this.socketService.sendEvent({ message: 'Nueva venta agregada' });
    },
    err => console.log(err)
  );
 }

 cambiarEstado_L(cod_venta:any,estado:any){
  this.ventaService.put_Venta_estado_l(cod_venta,estado)
  .subscribe(
    res => {
      console.log('Venta estado cambiado');
      this.socketService.sendEvent({ message: 'Nueva venta agregada' });
    },
    err => console.log(err)
  );
 }

 cambiarVentana(){ //Cambia la Venta de Pedidos a Para Llevar o viceversa y tambien guarda el scroll del anterior antes de cambiar de vista para que al volver vuelva al scroll(posicion) que estaba
  console.log('-------------------Obtener scrool position::');

  this.container_lista=!this.container_lista;
  console.log('Valor container:: ', this.container_lista);
  if (!this.container_lista) { //Si es false estaba en lista (Pedidos) y mostrara lista (Para Llevar) 
    this.obtenerScrollPosition2(true);
    setTimeout(() => {
      if (this.ventasContainerRef && this.ventasContainerRef.nativeElement) {
        console.log('Scroll Pedidos:::', this.scrollPosition);
        this.ventasContainerRef.nativeElement.scrollTop = this.scrollPosition_Llevar;
      }
    }, 0);
  }else{//Si es true estaba en lista (Para Llevar) y mostrara lista (Pedidos)
    this.obtenerScrollPosition2(false);
    setTimeout(() => {
      if (this.ventasContainerRef && this.ventasContainerRef.nativeElement) {
        console.log('Scroll Para Llevar:::', this.scrollPosition);
        this.ventasContainerRef.nativeElement.scrollTop = this.scrollPosition_Pedidos;
      }
    }, 0);
  }
  

 }

 obtenerScrollPosition2(container_lista:any) {
  if (container_lista) {
    if (this.ventasContainerRef) {
      this.scrollPosition_Pedidos = this.ventasContainerRef.nativeElement.scrollTop; //Guardamos el scroll de Pedidos
      console.log('Scroll Pedidos:::', this.scrollPosition_Pedidos);
    }
  }else{
    if (this.ventasContainerRef) {
      this.scrollPosition_Llevar = this.ventasContainerRef.nativeElement.scrollTop;//Guardamos el scroll de Para Llevar
      console.log('Scroll Para Llevar:::', this.scrollPosition_Llevar);
    }
  }


}  



 boton_HaciaAbajo(){
  if (this.ventasContainerRef && this.ventasContainerRef.nativeElement) {
    const container = this.ventasContainerRef.nativeElement;
    container.scrollTop = container.scrollHeight;
    console.log('Scrollllllllll');
  }
 }




//Proceso si Ventas esta Vacio
//*********** GET VENTAS ***********
  listar_Ventas(){
    this.ventasConDetalles = [];
    this.ventasConDetallesLlevar=[];
  // Llamadas a los servicios para obtener los datos

      const ventas$ = this.ventaService.get_Ventas_Api(this.last_caja);
      const detalle$ = this.ventaService.get_Detalle_Api();
      const itemPresa$ = this.ventaService.get_Item_Presa_Api();
      // Combinamos las llamadas usando forkJoin
      forkJoin([ventas$, detalle$, itemPresa$]).subscribe(
        ([ventas, detalle, item_presa]) => {
          this.ventas = ventas;
          this.detalle = detalle;
          this.item_presa = item_presa;
          
          // Una vez que tengamos todos los datos, ejecutamos la transformación
          this.transformarDatos();
        },
        err => {
          console.log('Error al obtener datos');
        }
      );
  }

  transformarDatos() {
    for (const venta of this.ventas) {
      const ventaConDetalles = { venta: venta, detalles: [] as any[] }; // Guarda la 1ra venta y crea otro array (detalles) que tendra los detalles de la venta
      const ventaConDetallesLlevar = { venta: venta, detalles: [] as any[] }; // Guarda la 1ra venta y crea otro array (detalles) que tendra los detalles de la venta para llevar
  
      for (const detalle of this.detalle) {
        if (detalle.cod_venta === venta.cod_venta && detalle.cod_categoria != '2') {
          const detalleConItems = { detalle: detalle, items: [] as any[] };
  
          for (const item of this.item_presa) {
            if (item.cod_item === detalle.cod_item) {
              detalleConItems.items.push(item);
            }
          }
  
          ventaConDetalles.detalles.push(detalleConItems);
  
          // Verificamos si item_llevar es true antes de agregar a la otra lista
          if (detalle.item_llevar) {
            ventaConDetallesLlevar.detalles.push(detalleConItems);
          }
        }
      }
  
      if (ventaConDetalles.detalles.length > 0) {
        this.ventasConDetalles.push(ventaConDetalles);
      }
  
      if (ventaConDetallesLlevar.detalles.length > 0) {
        this.ventasConDetallesLlevar.push(ventaConDetallesLlevar);
      }
    }
  
    for (const ventaConDetalles of this.ventasConDetalles) {
      ventaConDetalles.venta.pagado = this.porcentajeRedondeado(ventaConDetalles);
    }
  
    console.log('P:::', this.ventasConDetallesLlevar);
    console.log('P1:::', this.ventasConDetalles);
    console.log('Scroll 2:::', this.scrollPosition);
    
    setTimeout(() => {
      if (this.ventasContainerRef && this.ventasContainerRef.nativeElement) {
        this.ventasContainerRef.nativeElement.scrollTop = this.scrollPosition;
      }
    }, 0);
  }
  

  porcentajeRedondeado(ventaDetalles:any): any {
    if (ventaDetalles.venta.pagado_bs!=null && ventaDetalles.venta.pag_arg!=null) {
      const porcentaje =
                      (((ventaDetalles.venta.pagado_bs - ventaDetalles.venta.cambio_bs) / ventaDetalles.venta.total_bs) * 100) +
                      (((ventaDetalles.venta.pag_arg - ventaDetalles.venta.cambio_arg) / ventaDetalles.venta.total_arg) * 100);
      console.log("prueba:::",ventaDetalles.venta.pagado_bs); 
      return Math.round(porcentaje);
    }else if (ventaDetalles.venta.pag_arg==null) {
      const porcentaje =(((ventaDetalles.venta.pagado_bs - ventaDetalles.venta.cambio_bs) / ventaDetalles.venta.total_bs) * 100);
      return Math.round(porcentaje);
    }else if (ventaDetalles.venta.pagado_bs==null) {
      const porcentaje = (((ventaDetalles.venta.pag_arg - ventaDetalles.venta.cambio_arg) / ventaDetalles.venta.total_arg) * 100);
      return Math.round(porcentaje);
    }
    else{
      return 0;
    }
  }

  obtener_codCaja(){
    this.cajaService.get_LastCaja_Api()
    .subscribe(
      res => {
        this.last_caja=res;
        //Verificamos si cod_caja de getCodCaja es diferente de null
        const cod_cajaS=this.cajaService.getCodCaja();  const hr_aperturaS=this.cajaService.getHrApertura(); const estadoS=this.cajaService.getEstado();
        
        if (cod_cajaS!=null && this.last_caja[0].cod_caja!=cod_cajaS) {//4 //1
          this.last_caja[0].cod_caja=cod_cajaS; this.last_caja[0].hr_apertura=hr_aperturaS; this.last_caja[0].estado= estadoS;
          this.listar_Ventas();
        }else{
          this.listar_Ventas();
        }
      },
      err => console.log(err)
    );
  }




}
