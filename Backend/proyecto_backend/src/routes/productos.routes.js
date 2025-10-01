const { Router } = require('express');
const router = Router();
const productosController = require('../controllers/productos.controller');

// Rutas relacionadas con productos
router.get('/', productosController.getProductos);
router.post('/', productosController.crearProductos);
router.put('/', productosController.updateProductoById);
router.delete('/:cod_producto', productosController.deleteProductoById);
// router.get('/:cod_producto', productosController.getProductoById);

module.exports = router;
