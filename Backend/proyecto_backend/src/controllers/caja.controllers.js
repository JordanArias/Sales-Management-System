const pool = require('../database');



// ********************* GET SEGUN MES Y AÑO DE LA ULTIMA CAJA ***********************
//************************************************************************************
//Obtenemos Caja segun Mes y Año De la Ultima caja
const get_Caja = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Comienza la transacción
        const cajaGet = await client.query(' SELECT c.cod_caja, c.estado, c.hr_apertura, fecha FROM caja c '+
                                         ' WHERE c.cod_caja = (SELECT MAX(cod_caja) FROM caja); ');
        console.log('Last Caja:: ',cajaGet.rows); // Muestra solo los datos necesarios
        // if (cajaGet.rows.length==0) {
        //     res.status(500).json({ error: 'Error interno del servidor' });
        // }else{
            const fecha=cajaGet.rows[0].fecha;    
            console.log('CAJA VACIA: ', cajaGet.rows[0]);    
            console.log('1.- -------Fecha Ini:: ------ ::', fecha);
            //Obtenemos la fecha Inicial y Final de la fecha origen
    
            const date = await convertirFecha(fecha);
            const fechaInicio = date[0]; const fechaFin = date[1];
            const month = date[2]; const year= date[3]
            console.log('2.- -------Fecha Separada:: ------ ');
            console.log('Fecha obtenida Ini:: ', date[0]);
            console.log('Fecha obtenida Fin:: ', date[1]);
            
            //obenemos los datos de la caja segun la fecha Inicial y Final
            const cajaList = await get_Caja_by_Mes_LastCaja(client, fechaInicio, fechaFin); 
            console.log('4.- ------- Caja List Final ------ ::', cajaList.rows);
            await client.query('COMMIT'); // Confirma la transacción

            const data=[cajaList.rows, month, year];
            
            res.status(200).json(data);
        // }      
    } catch (error) {
        console.error(error);
        await client.query('ROLLBACK'); // Si hay un error, realiza un rollback
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        client.release(); // Libera la conexión al pool
    }
};
const convertirFecha = async (fechaStr) => {
    //Separamos el dia, mes y año de la Fecha
    const parts = fechaStr.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) ; // Restar 1 porque los meses en JavaScript son de 0 a 11
    const year = parseInt(parts[2], 10);

    //Definimos la Fecha Inicial de la Fecha Origen
    const fechaIni ='01/' + month + '/' + year;    //console.log("Fecha Inicio: ", fechaIni);
    let mes =parseInt(month.toString());
    if (mes==12) {//Si mes es 12 entonces fechaFin es de enero del siguiente year
      mes=0; year=parseInt(year.toString())+1
    }

    //Definimos la Fecha Final de la Fecha Origen
    const fechaFin= '01/' + (mes+1)+ '/' + year;    //console.log("Fecha Fin: ", fechaFin);
    //Mostramos el titulo de los detalles
    return [fechaIni,fechaFin,month,year];
}

const get_Caja_by_Mes_LastCaja = async (client, fechaini,fechafin) =>{
    console.log('3.- ------- Obtenemos Caja List ------ ');
    console.log("Fecha Ini::", fechaini);
    console.log("Fecha Fin::", fechafin);

        const text = " SELECT * FROM caja as c"+
        " WHERE TO_DATE(c.fecha, 'DD/MM/YYYY') >= $1  "+
        " AND TO_DATE(c.fecha, 'DD/MM/YYYY') <= $2 "+
        " ORDER BY cod_caja ASC ";

        const cajaGet = await client.query(text, [fechaini,fechafin]);
        await client.query('COMMIT'); // Confirma la transacción
        return cajaGet;
}

