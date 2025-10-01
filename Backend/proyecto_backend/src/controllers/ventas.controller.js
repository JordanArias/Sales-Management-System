const pool = require('../database')
let caja=null;

// ******************OBETENER LISTA DE VENTAS*****************
const get_Venta = async (req, res) =>{
    // await get_last_Caja();
    const cod_caja = parseInt(req.params.cod_caja); 
    const hr_apertura = req.params.hr_apertura;
    caja=req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción
        const text = ' SELECT *FROM venta WHERE cod_caja=$1 ' +
                     ' AND CAST(hora AS TIME) >= $2 ORDER BY cod_venta ';
        const productosGet = await pool.query(text,[cod_caja, hr_apertura]);
        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json(productosGet.rows);
    } catch (error) {
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
        console.error(error);
        res.status(500).json('Error al insertar en la base de datos');;
    }finally {
        client.release(); // Libera la conexión al pool
    }
}
// ******************OBTENER DETALLE VENTA*******************
const get_Detalle_Venta = async (req, res) =>{
    if (caja!=null) {
        const cod_caja = caja.cod_caja;
        const hr_apertura = caja.hr_apertura;
        const client = await pool.connect();
        try {
            await client.query('BEGIN'); // Comienza la transacción
            const text = ' SELECT dv.*, p.nom_pro,p.cod_categoria, p.precio_bs, p.precio_arg, p.opciones '+ 
                            ' FROM producto AS p '+
                            ' JOIN detalle_venta AS dv ON p.cod_producto = dv.cod_producto '+
                            ' JOIN venta AS v ON dv.cod_venta = v.cod_venta '+
                            ' WHERE v.cod_caja = $1 AND CAST(hora AS TIME) >= $2 '+ 
                            ' ORDER BY dv.cod_item; ';
            const productosGet = await pool.query(text,[cod_caja,hr_apertura]);
            console.log(res.rows) //obtenemos solo los datos necesarios
            await client.query('COMMIT'); // Confirma la transacción
            res.status(200).json(productosGet.rows);
        } catch (error) {        
            console.error(error);
            await client.query('ROLLBACK'); // Si hay un error, realiza un rollback
            res.status(500).json({ error: 'Error interno del servidor' });
        }finally {
            client.release(); // Libera la conexión al pool
        }
    }
}
// ******************OBTENER ITEM PRESA**********************
const get_Item_Presa = async (req, res) =>{
    if (caja!=null) {
        const cod_caja = caja.cod_caja;
        const hr_apertura = caja.hr_apertura;
        const client = await pool.connect();
        try {
            await client.query('BEGIN'); // Comienza la transacción
            const text = ' SELECT ip.*, p.nom_presa '+
                         ' FROM item_presa AS ip '+
                         ' JOIN detalle_venta AS dv ON ip.cod_item = dv.cod_item '+
                         ' JOIN venta AS v ON dv.cod_venta = v.cod_venta '+ 
                         ' JOIN presa AS p ON p.cod_presa = ip.cod_presa'+
                         ' WHERE v.cod_caja = $1 AND CAST(hora AS TIME) >= $2' + 
                         ' ORDER BY ip.cod_item; ';
            const productosGet = await pool.query(text,[cod_caja,hr_apertura]);
            console.log(res.rows) //obtenemos solo los datos necesarios
            await client.query('COMMIT'); // Confirma la transacción
            res.status(200).json(productosGet.rows);
            //pool.end(); //Para terminar la ejecucion
        } catch (error) {
            console.error(error);
            await client.query('ROLLBACK'); // Si hay un error, realiza un rollback
            res.status(500).json({ error: 'Error interno del servidor' });
        }finally {
            client.release(); // Libera la conexión al pool
        }
    }
   
}

