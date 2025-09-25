import { Component,Inject, Renderer2 } from '@angular/core';
import { ProductosService } from "../../services/productos.service";
import { DOCUMENT } from '@angular/common';
import * as bootstrap from 'bootstrap';

// This lets me use jquery
declare var $: any
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
  productos = {cod_producto:0,cod_categoria:0,nom_pro:'',descrip_pro:'',precio_bs:0, precio_arg:0,opciones:[{}]}
  categorias = {cod_categoria:0, nom_categoria:''};
  categoriasApi = {cod_categoria:0, nom_categoria:''};
  categoriasLista : any[] = [];
  productosAux: any[] = []; // Inicializamos productosAux como un arreglo vacío
  productosLista: any[] = [];//Inicializamos un arreglo para guardar la lista por categorias
  opciones = [{ value: '' }];//Opciones para los inputs
  // productosLista= {
  //   cod_producto:0,
  //   cod_categoria:0,
  //   nom_pro:'',
  //   descrip_pro:'',
  //   precio_bs:0,
  //   precio_arg:0
  // }
  categoriaSeleccionada=0;

  productoApi={cod_producto:0,cod_categoria:'',nom_pro:'',descrip_pro:'',precio_bs:'', precio_arg:'',opciones:[{}]}
  precio='';
  filterPost='';
  switchValue=false;
  mensaje_toast=''

  constructor(
    private productoService:ProductosService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ){
    this.listarProductos();
    this.listar_Categorias();
  }


  ngOnChanges() {
    this.listarProductos(); // Llama a listarProductos en el ngOnInit
    //console.log("Cargamos de nuevo");
    
  }
//**************************** MODALES DE USUARIO ****************************
  showModalAgregar(modal:any):void{
    this.limpiarProductoForm();
    $("#modalAgregarProducto").modal('show');
  }
  showModalModificar(modal:any,p:any):void{
    this.limpiarProductoForm();
    $("#modalModificarProducto").modal('show');
    //Guardamos los datos del Producto seleccionado para mostrar en el formulario
    this.productoApi.cod_producto= p.cod_producto;
    this.productoApi.nom_pro = p.nom_pro;
    this.productoApi.precio_bs = p.precio_bs;
    this.productoApi.precio_arg = p.precio_arg;
    this.productoApi.cod_categoria=p.cod_categoria;
    this.productoApi.descrip_pro=p.descrip_pro;
    console.log('opciones:::',p.opciones);
    
    if (p.opciones != null) {
      // Verificar si p.opciones no es un array
      let opcionesArray:any;
      if (!Array.isArray(p.opciones)) {
        // Convertir p.opciones a un array
        // Eliminar las llaves al principio y al final
        const opcionesLimpio = p.opciones.slice(1, -1);
        // Dividir el string en un array usando la coma como separador
        opcionesArray = opcionesLimpio.split(',');    
        // Ahora puedes usar p.opciones como un array
        this.opciones = opcionesArray.map((value: any) => ({ value }));
      }else{
        // Ahora puedes usar p.opciones como un array
        this.opciones = p.opciones.map((value: any) => ({ value }));
      }     

    } else {
      // Manejar el caso en el que p.opciones es nulo
      console.error('p.opciones es nulo.');
    }
    
    
  }
  showModalEliminar(modal:any, cod_producto:any, nom_pro:any):void{
    $("#modalEliminarProducto").modal('show');
    this.productoApi.cod_producto= cod_producto;
    this.productoApi.nom_pro= nom_pro;
  }

  showModalCategoria(modal:any):void{
    this.limpiar_Categoria();
    this.limpiarProductoForm();
    $("#modalAgregarCategoria").modal('show');
  }
  showModalModificarCategoria(modal:any,categoria:any):void{
    $("#modalModificarCategoria").modal('show');
    this.categorias.cod_categoria= categoria.cod_categoria;
    this.categorias.nom_categoria= categoria.nom_categoria;
  }
  showModalEliminarCategoria(modal:any, categoria:any):void{
    $("#modalEliminarCategoria").modal('show');
    this.categorias.cod_categoria= categoria.cod_categoria;
    this.categorias.nom_categoria= categoria.nom_categoria;
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
    console.log(this.productosLista);
  }


  // CRUD PRODUCTOS
  listarProductos(){
    this.productoService.getProductosApi()
    .subscribe(
      res => {
        this.productos = res;
        // Convertir los objetos numerados en un arreglo
        this.productosAux = Object.values(this.productos);// Actualizamos productosAux con los datos de productos
        this.productosLista = Object.values(this.productos);
        this.seleccionarLista();
      },
      err => console.log('Error al obtener Productos')
    ) 
  }