//Obtenemos Caja segun Mes y Año a pedido del Cliente
const get_Caja_by_Mes = async (req, res) =>{
    const fechaini = req.query.fechaini; // Obtener la fecha de la consulta
    const fechafin = req.query.fechafin;
    console.log("Fecha Ini::", fechaini);
    console.log("Fecha Fin::", fechafin);
    const client = await pool.connect();
    try{
        await client.query('BEGIN'); // Comienza la transacción
        const text = " SELECT * FROM caja as c"+
        " WHERE TO_DATE(c.fecha, 'DD/MM/YYYY') >= $1  "+
        " AND TO_DATE(c.fecha, 'DD/MM/YYYY') < $2 "+
        " ORDER BY cod_caja ASC ";
        const cajaGet = await client.query(text, [fechaini,fechafin]);
        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json(cajaGet.rows);
    }catch (error) {
        console.log(error);
        await client.query('ROLLBACK'); // Si hay un error, realiza un rollback
        res.status(500).json({ error: 'Error interno del servidor' });
    }finally {
        client.release(); // Libera la conexión al pool
    }
}

// ************************** CREAR NUEVA CAJA ****************************
//*************************************************************************
const crear_Caja = async (req, res) =>{
    const client = await pool.connect();
    try {
        const text = ' INSERT INTO caja(cod_caja,fecha, hr_apertura, hr_cierre, saldoini_bs, saldofin_bs, saldoini_arg, saldofin_arg, cant_items, estado) ' + 
        ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);';
        const {cod_caja, fecha, hr_apertura, hr_cierre, saldoini_bs, saldofin_bs, saldoini_arg, saldofin_arg, cant_items, estado} = req.body;
        console.log(req.body);
        //CONSULTA
        const caja = await pool.query(text, [cod_caja, fecha, hr_apertura, hr_cierre, saldoini_bs, saldofin_bs, saldoini_arg, saldofin_arg, cant_items, estado]);
        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json('Caja Creada');
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK'); // Si hay un error, realiza un rollback
        res.status(500).json({ error: 'Error interno del servidor' });
    }finally {
        client.release(); // Libera la conexión al pool
    }
}
const update_Caja = async (req, res) =>{
    const client = await pool.connect();
    try {
        const text = ' UPDATE caja SET saldoini_bs=$1, saldoini_arg=$2 '+
                     ' WHERE cod_caja = $3 ';

        const {saldoini_bs, saldoini_arg, cod_caja} = req.body;
        await pool.query(text, [saldoini_bs, saldoini_arg, cod_caja]);
        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json("Caja Actualizada"); 
    } catch (error) {
        console.log(error);
    }finally {
        client.release(); // Libera la conexión al pool
    }
}

const delete_caja = async (req, res) =>{
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción
        const text = 'DELETE FROM caja WHERE cod_caja = $1';
        const cod_caja = parseInt(req.params.cod_caja);
    
        await pool.query(text,[cod_caja]);
        await client.query('COMMIT'); 
        res.status(200).json("caja eliminada");
    }catch (error) {
        console.error(error);
        await client.query('ROLLBACK'); // Si hay un error, realiza un rollback
        res.status(500).json({ error: 'Error interno del servidor' });
    }finally {
        client.release(); // Libera la conexión al pool
    }
}