//************************************************************************************* */
// *********************AGREGAR VENTA************************
const Agregar_Venta= async (req, res) =>{
    // console.log("Venta::",req.body);
    // console.log("venta Body::",req.body.venta);
    // console.log("detalle Body::",req.body.detalle_venta);
    // console.log("presa Body::",req.body.item_presa);
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción

        await crear_Venta(client, req.body.venta[0]);
        await crear_Detalle_Venta(client, req.body.detalle_venta);
        await crear_Item_Presa(client, req.body.item_presa);

        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json('Ventas creadas exitosamente');
    } catch (error) {
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
        console.error(error);
        res.status(500).json('Error al insertar en la base de datos');
    } finally {
        client.release(); // Libera la conexión al pool
    }
}
// *********************AGREGAR VENTA[0]************************
const crear_Venta = async (client, venta) =>{
    //Consulta para insertar datos
        const text = ' INSERT INTO venta(cod_venta,cod_caja, factura, mesa, vent_llevar, total_bs, pagado_bs, cambio_bs, total_arg, pag_arg, cambio_arg, hora, estado, descrip_venta,ticket) ' + 
                     ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
        const {cod_venta,cod_caja, factura, mesa, vent_llevar, total_bs, pagado_bs, cambio_bs, total_arg, pag_arg, cambio_arg, hora, estado, descrip_venta,ticket} = venta;
        console.log("1.- Add Venta");
        //CONSULTA
        await client.query(text, [cod_venta,cod_caja, factura, mesa, vent_llevar, total_bs, pagado_bs, cambio_bs, total_arg, pag_arg, cambio_arg, hora, estado, descrip_venta,ticket]);
}
//AGREGAR DETALLE VENTA
const crear_Detalle_Venta = async (client, detalles) =>{
    //Consulta para insertar datos
        const text = ' INSERT INTO detalle_venta(cod_item,cod_venta, cod_producto, unidad_item, descript_item, item_llevar) ' + 
                     ' VALUES ($1, $2, $3, $4, $5, $6)';
        for(const detalle of detalles){
            const {cod_item, cod_venta, cod_producto, unidad_item, descript_item, item_llevar} = detalle;
            console.log("5.-Crear Detalle Mod: ", cod_producto);
            await client.query(text, [cod_item, cod_venta, cod_producto, unidad_item, descript_item, item_llevar]); 
        }
}

//AGREGAR ITEM PRESA
const crear_Item_Presa = async (client, items) =>{
    //Consulta para insertar datos
        const text = ' INSERT INTO item_presa(cod_item, cod_presa, unidad_presa) ' + 
                     ' VALUES ($1, $2, $3) '+
                     ' ON CONFLICT (cod_item, cod_presa) DO NOTHING '; // Evita la inserción en caso de conflicto, le estás diciendo a PostgreSQL que si ya existe un registro con la misma combinación de cod_item y cod_presa, simplemente no haga nada (no inserte un nuevo registro).
        for(const item of items){
            const {cod_item, cod_presa, unidad_presa} = item;
            console.log("6.-Crear Item:", cod_item);
            await client.query(text, [cod_item, cod_presa, unidad_presa]);
        }
}


//************************************************************************************* */
// ******************ACTUALIZAR VENTA************************
const modificar_Venta = async (req, res) =>{
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción

        await eliminar_Item_Presa(client, req.body.item_Del);
        if(req.body.detalle_Del){ await eliminar_Detalle_ById(client, req.body.detalle_Del); }
        await update_Venta_ById(client, req.body.venta_Mod);
        await update_Detalle_ById(client, req.body.detalle_Mod);
        await crear_Detalle_Venta(client, req.body.detalle_Add);
        await crear_Item_Presa(client, req.body.item_Add);

        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json('Ventas creadas exitosamente');
    } catch (error) {
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
        console.error(error);
        res.status(500).json('Error al insertar en la base de datos');
    } finally {
        client.release(); // Libera la conexión al pool
    }

}

const update_Venta_ById = async (client, venta) =>{
        const text =' UPDATE venta ' + 
                    ' SET factura=$1, mesa=$2, vent_llevar=$3, total_bs=$4, pagado_bs=$5, cambio_bs=$6, total_arg=$7, pag_arg=$8, cambio_arg=$9, descrip_venta=$10 '+
                    ' WHERE cod_venta = $11';

        const {cod_venta,cod_caja, factura, mesa, vent_llevar, total_bs, pagado_bs, cambio_bs, total_arg, pag_arg, cambio_arg, hora, estado, descrip_venta} = venta;
        console.log("3.-Venta Mod Mesa::", mesa);
        await client.query(text, [factura,mesa,vent_llevar,total_bs,pagado_bs,cambio_bs,total_arg,pag_arg,cambio_arg,descrip_venta,cod_venta]);
}

// ACTUALIZAR DETALLE-VENTA
const update_Detalle_ById = async (client, detalles) =>{
        const text =' UPDATE detalle_venta ' + 
                    ' SET cod_producto=$1, unidad_item=$2, descript_item=$3, item_llevar=$4 '+
                    ' WHERE cod_item = $5';
            for(const detalle of detalles){
                const {cod_producto,unidad_item,descript_item,item_llevar,cod_item} = detalle;
                console.log("4.-Detalle Mod cod_Prod::", cod_producto);
                await client.query(text, [cod_producto,unidad_item,descript_item,item_llevar,cod_item]);
            }        
}

