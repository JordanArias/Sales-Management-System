// const e = require('express');
const pool = require('../database')
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('../config');

const crearProductos = async (req, res) =>{
    //Consulta para insertar datos
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción
        const text = 'INSERT INTO producto(cod_categoria, nom_pro, descrip_pro, precio_bs, precio_arg, opciones)' + 
        'VALUES ($1, $2, $3, $4, $5, $6)';
        const {cod_categoria, nom_pro, descrip_pro, precio_bs, precio_arg, opciones} = req.body;
        console.log("PRODUCTO::::::::::::");
        console.log(req.body);
        //CONSULTA
        await pool.query(text, [cod_categoria, nom_pro, descrip_pro, precio_bs, precio_arg, opciones]);
        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json('Producto Creado');   
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
    }finally {
        client.release(); // Libera la conexión al pool
    }
}

const getProductos = async (req, res) =>{
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción
        const productosGet = await pool.query('select *from producto ORDER BY cod_producto ASC;');
        console.log(res.rows) //obtenemos solo los datos necesarios
        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json(productosGet.rows);
        //pool.end(); //Para terminar la ejecucion
    }  catch (error) {
        console.log(error);
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
    }finally {
        client.release(); // Libera la conexión al pool
    }
}

const getProductoById = async (req, res) =>{
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción
        const text = 'select *from producto where cod_producto = $1';
        const id = parseInt(req.params.cod_producto); 
        const productoGet = await pool.query(text, [id]);
        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json(productoGet.rows); //Con esto da postman
    }catch (error) {
        console.log(error);
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
    }finally {
        client.release(); // Libera la conexión al pool
    }
}

const updateProductoById = async (req, res) =>{
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción
        const text = 'UPDATE producto SET nom_pro = $1, descrip_pro = $2, precio_bs = $3, precio_arg = $4, cod_categoria = $5, opciones = $6 '+
                     ' WHERE cod_producto = $7';
        const {cod_categoria, nom_pro, descrip_pro, precio_bs, precio_arg, opciones, cod_producto} = req.body;

        const productoUpdated = await pool.query(text, [nom_pro,descrip_pro,precio_bs,precio_arg,cod_categoria,opciones,cod_producto]);
        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json(productoUpdated.rows); 

    }catch (error) {
        console.log(error);
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
    }finally {
        client.release(); // Libera la conexión al pool
    }
}

const deleteProductoById = async (req, res) =>{
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción
        const text = 'DELETE FROM producto WHERE cod_producto = $1';
        const cod_producto = parseInt(req.params.cod_producto);
    
        const productoDeleted = await pool.query(text,[cod_producto]);
        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json("producto eliminado");

    }catch (error) {
        console.log(error);
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
    }finally {
        client.release(); // Libera la conexión al pool
    }  
}


module.exports = {
    crearProductos,
    getProductos,
    getProductoById,
    updateProductoById,
    deleteProductoById
}