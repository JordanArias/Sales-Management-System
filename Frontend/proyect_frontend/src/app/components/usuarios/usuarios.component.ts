import { Component,Inject, Renderer2 } from '@angular/core';
import {UsuariosService} from "../../services/usuarios.service";
import {Router} from "@angular/router";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/common';
import * as bootstrap from 'bootstrap';
import chroma from 'chroma-js';

// This lets me use jquery
declare var $: any
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  constructor(
    private usuarioService:UsuariosService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
    )
    { 
      this.ListarUsuarios();
      
    }

filterPost='';

//Variable para Listar usuarios
  usuarios:any = [{
    ci_usuario:0,
    nom_usu:'',
    ap_usu:'',
    am_usu:'',
    clave:''
  }]

//Variable para Manipular un usuario
  user = {
    ci_usuario:"",
    nom_usu:'',
    ap_usu:'',
    am_usu:'',
    clave:'',
    cod_rol:0
  }  
//Variables para eliminar un usuario
  id_user=0;
  nom_user='';

//Variables Roles
  usuario=0;
  producto=0;
  venta=0;
  caja=0;
  cocina=0;

//Variables de error
ciInvalid = false;
ciVacio= false;
formValido = false;

administrarUsuarios: boolean = false;
administrarProductos: boolean = false;
gestionarVentas: boolean = false;
gestionarCaja: boolean = false;
gestionarCocina: boolean = false;

mensaje_toast=''


 ngOnInit(){
  this.ListarUsuarios()
 }


 limpiarUserForm(){
  this.user.ci_usuario='',
  this.user.nom_usu='',
  this.user.ap_usu='',
  this.user.am_usu='',
  this.user.clave='',
  this.user.cod_rol=0
 }

//**************************** MODALES DE USUARIO ****************************
  showModalAgregar(modal:any):void{
    this.limpiarUserForm();
    $("#modalAgregarUsuario").modal('show');
  }

  showModalEliminar(modal:any, ci_usuario:any, nom_usu:any):void{
    $("#modalEliminarUsuario").modal('show');
    this.id_user= ci_usuario;
    this.nom_user= nom_usu;
  }

  showModalModificar(modal:any, ci_usuario:any, nom_usu:any, ap_usu:any):void{
    $("#modalModificarUsuario").modal('show');
    //Guardamos los datos del Usuario que se selecciono
    this.user.ci_usuario = ci_usuario;
    this.user.nom_usu = nom_usu;
    this.user.ap_usu = ap_usu;
  }

  showModalRolesUsuario(modal:any,ci_usuario:any):void{
    this.limpiarRoles();
    this.user.ci_usuario = ci_usuario; //Guardamos el ci del usuario seleccionado
    this.ObtenerRolesUsuario();
    $("#modalRolesUsuario").modal('show');
  }

//************************* VALIDAR FORMULARIO ****************************
  // validarUsuario(){
  //   if (!/^\d+$/.test(this.userPost.ci_usuario)) {
  //     this.ciInvalid = true;
  //   }if (this.userPost.ci_usuario == "") {
  //     this.ciVacio= true;
  //   }
  //   else{
  //     this.ciVacio= false;
  //     this.ciInvalid = false;
  //   }
    
  // }

