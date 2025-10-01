const {Router} = require('express');
const router = Router();
const ventasController = require('../controllers/ventas.controller');

router.get('/:cod_caja/:hr_apertura',ventasController.get_Venta);
router.get('/detalle',ventasController.get_Detalle_Venta);
router.get('/item',ventasController.get_Item_Presa);
router.post('/',ventasController.Agregar_Venta);
router.put('/',ventasController.modificar_Venta);
router.post('/delete',ventasController.Delete_Venta);

router.put('/estado',ventasController.update_estado);
router.put('/estado_l',ventasController.update_estado_L);

module.exports = router;