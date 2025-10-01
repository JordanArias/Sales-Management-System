const e = require('express');
const pool = require('../database')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const crearUsuarios = async (req, res) =>{
//Consulta para insertar datos
        try {
            const text = 'INSERT INTO usuario(ci_usuario, nom_usu, ap_usu, clave)' + 
            'VALUES ($1, $2, $3, $4)';
            const {ci_usuario, nom_usu, ap_usu, clave} = req.body;

            //Encriptamos password
            let password = await bcrypt.hash(clave,8)
            console.log(password)
            //const values = [req.params.ci_usuario, req.params.nom_usu, req.params.ap_usu, req.params.am_usu, req.params.clave];

            //CONSULTA
            const usuarioSave = await pool.query(text, [ci_usuario, nom_usu, ap_usu, password]);
            //console.log(usuarioSave);
            //res.status(200).json('Usuario Creado');
          
            //Token
            const token = jwt.sign({id: usuarioSave.ci_usuario}, config.SECRET, {
                expiresIn:86400 //24horas
            })
            res.status(200).json({token});
            //res.status(200).json({token});            

        } catch (error) {
            console.log(error);
        }
}

const getUsuarioById = async (req, res) =>{
    try {
        const text = 'select *from usuario where ci_usuario = $1';
        const id = parseInt(req.params.ci_usuario); 
        const usuarioGet = await pool.query(text, [id]);
        //pool.end()
        console.log(usuarioGet.rows.length);
        res.status(200).json(usuarioGet.rows); //Con esto da postman
    } catch (error) {
        console.log(error);
    }
}


const getUsuarios = async (req, res) =>{
    try {
        const usuariosGet = await pool.query('select *from usuario ORDER BY ci_usuario ASC');
        console.log(res.rows) //obtenemos solo los datos necesarios
        res.status(200).json(usuariosGet.rows);
        //pool.end(); //Para terminar la ejecucion
    } catch (error) {
        console.log(error);
    }
}


const updateUsuarioById = async (req, res) =>{
    try {
        const text = 'UPDATE usuario SET nom_usu = $1, ap_usu = $2 WHERE ci_usuario = $3';
        //const id = parseInt(req.params.ci_usuario); //recogemos el id del objeto a actualizar
        const nombre = req.body.nom_usu; //el nombre nuevo 
        const apellido = req.body.ap_usu; //el nombre nuevo
        const ci_user = req.body.ci_usuario; //el ci_usuario que se modificara  
        //el nuevo apellido

        const usuarioUpdated = await pool.query(text, [nombre,apellido, ci_user]);

        res.status(200).json(usuarioUpdated.rows); 
    } catch (error) {
        console.log(error);
    }
}


const deleteUsuarioById = async (req, res) =>{
    try {
        const text = 'DELETE FROM usuario WHERE ci_usuario = $1';
        const id = parseInt(req.params.ci_usuario);
    
        const usuarioDeleted = await pool.query(text,[id]);
        res.status(200).json("usuario eliminado");
        //console.log(usuarioDeleted);  
    } catch (error) {
        console.log(error);
    }  
}


const getUsuarioRoles = async (req, res) =>{
    try {
        const text = 'select r.rol, r.enlace, r.cod_rol from roles r ' +  
                    ' JOIN roles_usuarios ru ON ru.cod_rol = r.cod_rol ' +
                    ' JOIN usuario u ON u.ci_usuario = ru.ci_usuario ' +
                    ' Where u.ci_usuario = $1 '
        const id = parseInt(req.params.ci_usuario); 
        console.log('id::',+id);
        const usuarioGet = await pool.query(text, [id]);
        //pool.end()
        console.log(usuarioGet.rows.length);
        res.status(200).json(usuarioGet.rows); //Con esto da postman
    } catch (error) {
        console.log('ERROR:: ID vacio o incorrecto');
        res.status(500).json('Error al obtener roles de usuario');
    }
}

const deleteRolesUsuarioById = async (req, res) =>{
    try {
        const text = 'DELETE FROM roles_usuarios WHERE ci_usuario = $1';
        const id = parseInt(req.params.ci_usuario);
    
        const usuarioDeleted = await pool.query(text,[id]);
        res.status(200).json("Roles eliminados");
        //console.log(usuarioDeleted);  
    } catch (error) {
        console.log(error);
    }  
}

module.exports = {
    crearUsuarios,
    getUsuarioById,
    getUsuarios,
    updateUsuarioById,
    deleteUsuarioById,
    getUsuarioRoles,
    deleteRolesUsuarioById
}