// ***************************** CERRAR CAJA ******************************
//*************************************************************************
const cerrar_caja = async (req, res) =>{
    const hora = await get_Hour();
    console.log("Hora actual: ", hora);
    const client = await pool.connect();
    try {
        // const text = ' UPDATE caja SET estado=1'+
        //              ' WHERE cod_caja = $1 ';
                      const text = ' UPDATE caja AS c ' +
                      ' SET saldofin_bs = c.saldoini_bs + COALESCE( ' +
                      ' (SELECT SUM(venta.pagado_bs - venta.cambio_bs) ' +
                      ' FROM venta WHERE venta.cod_caja = c.cod_caja), 0), ' +

                      ' saldofin_arg = c.saldoini_arg + COALESCE( ' +
                      ' (SELECT SUM(venta.pag_arg - venta.cambio_arg) ' +
                      ' FROM venta WHERE venta.cod_caja = c.cod_caja),0), ' +

                      ' cant_items = COALESCE( ' +
                      ' (SELECT COUNT(*) ' +
                      ' FROM venta WHERE venta.cod_caja = c.cod_caja),0), ' +

                      ' estado=1, hr_cierre=$1 WHERE c.cod_caja = $2 ';
        const {cod_caja} = req.body;
        console.log('Cod Caja:: ',cod_caja);
        await client.query(text, [hora,cod_caja]);
        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json("Caja Cerrada"); 
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK'); // Si hay un error, realiza un rollback
        res.status(500).json({ error: 'Error interno del servidor' });
    }finally {
        client.release(); // Libera la conexión al pool
    }
}
const get_Hour = async (req, res) =>{
    // Obtener la hora actual
    var fecha = new Date();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();
    var segundos = fecha.getSeconds();

    // Formar una cadena de la hora en el formato HH:mm
    var horaActual = hora + ':' + minutos;
    // console.log('Hora actual: ' + horaActual);
    return horaActual
}

// ********* OBTENER ULTIMA CAJA ***********
const get_last_Caja = async (req, res) =>{
    const client = await pool.connect();
    try{
        await client.query('BEGIN'); // Comienza la transacción
        const cajaGet = await pool.query(' SELECT (SELECT MAX(cod_venta) FROM venta) AS cod_venta, '+
                                            ' (SELECT MAX(cod_item) FROM detalle_venta) AS cod_item, '+
                                            ' c.cod_caja, c.estado, c.hr_apertura, fecha FROM caja c ' +
                                            ' WHERE c.cod_caja = (SELECT MAX(cod_caja) FROM caja); ');

        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json(cajaGet.rows);
    }catch (error) {
        console.log(error);
        await client.query('ROLLBACK'); // Si hay un error, realiza un rollback
        res.status(500).json({ error: 'Error interno del servidor' });
    }finally {
        client.release(); // Libera la conexión al pool
    }
}