//************************* AGREGAR PRODUCTO ****************************
  AgregarProducto(){
    // console.log(this.opciones);
    //Inicializar Toast
    var miToast = document.getElementById('toast'); 
    var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; this.mensaje_toast='Producto Agregado'
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      this.renderer.setStyle(toast_cabezera, 'background', '#4a8557');
    }

    //Guardamos el array
    const opcionesStringArray = this.opciones.map(opcion => opcion.value);
    if (opcionesStringArray.length==1 && opcionesStringArray[0]=='') {
      this.productoApi.opciones=[];
    }else{
    this.productoApi.opciones=opcionesStringArray;
    }
    this.last_CodProducto();
    console.log("Se Agrega:: ",this.productoApi);
    console.log('lsita prod:::', this.productosAux);

    
    //Agregamos el Producto
    this.productoService.postProductosApi(this.productoApi)
      .subscribe(
        res => {
          console.log('Producto Agregado');
          toast.show();
          this.listarProductos();
        },
        err => console.log(err)
      )
      $("#modalAgregarProducto").modal('hide'); 
  }
  last_CodProducto(){
    if (this.productosAux.length!=0) {
      const lasindex= this.productosAux.length-1; console.log('lastindex::',lasindex);
      const lastproducto = this.productosAux[lasindex]; console.log('lastproducto::',lastproducto);
      const lastcod_prod = lastproducto.cod_producto;console.log('lastcodprod::',lastcod_prod);
      this.productoApi.cod_producto=lastcod_prod + 1;
    }else{
      this.productoApi.cod_producto = 1;
    }

    
  }
  agregarOpcion() {
    this.opciones.push({ value: '' });
  }

  eliminarOpcion(index: number) {
    this.opciones.splice(index, 1);
  }
