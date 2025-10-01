const {Router} = require('express');
const router = Router();
const cajaController = require('../controllers/caja.controllers');

router.get('/',cajaController.get_Caja);
router.get('/mes',cajaController.get_Caja_by_Mes);
router.get('/last',cajaController.get_last_Caja);
router.post('/',cajaController.crear_Caja);
router.put('/',cajaController.update_Caja);
router.put('/cerrar',cajaController.cerrar_caja);
router.delete('/:cod_caja',cajaController.delete_caja);
router.delete('/allcaja/:cod_caja',cajaController.delete_All_Caja);
//Get detalles
router.get('/detalleM',cajaController.get_detalles_Mes);
router.get('/detalleD/:cod_caja',cajaController.get_detalles_Caja);

module.exports = router;