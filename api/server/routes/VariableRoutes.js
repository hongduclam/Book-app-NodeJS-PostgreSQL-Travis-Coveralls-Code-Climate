import { Router } from 'express';
import VariableController from '../controllers/VariableController';

const router = Router();

router.get('/', VariableController.getAllVariables);
router.post('/', VariableController.addVariable);
router.get('/:id', VariableController.getOneVariable);
router.put('/:id', VariableController.updatedVariable);
router.delete('/:id', VariableController.deleteVariable);

export default router;
