import { Router } from 'express';
import TemplateController from '../controllers/TemplateController';

const router = Router();

router.get('/', TemplateController.getAllTemplates);
router.post('/', TemplateController.addTemplate);
router.get('/:id', TemplateController.getOneTemplate);
router.put('/:id', TemplateController.updatedTemplate);
router.delete('/:id', TemplateController.deleteTemplate);

export default router;
