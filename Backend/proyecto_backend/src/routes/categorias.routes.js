const { Router } = require('express');
const router = Router();
const categoriasController = require('../controllers/categorias.controller');

// Rutas relacionadas con categorías
router.get('/', categoriasController.getCategorias);
router.post('/', categoriasController.crearCategoria);
router.put('/', categoriasController.updateCategoriaById);
router.delete('/:cod_categoria', categoriasController.deleteCategoriaById);


// router.get('/:cod_producto',productosController.getProductoById);
module.exports = router;