//************************* CRUD DE USUARIOS ****************************

  ListarUsuarios(){   
    console.log('Lista Usuarios::: ')
    this.usuarioService.getUsuariosApi()
      .subscribe(
        res => {
          console.log('Lista Usuarios::: ',res)
          this.usuarios = res;
        },
        err => console.log('Error al obtener Usuarios')
      ) 
  }


  AgregarUsuario(){
    var miToast = document.getElementById('toast'); 
    var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; this.mensaje_toast='Usuario Agregado'
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      this.renderer.setStyle(toast_cabezera, 'background', '#4a8557');
    }
    console.log("ENTRO::" +this.user);  
    this.usuarioService.postUsuarioApi(this.user)
      .subscribe(
        res => {
          console.log('Usuario Agregado');
          localStorage.setItem('token', res.token); //Guardamos en el localStorage el token que nos da al crear un usuario
          toast.show();
          this.ListarUsuarios(); toast.show();
        },
        err => console.log(err)
      )
      $("#modalAgregarUsuario").modal('hide'); 
  }

  ModificarUsuario(){
    //Mensaje Toast
    var miToast = document.getElementById('toast'); 
    var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; this.mensaje_toast='Usuario Modificado';
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      this.renderer.setStyle(toast_cabezera, 'background', '#4e8b8b');
    }
  //Enviar a servidor
    console.log("ENTRO::" +this.user);  
    this.usuarioService.putUsuarioApi(this.user)
      .subscribe(
        res => {
          console.log('Usuario Agregado');
          localStorage.setItem('token', res.token); //Guardamos en el localStorage el token que nos da al crear un usuario
          toast.show();
          this.ListarUsuarios();
        },
        err => console.log(err)
      )
      $("#modalModificarUsuario").modal('hide');   
  }

  EliminarUsuario(){
    //Mensaje Toast
    var miToast = document.getElementById('toast'); 
    var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; this.mensaje_toast='Usuario Eliminado'
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      this.renderer.setStyle(toast_cabezera, 'background', '#a66161');
    }

    //1ro Eliminamos los roles del Usuario
    this.EliminarRolesUsuario(this.id_user);
    //Despues Eliminamos al usuario
    this.usuarioService.deleteUsuarioApi(this.id_user)
    .subscribe(
      res => {
        console.log('Usuario eliminado');
        toast.show();
        this.ListarUsuarios();
      },
      err => console.log(err)
    )
    $("#modalEliminarUsuario").modal('hide'); 
  }

  AgregarRolesUsuario(){
    var rolesAdd=[];
    //Primero Eliminamos todos los roles del usuario para agregar los nuevos
    //this.EliminarRolesUsuario(this.user.ci_usuario);
    console.log("Administrar Usuarios:",this.administrarUsuarios);
    console.log("Administrar Producto:",this.administrarProductos);
    console.log("Administrar Ventas:",this.gestionarVentas);
    console.log("Administrar Caja:",this.gestionarCaja);
    if (this.administrarUsuarios) {
      rolesAdd.push(1);
    }
    if (this.administrarProductos) {
      rolesAdd.push(2);
    }
    if (this.gestionarVentas) {
      rolesAdd.push(3);
    }
    if (this.gestionarCaja) {
      rolesAdd.push(4);
    }
    if (this.gestionarCocina) {
      rolesAdd.push(5);
    }
    console.log("Roles Add::",rolesAdd);
    this.AgregarRolesUsuarioBackend(rolesAdd);  
    $("#modalRolesUsuario").modal('hide');
  }


  EliminarRolesUsuario(ci:any){
    this.usuarioService.deleteRolesFromUsuario(ci)
    .subscribe(
      res => {
        console.log('Roles eliminados');
      },
      err => console.log(err)
    ) 
  }

  AgregarRolesUsuarioBackend(roles:any){ 
    //Mensaje Toast
    var miToast = document.getElementById('toast');  var toast_cabezera = document.getElementById('toast-cabezera'); 
    let toast:any; this.mensaje_toast='Roles Agregados'
    if (miToast && toast_cabezera) {
      toast = new bootstrap.Toast(miToast);
      this.renderer.setStyle(toast_cabezera, 'background', '#4a8557');
    }          toast.show()
    //Peticion a servidor
    console.log("Ci::",this.user.ci_usuario);
    const data={rolesAdd:roles,ci_user:this.user.ci_usuario}
    //console.log(this.userRol.cod_rol+" a "+ this.userRol.ci_usuario);
    this.usuarioService.postRolesUsuarioApi(data)
      .subscribe(
        res => {
          console.log('Rol Agregado')
        },
        err => console.log(err)
      )   
  }

  //Obtenemos los roles ya agregados del Usuario seleccionado
  ObtenerRolesUsuario(){
    this.usuarioService.getRolesUsuarioApi(this.user.ci_usuario)
      .subscribe(
        res => {
          console.log('Roles-Usu:',res);
          res.forEach((item:any) => {
          //console.log(this.userRol.ci_usuario+' tiene rol: ' + item.cod_rol);
              if (item.cod_rol == 1) {
                this.administrarUsuarios= true;
                this.usuario=1;
              }
              if (item.cod_rol == 2) {
                this.administrarProductos= true;
                this.producto=1;
              }
              if (item.cod_rol == 3) {
                this.gestionarVentas= true;
                this.venta=1;
              }
              if (item.cod_rol == 4) {
                this.gestionarCaja= true;
                this.caja=1;
              }
              if (item.cod_rol == 5) {
                this.gestionarCocina= true;
                this.cocina=1;
              }
          });
          
        },
        err => console.log(err)
      )   
  }

//Ponemos todos los roles a false para obtener los nuevos roles de siguiente Usuario
  limpiarRoles(){
    this.administrarUsuarios= false;
    this.administrarProductos = false;
    this.gestionarVentas = false;
    this.gestionarCaja = false;
   //Tambien ponemos las varaibles a 0 como si no se habrian seleccionado
    this.usuario=0;
    this.producto=0;
    this.venta=0;
    this.caja=0;
  }


}
