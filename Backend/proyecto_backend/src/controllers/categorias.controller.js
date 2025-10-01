// const e = require('express');
const pool = require('../database')

const getCategorias = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción
        const categoriaGet = await pool.query('select * from categoria ORDER BY cod_categoria ASC;');
        //console.log(categoriaGet.rows); // Imprimimos solo los datos necesarios
        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json(categoriaGet.rows);
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
        // res.status(500).json('Error al insertar en la base de datos');
    } finally {
        client.release(); // Libera la conexión al pool
    }
};

const crearCategoria = async (req, res) =>{
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción
        const text = 'INSERT INTO categoria(cod_categoria, nom_categoria)' + 
        'VALUES ($1, $2)';
        const {cod_categoria, nom_categoria} = req.body;
        // console.log("Categoria::::::::::::");
        console.log(req.body);
        const categoriaSave = await pool.query(text, [cod_categoria, nom_categoria]);

        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json('Categoria Creada exitosamente');
    }catch (error) {
        console.log(error);
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
    }finally {
        client.release(); // Libera la conexión al pool
    }  
}

const updateCategoriaById = async (req, res) =>{
    console.log("Entro a Actualizar");
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción
        const text = 'UPDATE categoria SET nom_categoria=$1 WHERE cod_categoria=$2;';
        const {cod_categoria,nom_categoria} = req.body;
        // console.log("Categoria::::::::::::");
        console.log(req.body);

        await pool.query(text, [nom_categoria,cod_categoria]);

        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json('Categoria actualizada exitosamente');
    }catch (error) {
        console.log(error);
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
    }finally {
        client.release(); // Libera la conexión al pool
    }  
}

const deleteCategoriaById = async (req, res) =>{
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción
        const text = 'DELETE FROM categoria WHERE cod_categoria = $1';
        const cod_categoria = parseInt(req.params.cod_categoria);

        await pool.query(text,[cod_categoria]);

        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json('Categoria eliminada exitosamente');
    }catch (error) {
        console.log(error);
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
        res.status(500).json(error);
    }finally {
        client.release(); // Libera la conexión al pool
    }  
}


module.exports = {
    getCategorias,
    crearCategoria,
    updateCategoriaById,
    deleteCategoriaById
}