//************************************************************************************* */
// ******************ELIMINAR VENTA************************
const Delete_Venta = async (req, res) =>{
  if (req.body.venta && req.body.venta.venta && req.body.venta.venta.cod_venta) {
        console.log("DEL venta::", req.body.venta.venta.cod_venta);
        // console.log("DEL detalle::", req.body.venta.detalles[0].items);
        const cod_venta= req.body.venta.venta.cod_venta;
        const detalles= req.body.venta.detalles;
        var cod_items=[];
        var cod_items_I=[];
        //Recorremos los detalles y sacamos sus cod_items
        for(let detalle of detalles){ //Recorremos los detalles  
            cod_items.push(detalle.detalle.cod_item);//Insertamos al array el cod_item del detalle 
            for(let item of detalle.items){ // Recorremos los items_presa del detalle
                cod_items_I.push(item.cod_item);//Agregamos al array (cod_items_I) el cod_item del item_presa
            } 
            cod_items_I = [...new Set(cod_items_I)];//Eliminamos los cod_items repetidos en el array
        }
    
        const client = await pool.connect();
        try {
            await client.query('BEGIN'); // Comienza la transacción
    
            if(cod_items_I){ await eliminar_Item_Presa(client, cod_items_I); }
            await eliminar_Detalle_ById(client, cod_items);
            await delete_Venta_ById(client, cod_venta);
    
            await client.query('COMMIT'); // Confirma la transacción
            res.status(200).json('Venta Eliminada exitosamente');
        } catch (error) {
            await client.query('ROLLBACK'); // Revierte la transacción en caso de error
            console.error(error);
            res.status(500).json('Error al eliminar venta de la base de datos');
        } finally {
            client.release(); // Libera la conexión al pool
        }
    } else {
        // Manejar el caso en el que la propiedad 'cod_venta' no está presente
        console.error("Propiedad 'cod_venta' no encontrada en req.body.venta.venta");
      }
      

}
// ******************ELIMINAR VENTA[0]************************
const delete_Venta_ById = async (client, venta) =>{
        const text = 'DELETE FROM venta WHERE cod_venta = $1';
        const cod_venta = venta;
        await client.query(text,[cod_venta]);
}

// ******************ELIMINAR DETALLE-VENTA************************
const eliminar_Detalle_ById = async (client, detalles) =>{
    const text = 'DELETE FROM detalle_venta WHERE cod_item = $1';

    for(const item of detalles){
        const cod_item = item;
        console.log("2.-cod_item Detalle Eliminar Mod :", cod_item);
        await client.query(text,[cod_item]);
    }
}

// ******************ELIMINAR ITEM-PRESA************************
const eliminar_Item_Presa = async (client, items) =>{
    const text = 'DELETE FROM item_presa WHERE cod_item = $1';
        for(const item of items){
            const cod_item = item;
            await client.query(text,[cod_item]);
        }
}

const update_estado = async (req, res) =>{

    console.log("Estado a modificar",req.body);
    const client = await pool.connect();
    try {
        const text =' UPDATE venta ' + 
        ' SET estado=$1'+
        ' WHERE cod_venta = $2';
        const {estado,cod_venta} = req.body;
        await client.query(text, [estado, cod_venta]);

        await client.query('COMMIT'); // Confirma la transacción

    } catch (error) {
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
        res.status(500).json('Error al modificar en la base de datos');
    }finally {
        client.release(); // Libera la conexión al pool
    }
 
}


const update_estado_L = async (req, res) =>{

    console.log("Estado a modificar L",req.body);
    const client = await pool.connect();
    try {
        const text =' UPDATE venta ' + 
        ' SET estado_l=$1'+
        ' WHERE cod_venta = $2';
        const {estado,cod_venta} = req.body;
        await client.query(text, [estado, cod_venta]);

        await client.query('COMMIT'); // Confirma la transacción

    } catch (error) {
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
        res.status(500).json('Error al modificar en la base de datos');
    }finally {
        client.release(); // Libera la conexión al pool
    }
 
}


module.exports = {
    get_Venta,
    get_Detalle_Venta,
    get_Item_Presa,
    Agregar_Venta,
    modificar_Venta,
    update_Venta_ById,
    Delete_Venta,
    delete_Venta_ById,
    update_estado,
    update_estado_L
}