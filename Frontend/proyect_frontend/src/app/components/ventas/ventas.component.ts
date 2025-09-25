import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ProductosService } from "../../services/productos.service";
import { VentaService } from "../../services/ventas.service";
import { SharedservicesService } from 'src/app/services/sharedservices.service';
import { Subscription, forkJoin} from 'rxjs';
import { jsPDF } from 'jspdf';
import {CajaService} from '../../services/caja.service'
import { SocketService } from '../../services/socket.service';
import * as bootstrap from 'bootstrap';
// import { Memoize } from 'ngx-memoize';

// This lets me use jquery
declare var $: any
@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent {
  @ViewChild('ventasContainer', { static: false }) ventasContainerRef!: ElementRef;
  @ViewChild('cardList') cardList!: ElementRef; // Referencia al elemento con la clase 'card-list'
  @ViewChild('cardList_movil') cardList_movil!: ElementRef; // Referencia al elemento con la clase 'card-list'
  //VARIABLES PARA MANIPULAR PRODUCTOS
  productoApi=[{cod_producto:'',cod_categoria:'',nom_pro:'',descrip_pro:'',precio_bs:'',precio_arg:''}];
  productosChunks: any[] = [];
  cantidadProducto=0;
  filterPost='';
  filterPostV='';
  //MOVIL::
  productosAux: any[] = []; // Inicializamos productosAux como un arreglo vacío
  productosLista: any[] = [];//Inicializamos un arreglo para guardar la lista por categorias

  //ARRAYS - VENTAS, DETALLE, ITEM_PRESA 
  ventas=[{cod_venta:'',cod_caja:1, factura:'', mesa:null, vent_llevar:false, total_bs:0, pagado_bs:null , cambio_bs:0, total_arg:0,  pag_arg:null, cambio_arg:0, hora:'', estado:1, descrip_venta:'',ticket:0}];

  detalle=[{cod_item:'',cod_venta:'', cod_producto:'', unidad_item:'', descript_item:'', item_llevar:false,nom_pro:'',cod_categoria:''}];
  item_presa=[{cod_item:'', cod_presa:'', unidad_presa:'',nom_presa:''}];
  ventasConDetalles: any[] = [];
  //VARIABLES PARA AGREGAR VENTA
  productoSelect:any[]=[]; //var para agregar los productos de una venta
  //VARIABLES MODIFICAR VENTA
  Button_Modificar=0; Button_Registrar=1;
  DetalleOriginal=0;
  cod_items:any[]=[];
  cod_items2:any[]=[];
 //AGREGAR VENTA MOVIL
  pantalla_form=false;
 //ELIMINAR  VENTA 
  eliminar_venta=[];
  mesa_del=0;
  num_del=0;
  //Buscador de Ventas
 //Obtenemos el contenedor Padre de tarjetas de ventas
  //PDF
  pdfurl: string = ''; // Establece la ruta correcta a tu archivo PDF aquí
  //VARIABLE BADERA
  flag_Inicio:boolean=false;
  last_caja:any={cod_venta:null, cod_item:null ,cod_caja:null,estado:null,hr_apertura:null};
  //Variables boton incremente automatico mientras presionamos el boton
  incrementoIntervalMas: any; // Para el botón de suma
  incrementoIntervalMenos: any; // Para el botón de resta
  mensaje_toast='';//Mensaje toast
  //Buscador
  searchedMesa: string = '';
  mesaFound: boolean = false;
  container_lista=true;
  container_form=false;
  categoriasLista : any[] = [];
  categoriaSeleccionada=1;

  private incrementarCantidad(item: any) {this.botonProducto_Mas(item);}
  private decrementarCantidad(item: any) {this.botonProducto_Menos(item);}
  
  
  private ventaSubscription: Subscription | undefined;
  constructor( 
    private productoService:ProductosService, 
    private ventaService:VentaService,
    private renderer: Renderer2,
    private cajaService:CajaService,
    private socketService: SocketService
    ){
      // this.socketService.receiveEvent((data: any) => {
      //   console.log('Evento personalizado recibido en Angular desde Cocina:', data);
      //   if (!this.flag_Inicio) {
      //     this.obtener_codCaja();
      //     this.flag_Inicio=true;
      //   }
      // });
  
      if (!this.flag_Inicio) {
        this.obtener_codCaja();
        this.flag_Inicio=true;
      }

  }
  ngOnInit() {
    this.socketService.receiveEvent((data: any) => {
      console.log('Evento personalizado recibido en Angular:', data);
      this.obtener_codCaja();
      this.categoriaSeleccionada=1;
    });

  }


  //Boton Menu Card
  currentCardIndex: number | null = null;
  ventaMenuVisible: boolean = false;
  openMenu(index: number): void {
    if (this.currentCardIndex === index) {
      // Si el mismo botón fue presionado nuevamente, oculta el menú
      this.currentCardIndex = null;
      this.ventaMenuVisible = false;
    } else {
      // Si se presionó otro botón, muestra el menú correspondiente
      this.currentCardIndex = index;
      this.ventaMenuVisible = true;
    }
  }
  closeMenu(){
    this.currentCardIndex = null;
    this.ventaMenuVisible = false;
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
  
  showModalEliminar(modal:any,venta:any, mesa:any, num_vent:any):void{
    this.eliminar_venta=venta; this.mesa_del=mesa; this.num_del= num_vent;
    $("#modalEliminarVenta").modal('show');
    // this.id_user= ci_usuario;
    // this.nom_user= nom_usu;
  }
  showModalPagar():void{
    console.log('Productos a Pagar::', this.productoSelect);
    this.divisaInputChange();
    this.calcular_Debe();
    $("#modalPagar").modal('show');
  }
  showModalAddProducto():void{
    console.log('Add Productos::');
    
    $("#modalAddProducto").modal('show');
  }
  index:any//para capturar el index de productoSelect
  showModalDetalleVenta(index:any):void{
    // console.log('item::',this.productoSelect[index].prod.opciones);
    this.index=index;
    $("#modalDetalleVenta").modal('show');
  }
  borrarDetalle(index:any){
    this.productoSelect[index].prod.descript_item='';
  }
  //Opciones Descripcion
  showOpciones=false;
  openOpciones(){
    this.showOpciones=true;
  }
  closeOpciones(){
    this.showOpciones=false;
  }
  
  opcionesIndex:any//para capturar el index de productoSelect
  showModalDetalleOpciones(index:any):void{
    console.log('item::',this.productoSelect[index].prod.opciones);
    this.opcionesIndex=index;
    $("#modalDetalleOpciones").modal('show');
  }

  ngAfterViewInit() {
    // Aquí es donde ajustaremos la posición de desplazamiento después de que la vista se haya inicializado
    this.scrollToLastSale();
  }
  scrollToLastSale() {
    if (this.ventasContainerRef) {
      const containerElement = this.ventasContainerRef.nativeElement;
      containerElement.scrollTop = containerElement.scrollHeight;
    }
  }


  LimpiarDatos(){
    this.container_lista=true;
    this.container_form=false;
    this.ventas=[{cod_venta:'',cod_caja:1, factura:'', mesa:null, vent_llevar:false, total_bs:0, pagado_bs:null, cambio_bs:0, total_arg:0, pag_arg:null, cambio_arg:0, hora:'', estado:1, descrip_venta:'',ticket:0}];
    this.detalle=[{cod_item:'',cod_venta:'', cod_producto:'', unidad_item:'', descript_item:'', item_llevar:false ,nom_pro:'',cod_categoria:''}];
    this.item_presa=[{cod_item:'', cod_presa:'', unidad_presa:'',nom_presa:''}];
    this.productoSelect=[];
    this.Button_Registrar=1;    this.Button_Modificar=0; this.pantalla_form=false;
    this.cod_items=[];
    this.cod_items2=[];
    this.eliminar_venta=[];
    this.mesa_del=0;
    this.num_del=0;
    this.categoriaSeleccionada= 1; this.listarProductos();
    //cerramos el menu de la card
    this.closeMenu();
      setTimeout(() => {
        this.scrollToLastSale();
      }, 0); // Ajusta la posición de desplazamiento

  }

  // LISTAR CATEGORIAS
  listar_Categorias(){
    this.productoService.getCategoriasApi()
    .subscribe(
      res => {
        this.categoriasLista = res;
        // console.log('categoria Lista:: ', this.categoriasLista);    
      },
      err => console.log('Error al obtener Categorias')
    );
  }  
  seleccionarLista(){
    const categoriaSeleccionada= +this.categoriaSeleccionada; //+: convierte la variable a numero
    this.productosLista.splice(0,this.productosLista.length); //Vaciamos el array
    // console.log("Categoria Seleccionada:", categoriaSeleccionada);
    
    if (categoriaSeleccionada == 0) {
      // Si la categoría seleccionada es "Todo", muestra todos los productos
      this.productosAux.forEach((producto:any,index) => {
        //console.log(producto.nom_pro+' '+index);
          this.productosLista.push(producto);
      });
    } else {
      // Filtra los productos según la categoría seleccionada
      this.productosAux.forEach((producto:any,index) => {
        //console.log(producto.nom_pro+' '+index);
        if (producto.cod_categoria==categoriaSeleccionada) {
          this.productosLista.push(producto);
        }
      });
    }
    // console.log(this.productosLista);
  }
  // CRUD PRODUCTOS
  listarProductos(){
    this.productoService.getProductosApi()
    .subscribe(
      res => {
        this.productoApi = res;
        this.productosAux = Object.values(this.productoApi);// Actualizamos productosAux con los datos de productos
        this.productosLista = Object.values(this.productoApi);
        this.seleccionarLista();       
      },
      err => console.log('Error al obtener Productos')
    ) 
  }


//PRESION CONTINUA DEL BOTON, INCREMENTO AUTOMATICO DE PRODUCTO
  comenzarIncremento(item: any, operacion: string) {
    // Comienza a repetir la operación cada X milisegundos
    if (operacion === 'botonProducto_Mas') {
      this.incrementoIntervalMas = setInterval(() => {
        this.incrementarCantidad(item);
      }, 100); // Cambia el valor 200 a la velocidad que desees para la suma
    } else if (operacion === 'botonProducto_Menos') {
      this.incrementoIntervalMenos = setInterval(() => {
        this.decrementarCantidad(item);
      }, 100); // Cambia el valor 200 a la velocidad que desees para la resta
    }
  }
  
  detenerIncremento(operacion: string) {
    // Detiene la repetición según la operación
    if (operacion === 'botonProducto_Mas') {
      clearInterval(this.incrementoIntervalMas);
    } else if (operacion === 'botonProducto_Menos') {
      clearInterval(this.incrementoIntervalMenos);
    }
  }
  

  botonProducto_Mas(item:any){  
    item.unidad_item++; 
    this.ventas[0].total_bs= this.ventas[0].total_bs+item.precio_bs;
    this.ventas[0].total_arg= this.ventas[0].total_arg+item.precio_arg; 
  }
  botonProducto_Menos(item:any){
    if (item.unidad_item<=0) {
      item.unidad_item=0;
      this.ventas[0].total_bs=0;
      this.ventas[0].total_arg=0; 
    } 
    else{ 
      item.unidad_item--;  
      this.ventas[0].total_bs =this.ventas[0].total_bs-item.precio_bs;
      this.ventas[0].total_arg =this.ventas[0].total_arg-item.precio_arg;
    }
  }
  botonPresa_Mas(item:any,i:any){
    const unidad_prod=this.productoSelect[i].prod.unidad_item;
    const suma_Presas=this.productoSelect[i].item_presaA.unidad_presa+this.productoSelect[i].item_presaPi.unidad_presa+this.productoSelect[i].item_presaPe.unidad_presa;
    if (unidad_prod>suma_Presas) {
        item.unidad_presa++;
    }
  }
  botonPresa_Menos(item:any){
    if (item.unidad_presa<=0){ 
      item.unidad_presa=0;
    }else{
      item.unidad_presa--;
    }
  }
  botonArroz_Mas(item:any,i:any){
    const unidad_prod=this.productoSelect[i].prod.unidad_item;
    const unidad_arroz=this.productoSelect[i].prod.unidad_arroz;
    if (unidad_prod>unidad_arroz) {
      item.unidad_arroz++;
    }

  }
  botonArroz_Menos(item:any){
    if (item.unidad_arroz<=0){
      item.unidad_arroz=0;
    }else{ 
      item.unidad_arroz--;
    }
  }

// ****** Agregar Cambio del pedido ************
  formularioPagar: any = {};
  divisaSelected=1; input_Bol=true; input_Arg=false; input_devolver=false; debe_bs:any; debe_arg:any;
  calcular_Debe(){
    let pagado_bs:any = this.ventas[0].pagado_bs || 0;  let cambio_bs:any= this.ventas[0].cambio_bs || 0;
    let pag_arg:any = this.ventas[0].pag_arg ||0;  let cambio_arg:any = this.ventas[0].cambio_arg || 0;
    const porc_bs=(((pagado_bs-cambio_bs)/this.ventas[0].total_bs)*100); console.log('Porcentaje BS::',porc_bs);
    const porc_arg=(((pag_arg-cambio_arg)/this.ventas[0].total_arg)*100); 
    const porc_pagado=porc_bs+porc_arg;                                    console.log('Porcentaje pagado::',porc_pagado);
    const porc_faltante=100 -porc_pagado;                                  console.log('Porcentaje Faltante::',porc_faltante);
    const falta_bs= porc_faltante*(this.ventas[0].total_bs/100);           console.log('Falta en Debe BS::',Math.round(falta_bs));
    const falta_arg= porc_faltante*(this.ventas[0].total_arg/100);         console.log('Falta en Debe ARG::',(Math.round(falta_arg / 100) * 100));
    this.debe_bs=Math.round(falta_bs);
    this.debe_arg=(Math.round(falta_arg / 100) * 100)//redondea a multiplos de 100: 1167=1200 

  }
  pagar_Pedido(){
    //Agregamos los datos introducidos
    if (this.formularioPagar.pagado_bs) {
      this.ventas[0].pagado_bs=this.formularioPagar.pagado_bs+this.ventas[0].pagado_bs;
    }
    if (this.formularioPagar.cambio_bs) {
      this.ventas[0].cambio_bs=this.formularioPagar.cambio_bs+this.ventas[0].cambio_bs;
    }
    if (this.formularioPagar.pag_arg) {
      this.ventas[0].pag_arg=this.formularioPagar.pag_arg+this.ventas[0].pag_arg;
    }
    if (this.formularioPagar.cambio_arg) {
      this.ventas[0].cambio_arg=this.formularioPagar.cambio_arg+this.ventas[0].cambio_arg;
    }
    this.calcular_Debe();
    //Limpiamos el formulario
    this.formularioPagar= {};
  }
  divisaInputChange(){ 
    this.formularioPagar= {};
    let pagado_bs:any = this.ventas[0].pagado_bs || 0;  let cambio_bs:any= this.ventas[0].cambio_bs || 0;
    let pag_arg:any = this.ventas[0].pag_arg ||0;  let cambio_arg:any = this.ventas[0].cambio_arg || 0;

    if (this.divisaSelected==1) {
      if ((pag_arg - cambio_arg) == this.ventas[0].total_arg) {
        this.debe_bs=0;
      }else{
        //this.verificarTotal_Arg();
        this.calcular_Debe();
      }
      this.input_Bol=true;
      this.input_Arg=false;
      
    }else if (this.divisaSelected==2) {
      this.input_Bol=false;
      this.input_Arg=true;
      if ((pagado_bs - cambio_bs) == this.ventas[0].total_bs) {
        this.debe_arg=0;
      }else{
        //this.verificarTotal_Bs();
        this.calcular_Debe();
      }
    }  
  }
  // verificarTotal(){//Verificar cuanto deberia en Bs o Arg si se paga en ambos


   
  // }
  // verificarTotal_Bs(){
  //   this.debe_bs=this.ventas[0].total_bs; this.debe_arg=this.ventas[0].total_arg;
  //   this.debe_bs=this.ventas[0].total_bs; this.debe_arg=this.ventas[0].total_arg;
  //   let pagado_bs:any = this.ventas[0].pagado_bs || 0;  let cambio_bs:any= this.ventas[0].cambio_bs || 0;
  //   let pag_arg:any = this.ventas[0].pag_arg ||0;  let cambio_arg:any = this.ventas[0].cambio_arg || 0;
  //   //console.log('Total Bs: ', this.ventas[0].total_bs); console.log('Pagado Bs: ', pagado_bs); console.log('Cambio Bs: ', cambio_bs);

  //   //BOLIVIANO::Verificar cuanto deberia en Arg si se pago menos en Boliviano
  //   if (pagado_bs>0 && (pagado_bs-cambio_bs) < this.ventas[0].total_bs) {
  //     const porc_bs=100-(((pagado_bs-cambio_bs)/this.ventas[0].total_bs)*100);              console.log("resto arg:",porc_bs);
  //     const falta_ps= porc_bs*(this.ventas[0].total_arg/100);                   console.log("falta peso:: ", Math.round(falta_ps));    
  //     this.debe_arg = (Math.round(falta_ps / 100) * 100)//redondea a multiplos de 100: 1167=1200   
  //   }
  
  // }
  // verificarTotal_Arg(){
  //   this.debe_bs=this.ventas[0].total_bs; this.debe_arg=this.ventas[0].total_arg;
  //   this.debe_bs=this.ventas[0].total_bs; this.debe_arg=this.ventas[0].total_arg;
  //   let pagado_bs:any = this.ventas[0].pagado_bs || 0;  let cambio_bs:any= this.ventas[0].cambio_bs || 0;
  //   let pag_arg:any = this.ventas[0].pag_arg ||0;  let cambio_arg:any = this.ventas[0].cambio_arg || 0;

  //    //ARGENTINO::Verificar cuanto deberia en Boliviano si se pago menos en Argentino    
  //   if (pag_arg>0 && pag_arg < this.ventas[0].total_arg && pagado_bs==0) {
  //     const porc_ps=100-(((pag_arg-cambio_arg)/this.ventas[0].total_arg)*100);                console.log("resto bs:",porc_ps);
  //     const falta_bs= porc_ps*(this.ventas[0].total_bs/100);                     console.log("falta boliviano:: ", Math.round(falta_bs));    
  //     // this.ventas[0].pagado_bs = Math.round(falta_bs);
  //     this.debe_bs=Math.round(falta_bs);
  //   }

  // }
  cambioVenta(){
    
    let pagado_bs:any = this.formularioPagar.pagado_bs || 0;  let cambio_bs:any= this.formularioPagar.cambio_bs || 0;
    let pag_arg:any = this.formularioPagar.pag_arg ||0;  let cambio_arg:any = this.formularioPagar.cambio_arg || 0;

    if (this.divisaSelected==1) { //Si la divisa es en Bolivianos
      if (pagado_bs>0) {
        if (pagado_bs>=this.debe_bs){
          cambio_bs=pagado_bs-this.debe_bs;
        }else{
          cambio_bs=0;
       }
      }else{
        pagado_bs=null;
      }
      this.formularioPagar.pagado_bs = pagado_bs;
      this.formularioPagar.cambio_bs = cambio_bs;
    }
    else if (this.divisaSelected==2) {//Si la divisa es en Argentinos
      if (pag_arg>0) {
        console.log('1--Pagado Arg: ', pag_arg);
        console.log('1--Debe Arg: ', this.debe_arg);
        console.log('1--Cambio Arg: ', cambio_arg);
        if (pag_arg>=this.debe_arg){
            cambio_arg=pag_arg-this.debe_arg;
        }else{
          // this.ventas[0].cambio_arg=0;
          cambio_arg=0;
        }
      }else{
        pag_arg=null;
      }
      this.formularioPagar.pag_arg=pag_arg;
      this.formularioPagar.cambio_arg=cambio_arg;
      console.log('2--Pagado Arg: ', this.formularioPagar.pag_arg);
      console.log('2--Cambio Arg: ', this.formularioPagar.cambio_arg);
    }
  }

  eliminarPagoDivisa(divisa:any){
    if (divisa==1) {
      this.ventas[0].pagado_bs=null;//0
      this.ventas[0].cambio_bs=0;//0
      //this.verificarTotal_Arg();
      this.calcular_Debe();
    } 
    if (divisa==2) {
      this.ventas[0].pag_arg=null;
      this.ventas[0].cambio_arg=0;
      //this.verificarTotal_Bs();
      this.calcular_Debe();
    }
    this.cambioVenta();
  }
// ---------------------------------------------
  limpiar_pagar_pedido(){
    this.ventas[0].cambio_bs=0;  this.ventas[0].cambio_arg=0;
    this.ventas[0].pagado_bs=null;    this.ventas[0].pag_arg=null;
  }

// ************************* CRUD DE VENTAS *************************
//*********** GET VENTAS ***********
  listar_Ventas(){
    this.ventasConDetalles = [];
  // Llamadas a los servicios para obtener los datos
    // console.log("Caja Listada: ", this.last_caja[0].cod_caja);

  if (this.last_caja[0].cod_caja!=null) {  
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
  }else{
    
  }
 
  }

//RECORREMOS LOS 3 ARRAYS Y LOS GUARDAMOS EN UNO SOLO
  transformarDatos() {
    for (const venta of this.ventas) {
      const ventaConDetalles = { venta: venta, detalles: [] as any[] }; // Guarda la 1ra venta y crea otro array (detalles) que tendra los detalles de la venta
        for (const detalle of this.detalle) { //Recorre el array principal (detalle)  
            if (detalle.cod_venta === venta.cod_venta) { //Si el (cod_venta de detalle) es igual al (cod_venta de venta)
              const detalleConItems = { detalle: detalle, items: [] as any[] }; // Guardamos en detalleConItems el 1er detalle coicidente y creamos un array (items) que tendra los items_presa del detalle
                  for (const item of this.item_presa) { //Recorremos el array principal item_presa
                    if (item.cod_item === detalle.cod_item) {//Si (cod_item de item) es igual a (cod_item de detalle)  
                      detalleConItems.items.push(item); //Agregamos al array creado detalleConItems el item coincidente
                    }
                  }
              ventaConDetalles.detalles.push(detalleConItems); //Agregamos al array ventaConDetalles el detalle coincidente
            }
        }
      this.ventasConDetalles.push(ventaConDetalles); //Agregamos al array ventasConDetalles el ventaConDetalles coincidente
      // this.ventasConDetalles.reverse();
    }
    for (const ventaConDetalles of this.ventasConDetalles) {
      ventaConDetalles.venta.pagado = this.porcentajeRedondeado(ventaConDetalles);
    }
    setTimeout(() => {
      this.scrollToLastSale();
    }, 0); // Ajusta la posición de desplazamiento
    console.log('Ventas:::',this.ventasConDetalles);

    this.LimpiarDatos();
  }

  porcentajeRedondeado(ventaDetalles:any): any {
    if (ventaDetalles.venta.pagado_bs!=null && ventaDetalles.venta.pag_arg!=null) {
      const porcentaje =
                      (((ventaDetalles.venta.pagado_bs - ventaDetalles.venta.cambio_bs) / ventaDetalles.venta.total_bs) * 100) +
                      (((ventaDetalles.venta.pag_arg - ventaDetalles.venta.cambio_arg) / ventaDetalles.venta.total_arg) * 100);
      // console.log("prueba:::",ventaDetalles.venta.pagado_bs); 
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

//*********** AGREGAR VENTA ***********
  agregar_ProductoSeleccionado(producto:any){  
    if (this.last_caja[0].estado==1) {
        //Mensaje Toast
        var miToast = document.getElementById('toast'); 
        var toast_cabezera = document.getElementById('toast-cabezera'); 
        let toast:any; this.mensaje_toast='Aperturar Caja'
        if (miToast && toast_cabezera) {
          toast = new bootstrap.Toast(miToast);
          this.renderer.setStyle(toast_cabezera, 'background', '#8d4646ee');
    }
     toast.show();
    }else{
      this.ventas[0].total_bs= this.ventas[0].total_bs+producto.precio_bs;
      this.ventas[0].total_arg= this.ventas[0].total_arg+producto.precio_arg; 
      const prod = {cod_producto:producto.cod_producto, nom_pro:producto.nom_pro,cod_categoria:producto.cod_categoria, precio_bs:producto.precio_bs, precio_arg: producto.precio_arg, unidad_item:1, item_llevar:false,unidad_arroz:0, descript_item:'',opciones:producto.opciones}
      const detalle = {prod, item_presaA:{cod_presa:1,unidad_presa:0},item_presaPi:{cod_presa:2,unidad_presa:0},item_presaPe:{cod_presa:3,unidad_presa:0} };
      this.productoSelect.push(detalle);
      this.filterPost='';
    }
  }

  eliminar_ProductoSeleccionado(producto:any,index:any){
    this.ventas[0].total_bs=this.ventas[0].total_bs -(producto.prod.unidad_item*producto.prod.precio_bs);
    this.ventas[0].total_arg=this.ventas[0].total_arg -(producto.prod.unidad_item*producto.prod.precio_arg);
    // console.log('unidad: '+producto.prod.unidad_item+' Precio: '+producto.prod.precio_bs);
    
    this.productoSelect.splice(index,1);
  }

  opcionesDescripcion=false;
  openOpcionesDescripcion(){
    setTimeout(() => {
        this.opcionesDescripcion=!this.opcionesDescripcion;
    }, 200); // Ajusta el tiempo de espera según sea necesario
   
  }
  agregarDescripcion(opcion:any){
    if (this.ventas[0].descrip_venta) {
      this.ventas[0].descrip_venta=this.ventas[0].descrip_venta+' '+opcion;
    }else{
      this.ventas[0].descrip_venta=opcion;
    }

  }


//***********************************************************************************************
//**************************** REGISTRAMOS LA VENTA COMPLETA ************************************
  boton_Agregar_Venta(){
    this.container_lista=false;
    this.container_form=true;
  }
  registrar_Venta(){
    //Mostramos lista cards y ocultamos venta form
      this.container_lista=true;
      this.container_form=false;
      //Inicializamos los arrays
      const detalle: any[] = [];
      const item_presa: any[] = [];
      this.get_hora();
      // Obtenemos el cod_venta de la Ultima Venta Registrada
      const last_cod_venta=this.last_caja[0].cod_venta+1; const last_cod_item=this.last_caja[0].cod_item+1;
      this.last_caja[0].cod_venta=last_cod_venta; this.last_caja[0].cod_item=last_cod_item;
      console.log("last cod_venta::: ",last_cod_venta);

      const cod_venta = last_cod_venta;   //console.log("Código de la última venta:", cod_venta-1 + " | Codigo venta nueva:" ,cod_venta);
      var cod_item = last_cod_item //console.log("Código del último item:", cod_item+ " | Codigo nuevo item:" ,cod_item+1);

      this.ventas[0].cod_caja=this.last_caja[0].cod_caja;
      this.ventas[0].cod_venta=cod_venta;
      this.ventas[0].ticket=this.getLast_Ticket();
  
      //Rrecorremos todo los productos añadidos a la venta  
      for (let index = 0; index < this.productoSelect.length; index++) {
        cod_item++;
        
            //Para que los item_llevar de productos sea 0 si venta_llevar es 1
            if (this.ventas[0].vent_llevar==true && this.productoSelect[index].prod.item_llevar==true) {
                  this.productoSelect[index].prod.item_llevar=false;
                  this.ventas[0].vent_llevar=true;
            } 
            //Concatenamos unidad_arroz con detalle.descrip_item
            var unidArroz = this.productoSelect[index].prod.unidad_arroz;
            var descript_item = this.productoSelect[index].prod.descript_item;
              if (unidArroz>0) {
                if (descript_item!=null && descript_item!='') {
                  descript_item= unidArroz +' c/a '+'('+descript_item+')';
                  console.log(descript_item);    
                }
                else{
                  descript_item= unidArroz +' c/a ';
                  console.log("Descrip",this.detalle[0].descript_item);    
                }  
              }
          //************************************Guardamos en (detalle)************************************
          const newDetalle= {cod_item:cod_item,cod_venta:cod_venta, cod_producto:this.productoSelect[index].prod.cod_producto, unidad_item:this.productoSelect[index].prod.unidad_item, descript_item:descript_item, item_llevar:this.productoSelect[index].prod.item_llevar};
          detalle.push(newDetalle);
          //************************************Guardamos los (items_presa)************************************
          const unidadAla=this.productoSelect[index].item_presaA.unidad_presa;
          const unidadPi=this.productoSelect[index].item_presaPi.unidad_presa;
          const unidadPe=this.productoSelect[index].item_presaPe.unidad_presa;
          if ( unidadAla==0 && unidadPi==0 && unidadPe==0) {
            const newItemPresa={cod_item:cod_item,cod_presa:0,unidad_presa:0};
            // item_presa.push(newItemPresa);
          }
          if (unidadAla>0) {
            const newItemPresa={cod_item:cod_item,cod_presa:1,unidad_presa:unidadAla};
            item_presa.push(newItemPresa);
          }
          if (unidadPi>0) {
            const newItemPresa={cod_item:cod_item,cod_presa:2,unidad_presa:unidadPi};
            item_presa.push(newItemPresa);
          }
          if (unidadPe>0) {
            const newItemPresa={cod_item:cod_item,cod_presa:3,unidad_presa:unidadPe};
            item_presa.push(newItemPresa);
          }
    
      //Mandamos Agregar el pedido
      }
      this.AgregarVenta_Directo_Backend(this.ventas,detalle,item_presa);
  }
  AgregarVenta_Directo_Backend(venta:any,detalle_venta:any, item_presa:any){
    //Mensaje Toast
    var miToast = document.getElementById('toast'); 
    var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; this.mensaje_toast='Venta Agregada'
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      this.renderer.setStyle(toast_cabezera, 'background', '#437848ee');
    }
    // Peticion al Servicio
    console.log('Agregamos Venta: ', venta);
    
    this.ventaService.post_Venta_Api_backend(venta,detalle_venta,item_presa)
    .subscribe(
      res => {
        console.log('Venta Agregada');
        this.listar_Ventas();
        this.pantalla_form=false;
        toast.show();
        setTimeout(() => {toast.hide();}, 1500);
          // Emite un evento personalizado a través de Socket.IO
        this.socketService.sendEvent({ message: 'Nueva venta agregada' });
      },
      err => console.log(err)
    );
  }

 //Obtenmos ultimo cod_venta
  get_hora(){
    //Obtenemos la HORA
    const fecha = new Date();
    const hora =fecha.getHours(); 
    const minuto =fecha.getMinutes();
    if (minuto<10) {
      this.ventas[0].hora=hora+':0'+minuto;
    }else{this.ventas[0].hora=hora+':'+minuto;}
  }

  obtener_fecha() {
    const fechaHoraActual = new Date();
    const dia = fechaHoraActual.getDate().toString().padStart(2, '0');
    const mes = (fechaHoraActual.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaHoraActual.getFullYear();
    const fecha = `${dia}/${mes}/${año}`;
    return fecha;
}

  //Obtenmos ultimo cod_item
  getLast_Ticket(){
    if (this.ventasConDetalles.length>0) {
      const lastIndex = this.ventasConDetalles.length - 1; //Ultimo detalle agregado
      const lastVenta = this.ventasConDetalles[lastIndex];
      const lastTicket = lastVenta.venta.ticket;   
      return lastTicket+1;
    }else{
      return 1;
    }

  }
  getMaxCodItem() {
    if (this.ventasConDetalles.length === 0) {
      return 0; // O cualquier otro valor predeterminado que elijas para indicar que no hay detalles
    }
    let maxCodItem = -1; // Inicializar con un valor que seguramente será menor que cualquier cod_item positivo
    for (const venta of this.ventasConDetalles) {
      for (const detalle of venta.detalles) {
        const currentCodItem = detalle.detalle.cod_item;
        if (currentCodItem > maxCodItem) {
          maxCodItem = currentCodItem;
        }
      }
    }
    return maxCodItem;
  }
  opcionDetalleVenta(opcion:any,index:any){
    if(this.productoSelect[index].prod.descript_item==''){
      this.productoSelect[index].prod.descript_item=opcion;
      console.log("descript-item::",this.productoSelect[index].prod.descript_item);
      
    }else{
      this.productoSelect[index].prod.descript_item=this.productoSelect[index].prod.descript_item + ' , ' +opcion;
    }
    this.closeOpciones();
  }


  
//***********************************************************************************************
//************************** MODIFICAR LA VENTA COMPLETA ****************************************
  //Agregamos los datos a FORM
  Modificar(venta:any){ 

    this.LimpiarDatos();
    //PRIMERO: Guardamos los datos de la (Venta) seleccionada para agregarla al (Form)
    this.Button_Modificar=1; this.Button_Registrar=0;
    // console.log("Venta pro::"); console.log(venta.detalles[0].detalle.nom_pro);
    this.DetalleOriginal=venta.detalles.length; //console.log("Tamaño Detalle Obtenido:: ",this.DetalleOriginal);
    
    for (const detalle of venta.detalles) {
      var item_presaA={cod_presa:1,unidad_presa:0}; var item_presaPi ={cod_presa:2,unidad_presa:0}; var item_presaPe ={cod_presa:3,unidad_presa:0};;
      // console.log("Cod Detalle:: ",detalle.detalle.cod_item);  //console.log("Detalles::"); console.log(detalle);
      this.cod_items.push(detalle.detalle.cod_item);
      this.cod_items2.push(detalle.detalle.cod_item);
      var descript_item =detalle.detalle.descript_item;
      var descript_i="";
      var unidad_arroz=0;
      if (descript_item!="") {
        unidad_arroz=parseInt(descript_item[0]);
                                                    // console.log("Unidad Arroz::",unidad_arroz);
        //Configuramos y separamos la cadena descript_item 2 c/a (bien frito)
        if (!isNaN(unidad_arroz)) { //Si es un numero 
          const array = descript_item.split(" ");//seaparamos la cadena en un array
                                                          // console.log("Array::::: ",array); //array[1, c/a, bien, frito]
          var i=0;
          for(const a of array){
            i++
            if (i>2) {
              if (a != null) {
                let cadena = a;// (bien
                cadena = cadena.replace(/\(|\)/g, '');
                descript_i=descript_i+""+ cadena+ " "; // bien 
                                                            // console.log("letra:::", descript_i);
              }
            }       
          }
        }else{
          unidad_arroz=0;
          descript_i=descript_item;
        }
      }
      const prod = {
                    cod_item:detalle.detalle.cod_item, 
                    cod_producto:detalle.detalle.cod_producto, 
                    nom_pro:detalle.detalle.nom_pro,
                    cod_categoria:detalle.detalle.cod_categoria, 
                    precio_bs:detalle.detalle.precio_bs,
                    precio_arg: detalle.detalle.precio_arg, 
                    unidad_item:detalle.detalle.unidad_item,
                    item_llevar:detalle.detalle.item_llevar,
                    opciones:detalle.detalle.opciones,
                    unidad_arroz:unidad_arroz, 
                    descript_item:descript_i
                  };
          for (const item of detalle.items) {
              // console.log("Items::"); console.log(item);
              if (item.cod_presa==1) {
                item_presaA={cod_presa:item.cod_presa,unidad_presa:item.unidad_presa}
              }
              if (item.cod_presa==2) {
                item_presaPi={cod_presa:item.cod_presa,unidad_presa:item.unidad_presa}
              }
              if (item.cod_presa==3) {
                item_presaPe={cod_presa:item.cod_presa,unidad_presa:item.unidad_presa}
              }
          }
          const detalles = {prod,item_presaA,item_presaPi,item_presaPe}
        
          this.productoSelect.push(detalles);
    }
    //Guardamos la Venta seleccionada Modificar en el objeto Venta del formulario
    this.ventas[0].cod_venta=venta.venta.cod_venta;   this.ventas[0].cod_caja=venta.venta.cod_caja;           this.ventas[0].factura=venta.venta.factura;
    this.ventas[0].mesa=venta.venta.mesa;             this.ventas[0].vent_llevar=venta.venta.vent_llevar;     this.ventas[0].total_bs=venta.venta.total_bs; 
    this.ventas[0].pagado_bs=venta.venta.pagado_bs;   this.ventas[0].cambio_bs=venta.venta.cambio_bs;         this.ventas[0].total_arg=venta.venta.total_arg;    
    this.ventas[0].pag_arg=venta.venta.pag_arg;       this.ventas[0].cambio_arg=venta.venta.cambio_arg;       this.ventas[0].hora=venta.venta.hora;
    this.ventas[0].estado=venta.venta.estado;         this.ventas[0].descrip_venta=venta.venta.descrip_venta;
    //Cerramos el menu de la card
    this.closeMenu();
    //Mostramos lista cards y ocultamos venta form   
    this.container_lista=false;
    this.container_form=true;
    // console.log("Agregado a Forms::"); console.log(this.productoSelect);
  }

  Modificar_Nuevo(){
    const detalle: any[] = [];  const detalleAdd: any[] = [];
    const item_presa: any[] = [];   const item_presaAdd: any[] = [];
    this.Button_Modificar=0; this.Button_Registrar=1; 
    // console.log("VENTA MODIFICADA::",this.productoSelect);
    var Detalle_Mod= this.productoSelect.length; //console.log("Tamaño Detalle a Mod:: ",Detalle_Mod);
    var cod_item=0 

    if (this.DetalleOriginal < Detalle_Mod) {
      cod_item=this.getMaxCodItem();
    }
    const cod_venta = this.ventas[0].cod_venta; //console.log("Cod_Venta:::::::::",cod_venta); //Guardamos el cod_venta
    //-------------------------------------------------------------------------
    //RECORREMOS LOS DETALLES::::::::
    for (let index = 0; index < this.productoSelect.length; index++) {
          cod_item++;  
      
      //Concatenamos unidad_arroz con detalle.descrip_item
            var unidArroz = this.productoSelect[index].prod.unidad_arroz;
            var descript_item = this.productoSelect[index].prod.descript_item.trim();
              if (unidArroz>0) {
                if (descript_item!=null && descript_item!='') {
                  descript_item= unidArroz +' c/a '+'('+descript_item+')';
                  // console.log("Unidad Arroz::",descript_item);    
                }
                else{
                  descript_item= unidArroz +' c/a ';
                  // console.log("C/a::", descript_item);    
                }  
              }
      //Comparamos Si agregaron mas detalles o se eliminaron
            if (this.DetalleOriginal <= Detalle_Mod || this.DetalleOriginal > Detalle_Mod ) {
                if (this.cod_items!=null && this.cod_items.length>0) {
                        const newDetalle= {cod_item:this.cod_items[0],cod_venta:cod_venta, cod_producto:this.productoSelect[index].prod.cod_producto, unidad_item:this.productoSelect[index].prod.unidad_item, descript_item:descript_item, item_llevar:this.productoSelect[index].prod.item_llevar};
                        detalle.push(newDetalle);
                        //************************************Guardamos los (items_presa)************************************
                                  const unidadAla=this.productoSelect[index].item_presaA.unidad_presa; const unidadPi=this.productoSelect[index].item_presaPi.unidad_presa; const unidadPe=this.productoSelect[index].item_presaPe.unidad_presa;
                                  if (unidadAla>0) {
                                    const newItemPresa={cod_item:this.cod_items[0],cod_presa:1,unidad_presa:unidadAla};
                                    item_presa.push(newItemPresa);
                                  }
                                  if (unidadPi>0) {
                                    const newItemPresa={cod_item:this.cod_items[0],cod_presa:2,unidad_presa:unidadPi};
                                    item_presa.push(newItemPresa);
                                  }
                                  if (unidadPe>0) {
                                    const newItemPresa={cod_item:this.cod_items[0],cod_presa:3,unidad_presa:unidadPe};
                                    item_presa.push(newItemPresa);
                                  }
                        this.cod_items.shift();
                }else if (this.DetalleOriginal < Detalle_Mod){
                      const newDetalle= {cod_item:cod_item,cod_venta:cod_venta, cod_producto:this.productoSelect[index].prod.cod_producto, unidad_item:this.productoSelect[index].prod.unidad_item, descript_item:descript_item, item_llevar:this.productoSelect[index].prod.item_llevar};
                      detalleAdd.push(newDetalle);
                      //************************************Guardamos los (items_presa)************************************
                                  const unidadAla=this.productoSelect[index].item_presaA.unidad_presa; const unidadPi=this.productoSelect[index].item_presaPi.unidad_presa; const unidadPe=this.productoSelect[index].item_presaPe.unidad_presa;
                                  if (unidadAla>0) {
                                    const newItemPresa={cod_item:cod_item,cod_presa:1,unidad_presa:unidadAla};
                                    item_presa.push(newItemPresa);
                                  }
                                  if (unidadPi>0) {
                                    const newItemPresa={cod_item:cod_item,cod_presa:2,unidad_presa:unidadPi};
                                    item_presa.push(newItemPresa);
                                  }
                                  if (unidadPe>0) {
                                    const newItemPresa={cod_item:cod_item,cod_presa:3,unidad_presa:unidadPe};
                                    item_presa.push(newItemPresa);
                                  }
                }
            }
            

      // const newDetalle= {cod_item:cod_item,cod_venta:cod_venta, cod_producto:this.productoSelect[index].prod.cod_producto, unidad_item:this.productoSelect[index].prod.unidad_item, descript_item:descript_item, item_llevar:this.productoSelect[index].prod.item_llevar};
      // detalle.push(newDetalle);
    } 
    //Si se eliminaron Detalles osea si despues de quitar cada uno con this.cod_items.shift(); sobro alguno
    var detalleDel  
    if (this.cod_items!=null && this.cod_items.length>0) {
        detalleDel=this.cod_items;
      // console.log("Detalle Del:::::::", detalleDel);
    }

    this.Modificar_Venta_Directo_Backend(this.cod_items2,detalleDel,this.ventas,detalle,detalleAdd,item_presa);
  }


  Modificar_Venta_Directo_Backend(item_Del:any, detalle_Del:any, venta:any, detalle_Mod:any, detalle_Add:any, item_Add:any){
    //Mensaje Toast
    var miToast = document.getElementById('toast'); 
    var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; this.mensaje_toast='Venta Modificada';
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      this.renderer.setStyle(toast_cabezera, 'background', '#227388ee');
    }
    //Peticion Put Al servicio
    const ventaMod ={cod_venta: venta[0].cod_venta,
      cod_caja: venta[0].cod_caja,
      factura: venta[0].factura,
      mesa: venta[0].mesa,
      vent_llevar: venta[0].vent_llevar,
      total_bs: venta[0].total_bs,
      pagado_bs: venta[0].pagado_bs,
      cambio_bs: venta[0].cambio_bs,
      total_arg: venta[0].total_arg,
      pag_arg: venta[0].pag_arg,
      cambio_arg: venta[0].cambio_arg,
      hora: venta[0].hora,
      estado: venta[0].estado,
      descrip_venta: venta[0].descrip_venta} 
      this.ventaService.put_Venta_Api_backend(item_Del, detalle_Del, ventaMod, detalle_Mod, detalle_Add, item_Add)
      .subscribe(
        res => {
          console.log('Exito al Modificar Venta');
          this.socketService.sendEvent({ message: 'Nueva venta agregada' });
          toast.show();
          setTimeout(() => {
            toast.hide();
          }, 1500);
          this.LimpiarDatos();
        },
        err => console.log(err)
      );
  }


//****************** ELIMINAMOS LA VENTA COMPLETA ******************

  Eliminar(){
    //Mensaje Toast
    var miToast = document.getElementById('toast'); 
    var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; this.mensaje_toast='Venta Eliminada'
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      this.renderer.setStyle(toast_cabezera, 'background', '#8d4646ee');
    }
    // PETICION DEL AL SERVICIO
    this.ventaService.delete_Venta_ById(this.eliminar_venta)
    .subscribe(
      res => {
        console.log('Venta Eliminada');
        this.ventasConDetalles= [];
        toast.show();
        setTimeout(() => {
          toast.hide();
        }, 1500);
        this.socketService.sendEvent({ message: 'Venta Eliminada' });
      },
      err => console.log(err)
    );
    //Cerramos el menu de la card
    this.closeMenu();    
    $("#modalEliminarVenta").modal('hide'); 
  } 


  emitir_Ticket(modal:any, venta:any) {
    var cant_detalles= venta.detalles.length;
    console.log("Cant detalles::: ",cant_detalles);
    var alto_pdf=80;
    for(let i=0; i<cant_detalles;i++){
      if(i>=5){alto_pdf=alto_pdf+5; console.log("altopdf:",alto_pdf);
      }
    }
    if (alto_pdf>80) {
      alto_pdf=alto_pdf+3;
    }
    // for(const [j,item] of detalle.items.entries()){
    //   console.log("item cod presa:: ", item.cod_presa);
      // }

      // Crear un nuevo documento PDF
      const doc = new jsPDF({
        orientation: 'portrait', // Orientación vertical
        unit: 'mm', // Unidades en milímetros
        format: [72, alto_pdf] // Ancho x Largo en milímetros (tamaño de rollo)
      });
      
      // Definir el contenido del ticket
        const empresa = 'Pio Lindo';
        const ciudad = 'Villazon-Bolivia';
        var ticket = venta.venta.ticket;
        var hora= venta.venta.hora; var fecha=this.obtener_fecha();
        var mesa=venta.venta.mesa; var detalle=venta.venta.descrip_venta;
        var total_bs =venta.venta.total_bs; var total_arg =venta.venta.total_arg;
        var pagado_bs =venta.venta.pagado_bs; var pag_arg =venta.venta.pag_arg;
        var cambio_bs =venta.venta.cambio_bs; var cambio_arg =venta.venta.cambio_arg;
        if(!venta.venta.vent_llevar && detalle){detalle="Descripcion: "+ detalle}
        if(venta.venta.vent_llevar){
          if(mesa){
            mesa="(P/LL) #"+mesa
          }else{ mesa="(P/LL)"}
          detalle="Recoge: "+detalle;
        }else if(mesa){
          mesa = "Mesa: "+venta.venta.mesa;
        } else { mesa = "Mesa: **"; }

      
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); // 'bold' indica un grosor de fuente en negrita, Cambiar la fuente y el grosor del texto
      doc.text(empresa, 28, 5);// Alinea "empresa" a la izquierda con un espacio vertical de 20 mm(20mm se cuenta desde el borde superior de la hoja)
      doc.setFontSize(10); doc.setFont('helvetica','normal'); // Esto restaurará la fuente al valor predeterminado (no negrita)
      doc.text(ciudad, 26, 8);
      doc.text(fecha, 23, 11);       doc.text(" - "+hora, 38, 11);
      // doc.setFont('helvetica', 'bold');
      doc.text("Ticket: V-"+ticket, 2, 15);
      if(detalle){ doc.text(mesa, 2, 18);  doc.text(detalle, 25, 18);
      }else{doc.text(mesa, 2, 18); }
      // doc.setFont('helvetica','normal');
      
      //***************IMPRIMIMOS EL DETALLE 
      doc.text('----------------------------------------------------------------------', 2, 21); 
      if (pagado_bs>0 && pag_arg>0) {
        doc.text('Cant', 2, 24);    doc.text('Descripcion', 10, 24);    doc.text('Tot.Bs', 40, 24);   doc.text('Tot.Ps', 58, 24);
      }else{ 
      doc.text('Cant', 2, 24);    doc.text('Descripcion', 10, 24);    doc.text('Precio', 40, 24);   doc.text('Total', 58, 24);
      }
      var alto=26;  var i=2;  var alto2= alto+i; 
      //******************* DEFINIMOS EL ESPACIO DE LAS CANTIDADES *********************
      console.log('----------------ANTES DE ELEGIR');
      var cant_pro:any;  var nom_pro:any; var precio:any; var llevar:any; var total_pro:any; 
      var total:any; var pagado:any; var cambio:any; var divisa:any;
      //Caso que sea arg y bs
      var total_pro_bs:any; var total_pro_arg:any;
      var precio_bs:any;  var precio_arg:any; 
      
      for(const [index,detalle] of venta.detalles.entries()){ //entries para obtener tanto el index y detalle

        console.log('PAG BS',pagado_bs);
        console.log('PAG ARG',pag_arg);
        if (pagado_bs>0 && (pag_arg==0 || pag_arg==null)) {
          console.log('----------------ENTRAMOS A BS');        
          cant_pro=detalle.detalle.unidad_item.toString();  nom_pro=detalle.detalle.nom_pro;  precio=detalle.detalle.precio_bs.toString();  llevar=detalle.detalle.item_llevar
          total_pro=parseInt(cant_pro)*parseInt(precio); total=total_bs; cambio=cambio_bs; pagado=pagado_bs; divisa='bs';
        }
        if(pag_arg>0 && (pagado_bs==0 || pagado_bs==null)){
          console.log('----------------ENTRAMOS A ARG');
          cant_pro=detalle.detalle.unidad_item.toString();  nom_pro=detalle.detalle.nom_pro;  precio=detalle.detalle.precio_arg.toString();  llevar=detalle.detalle.item_llevar
          total_pro=parseInt(cant_pro)*parseInt(precio); total=total_arg; cambio=cambio_arg; pagado=pag_arg; divisa='ps';
        }
        if(pag_arg>0 && pagado_bs>0){
          console.log('----------------ENTRAMOS A ARG Y BS');
          cant_pro=detalle.detalle.unidad_item.toString();  nom_pro=detalle.detalle.nom_pro;  precio_bs=detalle.detalle.precio_bs.toString(); precio_arg=detalle.detalle.precio_arg.toString();  
          llevar=detalle.detalle.item_llevar
          total_pro_bs=parseInt(cant_pro)*parseInt(precio_bs); total_pro_arg=parseInt(cant_pro)*parseInt(precio_arg);
        }
        if((pag_arg==null || pag_arg==0) && (pagado_bs==null || pagado_bs==0)){
          cant_pro=detalle.detalle.unidad_item.toString();  nom_pro=detalle.detalle.nom_pro;  precio=detalle.detalle.precio_bs.toString();  llevar=detalle.detalle.item_llevar
          total_pro=parseInt(cant_pro)*parseInt(precio); total=0; cambio=0; pagado=0; divisa='Bs.';
        }

        //Definimos la posicion de las cantidades:
        var tab_pro=0; var tab_precio=0; var tab_total=0; var tab_total_bs=0; var tab_total_arg=0;
        
        if(cant_pro>=10) { tab_pro=5 } else{ tab_pro=7 }
        //SI ES ARG Y BS
        if(pag_arg>0 && pagado_bs>0){
          if(total_pro_bs<10) { tab_total_bs=47 }else if(total_pro_bs<100) { tab_total_bs=45 } else if(total_pro_bs<1000) { tab_total_bs=43 } else { tab_total_bs=41 }
          if(total_pro_arg<10) { tab_total_arg=66 }else if(total_pro_arg<100) { tab_total_arg=64 } else if(total_pro_arg<1000) { tab_total_arg=62 } else if(total_pro_arg<10000) { tab_total_arg=60 } else { tab_total_arg=58 }
        }
        //SINO NORMAL
        else {
          if(precio<10) { tab_precio=47 } else if(precio<100) { tab_precio=45 } else if(precio<1000) { tab_precio=43 } else { tab_precio=41 }
          if(total_pro<10) { tab_total=63 }else if(total_pro<100) { tab_total=61 } else if(total_pro<1000) { tab_total=59 } else { tab_total=57 }
        }
        //Si llevar es true, agregamos (p/ll) al nombre
        if (llevar==true) {nom_pro=nom_pro+" (P/LL)"}
        //Si el nombre es largo, agregamos otro parrafo abajo
        console.log('----------- nom pro:: ',nom_pro );
        
        if(nom_pro.length>18){ 
          const nombres= nom_pro.split(" "); 
          doc.text(cant_pro, tab_pro, alto+i);
            for(const nom_producto of nombres){
              doc.text(nom_producto, 10, alto2);
              alto2=alto2+3;
            }
            //Escribimos pdf el precio y total de cada producto
            if(pag_arg>0 && pagado_bs>0){
              doc.text(total_pro_bs.toString(), tab_total_bs, alto+i); doc.text(total_pro_arg.toString(), tab_total_arg, alto+i);
            }
            else{
              doc.text(precio, tab_precio, alto+i); doc.text(total_pro.toString(), tab_total, alto+i);
            }
          i=i+3;
        }else{
            //Escribimos pdf el precio y total de cada producto
            if(pag_arg>0 && pagado_bs>0){
              doc.text(cant_pro, tab_pro, alto+i); doc.text(nom_pro, 10, alto+i);  doc.text(total_pro_bs.toString(), tab_total_bs, alto+i); doc.text(total_pro_arg.toString(), tab_total_arg, alto+i);
            }
            else{
             doc.text(cant_pro, tab_pro, alto+i); doc.text(nom_pro, 10, alto+i);  doc.text(precio, tab_precio, alto+i); doc.text(total_pro.toString(), tab_total, alto+i);
            }
        }
      
        i=i+3;
      }

      doc.text('----------------------------------------------------------------------', 2, alto+i-1);

      //*************** DEFINIMOS EL ESPACIO DE LAS CANTIDADES ***********************
      if(pag_arg>0 && pagado_bs>0){
        var tab_totalv_bs=0; var tab_cambio_bs=0; var tab_pagado_bs=0;
        var tab_totalv_arg=0; var tab_cambio_arg=0; var tab_pagado_arg=0;

        if(total_bs<10) { tab_totalv_bs=43 } else if(total_bs<100) { tab_totalv_bs=41 } else if(total_bs<1000) { tab_totalv_bs=39 } else if(total_bs<10000) { tab_totalv_bs=37 }
        if(pagado_bs<10) { tab_pagado_bs=43 } else if(pagado_bs<100) { tab_pagado_bs=41 } else if(pagado_bs<1000) { tab_pagado_bs=39 } else if(pagado_bs<10000) { tab_pagado_bs=37 }
        if(cambio_bs<10) { tab_cambio_bs=43 } else if(cambio_bs<100) { tab_cambio_bs=41 } else if(cambio_bs<1000) { tab_cambio_bs=39 } else if(cambio_bs<10000) { tab_cambio_bs=37 }

        if(total_arg<10) { tab_totalv_arg=62 } else if(total_arg<100) { tab_totalv_arg=60 } else if(total_arg<1000) { tab_totalv_arg=58 } else if(total_arg<10000) { tab_totalv_arg=56 } else{ tab_totalv_arg=54 }
        if(pag_arg<10) { tab_pagado_arg=62 } else if(pag_arg<100) { tab_pagado_arg=60 } else if(pag_arg<1000) { tab_pagado_arg=58 } else if(pag_arg<10000) { tab_pagado_arg=56 } else { tab_pagado_arg=54 }
        if(cambio_arg<10) { tab_cambio_arg=62 } else if(cambio_arg<100) { tab_cambio_arg=60 } else if(cambio_arg<1000) { tab_cambio_arg=58 } else if(cambio_arg<10000) { tab_cambio_arg=56 } else { tab_cambio_arg=54 }
        
        //*************** IMPRIMIMOS EL DETALLE DE LO PAGADO ***********************
        console.log('************* total_arg:::',total_arg);
        console.log('************* pag_arg:::',pag_arg);
        console.log('************* tab_totalv_arg:::',tab_totalv_arg);
              
        doc.setFont('helvetica', 'bold');  
        doc.text("Monto a Pagar:", 10, alto+i+2); doc.text(total_bs+"bs", tab_totalv_bs, alto+i+2);   doc.text(total_arg+"ps", tab_totalv_arg, alto+i+2);
        doc.setFont('helvetica','normal'); 
        doc.text("Efetivo:", 24, alto+i+6);       doc.text(pagado_bs+"bs", tab_pagado_bs, alto+i+6);  doc.text(pag_arg+"ps", tab_pagado_arg, alto+i+6);
        doc.text("Cambio:", 23, alto+i+10);       doc.text(cambio_bs+"bs", tab_cambio_bs, alto+i+10); doc.text(cambio_arg+"ps", tab_cambio_arg, alto+i+10)
      } 
      else{     
      var tab_totalv=0; var tab_cambio=0; var tab_pagado=0;
      if(total<10){tab_totalv=62} else if(total<100){tab_totalv=60} else if(total<1000){tab_totalv=58} else if(total<10000){tab_totalv=56}
      if(pagado<10){tab_pagado=62} else if(pagado<100){tab_pagado=60} else if(pagado<1000){tab_pagado=58} else if(pagado<10000){tab_pagado=56}
      if(cambio<10){tab_cambio=62} else if(cambio<100){tab_cambio=60} else if(cambio<1000){tab_cambio=58} else if(cambio<10000){tab_cambio=56}
      
      //*************** IMPRIMIMOS EL DETALLE DE LO PAGADO ***********************       
      doc.setFont('helvetica', 'bold');  doc.text("Monto a Pagar:", 25, alto+i+2); doc.text(total+" "+divisa, tab_totalv, alto+i+2);
      doc.setFont('helvetica','normal'); doc.text("Efetivo:", 40, alto+i+6); doc.text(pagado+" "+divisa, tab_pagado, alto+i+6);
                                        doc.text("Cambio:", 39, alto+i+10); doc.text(cambio+" "+divisa, tab_cambio, alto+i+10);

      }
      doc.text("************************************************", 2, alto+i+14)
      doc.text("Gracias por su visita", 23, alto+i+16)

      //CONFIGURACION PARA IMPRIMIR EL PDF O TICKET
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');


//FORMA PARA ABRIR EL PDF EN UN MODAL
    // // Genera el PDF
    // const pdfDataUri = doc.output('blob');
    // //Crea una URL para el blob del PDF
    // this.pdfurl = URL.createObjectURL(pdfDataUri);
    // //Cerramos el menu de la card
    // this.closeMenu();

    // $("#modalgenerarpdf").modal('show');
  
  
  }


  emitir_Ticket2(modal:any, venta:any){
    //CONFIGURACION IMPRIMIR PERO ABRIENDO UNA NUEVA PESTAÑA
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 100]
    });
    doc.text('Gracias por su visita', 10, 10);
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
    

      //CONFIGURACION PARA IMPRIMIR EL PDF O TICKET
        // Habilita la impresión automática al abrir el PDF
        doc.autoPrint();

        // Genera una URL de datos para el PDF
        const pdfDataUri = doc.output('datauristring');

        // Crea un iframe oculto y lo adjunta al cuerpo del documento
        const iframe = document.createElement('iframe');
        iframe.style.visibility = 'hidden';

        // Configura un evento onload en el iframe para imprimir el PDF una vez que se cargue
        iframe.onload = () => {
          if (iframe.contentWindow) {
            iframe.contentWindow.print(); // Imprime el PDF
          }
        };

        // Establece la fuente del iframe como la URL de datos del PDF
        iframe.src = pdfDataUri;

        // Agrega el iframe al cuerpo del documento
        document.body.appendChild(iframe);

    // document.body.appendChild(iframe);
  }



  obtener_codCaja(){ 
    this.cajaService.get_LastCaja_Api()
    .subscribe(
      res => {
        this.last_caja=res;
        console.log('last caja:', this.last_caja);
        //Verificamos si cod_caja de getCodCaja es diferente de null
        const cod_cajaS=this.cajaService.getCodCaja();  const hr_aperturaS=this.cajaService.getHrApertura(); const estadoS=this.cajaService.getEstado();
        
        if (cod_cajaS!=null && this.last_caja[0].cod_caja!=cod_cajaS) {//4 //1
          this.last_caja[0].cod_caja=cod_cajaS; this.last_caja[0].hr_apertura=hr_aperturaS; this.last_caja[0].estado= estadoS;
          // console.log("caja a Listar V:: ",this.last_caja[0].cod_caja);
          this.listarProductos();
          this.listar_Categorias();
          this.listar_Ventas();
        }else{
          this.listarProductos();
          this.listar_Categorias();
          this.listar_Ventas();
        }
      },
      err => console.log(err)
    );
  }



}
// // Este código iría en el documento dentro del iframe
// window.addEventListener('message', (event) => {
//   console.log('Mensaje recibido:', event.data);
//   if (event.data === 'print') {
//     console.log('Ejecutando impresión');
//     window.print();    
//   }
// }, false);