// ************************ OBTENER DETALLE DEL MES ***********************
//*************************************************************************
const get_detalles_Mes = async (req, res) =>{
    const fechaini = req.query.fechaini; // Obtener la fecha de la consulta
    const fechafin = req.query.fechafin;
    console.log("Fecha Ini::", fechaini);
    console.log("Fecha Fin::", fechafin);
    const cod_caja = req.params.cod_caja; // Obtener la fecha de la consulta
    console.log("Cod Caja::", cod_caja);

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción
        //1.- Obtemos la CATEGORIAS
        console.log('1. --------------- Obtemos Categorias ------------');
        const categorias = await get_Categorias(client);
        console.log('Categorias:: ', categorias);

        const productos_List= await get_mes_productos2(client,fechaini,fechafin,categorias);
        console.log('1. Entramos a:: ',productos_List);

        // 3.- Calculamos el total vendido por cada categoría
        console.log('3. ------------- Caltular procentaje ------------');
        const totalVendidoPorCategoria = {};
        for (const categoria of productos_List) {
            let totalCategoria = 0;
            for (const producto of categoria.productos) {
                totalCategoria += parseInt(producto.cantidad_vendida);
            }
            totalVendidoPorCategoria[categoria.categoria] = totalCategoria;
            console.log('nom categoria: ',categoria);
        }
        console.log('total categoria:: ', totalVendidoPorCategoria);

        // 4.- Calculamos el porcentaje para cada producto dentro de su categoría
        for (const categoria of productos_List) {
            for (const producto of categoria.productos) {
                const totalCategoria = totalVendidoPorCategoria[categoria.categoria];
                const porcentaje = (parseInt(producto.cantidad_vendida) / totalCategoria) * 100;
                producto.porcentaje = porcentaje.toFixed(2); // Redondeamos el porcentaje a dos decimales
            }
        }

        await client.query('COMMIT'); // Confirma la transacción

        res.status(200).json(productos_List);
    } catch (error) {
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
        console.error(error);
        res.status(500).json('Error al obtener de la base de datos');
    } finally {
        client.release(); // Libera la conexión al pool
    }
}
//OBTENER DETALLE MES DE PRODUCTO POLLO
const get_mes_productos_P = async (client, fechaini, fechafin) =>{
    //Consulta para insertar datos
     const text = " WITH CTE_CantidadVendida AS (SELECT dvv.cod_producto, SUM(dvv.unidad_item) AS cantidad_vendida "+
       " FROM producto AS p LEFT JOIN detalle_venta AS dvv ON p.cod_producto = dvv.cod_producto " +
       " LEFT JOIN venta AS v ON dvv.cod_venta = v.cod_venta LEFT JOIN caja AS c ON v.cod_caja = c.cod_caja" +
       " WHERE TO_DATE(c.fecha, 'DD/MM/YYYY') >= $1 AND TO_DATE(c.fecha, 'DD/MM/YYYY') < $2 " +
       " AND p.cod_categoria = 1 GROUP BY dvv.cod_producto ) "+
       " SELECT p.cod_producto, p.nom_pro, p.cod_categoria, dv.cantidad_vendida, "  +
       " SUM(CASE WHEN ip.cod_presa = 1 THEN ip.unidad_presa ELSE 0 END) AS unidad_ala, " +
       " SUM(CASE WHEN ip.cod_presa = 2 THEN ip.unidad_presa ELSE 0 END) AS unidad_pierna, " +
       " SUM(CASE WHEN ip.cod_presa = 3 THEN ip.unidad_presa ELSE 0 END) AS unidad_pecho "+
       " FROM producto AS p INNER JOIN CTE_CantidadVendida AS dv ON p.cod_producto = dv.cod_producto " +
       " LEFT JOIN detalle_venta AS dvv ON p.cod_producto = dvv.cod_producto "+
       " LEFT JOIN item_presa AS ip ON dvv.cod_item = ip.cod_item "+
       " LEFT JOIN venta AS v ON dvv.cod_venta = v.cod_venta "+
       " LEFT JOIN caja AS c ON v.cod_caja = c.cod_caja "+
       " WHERE TO_DATE(c.fecha, 'DD/MM/YYYY') >= $1 " +
       " AND TO_DATE(c.fecha, 'DD/MM/YYYY') < $2 AND p.cod_categoria = 1 " +
       " GROUP BY p.cod_producto, p.nom_pro, p.cod_categoria, dv.cantidad_vendida ORDER BY p.cod_producto; " ;
    //     console.log("1.- Add Venta");
    //     //CONSULTA
    return await client.query(text, [fechaini, fechafin]);
}
//OBTENER DETALLE MES DE PRODUCTO
const get_mes_productos2 = async (client,fechaini, fechafin,categorias) =>{
    var productos=[];
    const text = " SELECT p.cod_producto, p.nom_pro, p.cod_categoria, SUM(dvv.unidad_item) AS cantidad_vendida " +
                 " FROM producto AS p "+
                 " LEFT JOIN detalle_venta AS dvv ON p.cod_producto = dvv.cod_producto "+
                 " LEFT JOIN venta AS v ON dvv.cod_venta = v.cod_venta "+
                 " LEFT JOIN caja AS c ON v.cod_caja = c.cod_caja "+
                 " WHERE TO_DATE(c.fecha, 'DD/MM/YYYY') >= $1 AND TO_DATE(c.fecha, 'DD/MM/YYYY') < $2 "+
                 " AND p.cod_categoria = $3 GROUP BY dvv.cod_producto, p.cod_producto ";
        
        console.log('2. ---------------- RECORREMOS CATEGORIAS ------------------');   
        for(const categoria of categorias){
            const cod_categoria = categoria.cod_categoria;
            const nom_categoria = categoria.nom_categoria;
            // console.log("Cod_Categoria:: ", cod_categoria);
           const lista= await client.query(text, [fechaini,fechafin, cod_categoria]);
           //console.log('Lista::: ' ,lista.rows);
           if (lista.rows.length!=0) {
            console.log('LLeno');
            // productos.push(lista.rows)
            //productos[nom_categoria] = lista.rows; //Agregamos las categoras por su nombre
            categoria_productos ={
                categoria:nom_categoria,
                productos:lista.rows
            };
            productos.push(categoria_productos)
           }
        }
        console.log('Poductos lista final::::: ',productos);
        return productos;             
}