//Limpiamos los valores de la agregacion anterior
  limpiarProductoForm(){
    this.productoApi={cod_producto:0,cod_categoria:'',nom_pro:'',descrip_pro:'',precio_bs:'', precio_arg:'',opciones:[{}]}
    this.opciones = [{ value: '' }];
   }

  ModificarProducto(){
    //Iniciar Toast
    var miToast = document.getElementById('toast'); 
    var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; this.mensaje_toast='Producto Modificado';
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      this.renderer.setStyle(toast_cabezera, 'background', '#4e8b8b');
    }

    //Modificar Producto
    const opcionesStringArray = this.opciones.map(opcion => opcion.value);
    this.productoApi.opciones=opcionesStringArray;
    console.log("Se selecciono::" +this.productoApi); 

    this.productoService.putProductosApi(this.productoApi)
      .subscribe(
        res => {
          console.log('Producto Modificado');
          toast.show();
          this.listarProductos();
        },
        err => console.log(err)
      )
        $("#modalModificarProducto").modal('hide');   
  }

  EliminarProducto(){
        //Mensaje Toast
    var miToast = document.getElementById('toast'); 
    var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; this.mensaje_toast='Producto Eliminado'
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      this.renderer.setStyle(toast_cabezera, 'background', '#a66161');
    }

    this.productoService.deleteProductosApi(this.productoApi.cod_producto)
    .subscribe(
      res => {
        console.log('Producto eliminado');
        toast.show();
        this.listarProductos();
      },
      err => console.log(err)
    )
    $("#modalEliminarProducto").modal('hide'); 
  }

  ModificarProductoPrecioBs(cod_producto:any, nom_pro:any, precio_bs:any, precio_arg:any, cod_categoria:any){ 
    this.productoApi.cod_producto= cod_producto;
    this.productoApi.precio_bs=precio_bs;
    this.productoApi.nom_pro = nom_pro;
    this.productoApi.precio_arg = precio_arg;
    this.productoApi.cod_categoria=cod_categoria;
    // console.log("Producto:: "+this.productoApi.cod_producto+" precio bs:" + this.productoApi.precio_bs);
    console.log("Producto:: "+this.productoApi.cod_producto+" precio bs:" + this.productoApi.precio_bs +" de :" +this.productoApi.nom_pro);
    this.ModificarProducto();
  }

  ModificarProductoPrecioArg(cod_producto:any, nom_pro:any, precio_bs:any, precio_arg:any, cod_categoria:any){
    this.productoApi.cod_producto= cod_producto;
    this.productoApi.precio_arg=precio_arg;
    this.productoApi.nom_pro = nom_pro;
    this.productoApi.precio_bs = precio_bs;
    this.productoApi.cod_categoria=cod_categoria;
    //console.log("Producto:: "+this.productoApi.cod_producto+" precio arg:" + this.productoApi.precio_arg);
    this.ModificarProducto();
  }

  //Show productos o show Categorias
  name_boton="Categorias";
  show_Listas(){
    const productosDiv = document.getElementById('productos-show');
    const categoriasDiv = document.getElementById('categoria-show');

    if (productosDiv && categoriasDiv) {

        if (productosDiv.style.display === 'none') {
          productosDiv.style.display = 'block';
          categoriasDiv.style.display = 'none';
          this.name_boton='Categorias';
          console.log("Mostrar Productos");
          
        } else {
          productosDiv.style.display = 'none';
          categoriasDiv.style.display = 'block';
          this.name_boton='Productos';
          console.log("Mostrar Categorias");
        }

    }
  }




  //********************************* CATEGORIAS ******************************************* */
  // LISTAR CATEGORIAS
  listar_Categorias(){
    this.productoService.getCategoriasApi()
    .subscribe(
      res => {
        this.categoriasLista = res;    
      },
      err => console.log('Error al obtener Categorias')
    );
  }
  // MODIFICAR CATEGORIAS
  agregar_Categoria(){
    //Iniciar Toast
    var miToast = document.getElementById('toast'); 
    var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; this.mensaje_toast='Categoria Agregada'
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      this.renderer.setStyle(toast_cabezera, 'background', '#4a8557');
    }

    //Agregar Categoria
    this.categorias.cod_categoria= this.last_codCategoria();
    console.log('ultima cod_categoria', this.categorias.cod_categoria);
    console.log(this.categorias);
    
    this.productoService.postCategoriasApi(this.categorias)
    .subscribe(
      res => {
        console.log('Categoria agregada:::::',this.categoriasLista);   
        this.listar_Categorias(); 
        this.limpiar_Categoria();
        toast.show();
      },
      err => console.log('Error al guardar Categoria')
    ) 
    $("#modalAgregarCategoria").modal('hide');  
  }
  modificar_Categoria(){
    //Iniciar Toast
    var miToast = document.getElementById('toast'); 
    var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; this.mensaje_toast='Categoria Modificada';
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      this.renderer.setStyle(toast_cabezera, 'background', '#4e8b8b');
    }

    //Modificar Categoria
    console.log(this.categorias);
    this.productoService.putCategoriaApi(this.categorias)
    .subscribe(
      res => {
        this.listar_Categorias(); 
        this.limpiar_Categoria();
        toast.show();
      },
      err => console.log('Error al modificar Categoria')
    ) 
    $("#modalModificarCategoria").modal('hide');  
  }

  eliminar_Categoria(){
    //Iniciar Toast
    var miToast = document.getElementById('toast'); 
    var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; this.mensaje_toast='Categoria Eliminada'
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      this.renderer.setStyle(toast_cabezera, 'background', '#a66161');
    }

    //Eliminar Categoria
    console.log(this.categorias);
    this.productoService.deleteCategoriaApi(this.categorias.cod_categoria)
    .subscribe(
      res => {
        this.listar_Categorias(); 
        this.limpiar_Categoria();
        toast.show();
      },
      err => { 
        console.log('Error al eliminar Categoria',err);
        this.mensaje_toast='Error hay productos relacionados con: '+this.categorias.nom_categoria;
        toast.show(); 
      }  
    ) 
    $("#modalEliminarCategoria").modal('hide');  
  }

  last_codCategoria(){
    if (this.categoriasLista.length==0) {
      return 1;
    }
    const lastIndex = this.categoriasLista.length - 1; //Ultimo detalle agregado
    const lastElement = this.categoriasLista[lastIndex];
    const cod_categoria = lastElement.cod_categoria;
  
    
    return cod_categoria+1;
  }
  limpiar_Categoria(){
    this.categorias={cod_categoria:0,nom_categoria:''}; 
  }
}