// ********************* OBTENER DETALLE DE LA CAJA ***********************
//*************************************************************************
const get_detalles_Caja = async (req, res) =>{
    const cod_caja = req.params.cod_caja; // Obtener la fecha de la consulta
    console.log("Cod Caja::", cod_caja);

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Comienza la transacción
        //1.- Obtemos la CATEGORIAS
        console.log('1. --------------- Obtemos Categorias ------------');
        const categorias = await get_Categorias(client);
        // console.log('Categorias:: ', categorias);

        const productos_List= await get_caja_productos2(client,cod_caja,categorias);
        console.log('1. Entramos a:: ',productos_List);

        // 3.- Calculamos el total vendido por cada categoría
        console.log('3. ------------- Caltular procentaje ------------');
        const totalVendidoPorCategoria = {};
        for (const categoria of productos_List) {
            let totalCategoria = 0;
            for (const producto of categoria.productos) {
                totalCategoria += parseInt(producto.cantidad_vendida);
            }
            totalVendidoPorCategoria[categoria.categoria] = totalCategoria;
            console.log('nom categoria: ',categoria);
        }
        console.log('total categoria:: ', totalVendidoPorCategoria);

        // 4.- Calculamos el porcentaje para cada producto dentro de su categoría
        for (const categoria of productos_List) {
            for (const producto of categoria.productos) {
                const totalCategoria = totalVendidoPorCategoria[categoria.categoria];
                const porcentaje = (parseInt(producto.cantidad_vendida) / totalCategoria) * 100;
                producto.porcentaje = porcentaje.toFixed(2); // Redondeamos el porcentaje a dos decimales
            }
        }

        await client.query('COMMIT'); // Confirma la transacción

        res.status(200).json(productos_List);
    } catch (error) {
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
        console.error(error);
        res.status(500).json('Error al obtener de la base de datos');
    } finally {
        client.release(); // Libera la conexión al pool
    }
}
//OBTENER LISTA CATEGORIAS
const get_Categorias = async (client) =>{ 
    const categorias = await client.query("Select *from categoria")
    return categorias.rows;
}
//OBTENER DETALLE CAJA DE PRODUCTO POLLO
const get_caja_productos_P = async (client, cod_caja) =>{
//Consulta para insertar datos
    const text = " WITH CTE_CantidadVendida AS (SELECT dvv.cod_producto, SUM(dvv.unidad_item) AS cantidad_vendida "+
    " FROM producto AS p LEFT JOIN detalle_venta AS dvv ON p.cod_producto = dvv.cod_producto " +
    " LEFT JOIN venta AS v ON dvv.cod_venta = v.cod_venta LEFT JOIN caja AS c ON v.cod_caja = c.cod_caja " +
    " WHERE c.cod_caja= $1 " +
    " AND p.cod_categoria = 1 GROUP BY dvv.cod_producto ) "+
    " SELECT p.cod_producto, p.nom_pro, p.cod_categoria, dv.cantidad_vendida, "  +
    " SUM(CASE WHEN ip.cod_presa = 1 THEN ip.unidad_presa ELSE 0 END) AS unidad_ala, " +
    " SUM(CASE WHEN ip.cod_presa = 2 THEN ip.unidad_presa ELSE 0 END) AS unidad_pierna, " +
    " SUM(CASE WHEN ip.cod_presa = 3 THEN ip.unidad_presa ELSE 0 END) AS unidad_pecho "+
    " FROM producto AS p INNER JOIN CTE_CantidadVendida AS dv ON p.cod_producto = dv.cod_producto " +
    " LEFT JOIN detalle_venta AS dvv ON p.cod_producto = dvv.cod_producto "+
    " LEFT JOIN item_presa AS ip ON dvv.cod_item = ip.cod_item "+
    " LEFT JOIN venta AS v ON dvv.cod_venta = v.cod_venta "+
    " LEFT JOIN caja AS c ON v.cod_caja = c.cod_caja "+
    " WHERE c.cod_caja= $1 " +
    " AND p.cod_categoria = 1 " +
    " GROUP BY p.cod_producto, p.nom_pro, p.cod_categoria, dv.cantidad_vendida ORDER BY p.cod_producto; " ;
    //     //CONSULTA
    return await client.query(text, [cod_caja]);
}
//OBTENER DETALLE CAJA PRODUCTO
const get_caja_productos2 = async (client, cod_caja,categorias) =>{
    var productos=[];
    const text = ' SELECT p.cod_producto, p.nom_pro, p.cod_categoria, SUM(dvv.unidad_item) AS cantidad_vendida ' +
                 ' FROM producto AS p '+
                 ' LEFT JOIN detalle_venta AS dvv ON p.cod_producto = dvv.cod_producto '+
                 ' LEFT JOIN venta AS v ON dvv.cod_venta = v.cod_venta '+
                 ' LEFT JOIN caja AS c ON v.cod_caja = c.cod_caja '+
                 ' WHERE c.cod_caja= $1 '+
                 ' AND p.cod_categoria = $2 GROUP BY dvv.cod_producto, p.cod_producto ';
        
        console.log('2. ---------------- RECORREMOS CATEGORIAS ------------------');   
        for(const categoria of categorias){
            const cod_categoria = categoria.cod_categoria;
            const nom_categoria = categoria.nom_categoria;
            // console.log("Cod_Categoria:: ", cod_categoria);
           const lista= await client.query(text, [cod_caja, cod_categoria]);
           //console.log('Lista::: ' ,lista.rows);
           if (lista.rows.length!=0) {
            console.log('LLeno');
            // productos.push(lista.rows)
            //productos[nom_categoria] = lista.rows; //Agregamos las categoras por su nombre
            categoria_productos ={
                categoria:nom_categoria,
                productos:lista.rows
            };
            productos.push(categoria_productos)
           }
        }
        console.log('Poductos lista final::::: ',productos);
        return productos;             
}


// ********************** ELIMINAR TODA LA CAJA **************************
//************************************************************************
const delete_All_Caja = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Comienza la transacción
        const cod_caja = parseInt(req.params.cod_caja);

        // Elimina registros en múltiples pasos
        await client.query('DELETE FROM item_presa WHERE cod_item IN (SELECT cod_item FROM detalle_venta WHERE cod_venta IN (SELECT cod_venta FROM venta WHERE cod_caja = $1))', [cod_caja]);
        await client.query('DELETE FROM detalle_venta WHERE cod_venta IN (SELECT cod_venta FROM venta WHERE cod_caja = $1)', [cod_caja]);
        await client.query('DELETE FROM venta WHERE cod_caja = $1', [cod_caja]);
        await client.query('DELETE FROM caja WHERE cod_caja = $1', [cod_caja]);

        await client.query('COMMIT'); // Confirma la transacción
        res.status(200).json("Caja eliminada correctamente");
    } catch (error) {
        await client.query('ROLLBACK'); // Revierte la transacción en caso de error
        console.error(error);
        res.status(500).json('Error al eliminar en la base de datos');
    } finally {
        client.release(); // Libera la conexión al pool
    }
};


module.exports = {
    get_Caja,
    get_Caja_by_Mes,
    crear_Caja,
    update_Caja,
    delete_caja,
    cerrar_caja,
    get_last_Caja,
    get_detalles_Mes,
    get_detalles_Caja,
    delete_All_Caja
}