import TemplateService from '../services/TemplateService';
import Util from '../utils/Utils';

const util = new Util();

class TemplateController {
  static async getAllTemplates(req, res) {
    try {
      const allTemplates = await TemplateService.getAllTemplates();
      if (allTemplates.length > 0) {
        util.setSuccess(200, 'Templates retrieved', allTemplates);
      } else {
        util.setSuccess(200, 'No template found');
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addTemplate(req, res) {
    if (!req.body.name || !req.body.templateTypeId) {
      util.setError(400, 'Please provide complete details');
      return util.send(res);
    }
    const newTemplate = req.body;
    try {
      const createdTemplate = await TemplateService.addTemplate({
        ...newTemplate,
        createdBy: req.user.id,
        updatedBy: req.user.id
      });
      util.setSuccess(201, 'Template Added!', createdTemplate);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updatedTemplate(req, res) {
    const alteredTemplate = req.body;
    const { id } = req.params;
    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(res);
    }
    try {
      const updateTemplate = await TemplateService.updateTemplate(id,
        { ...alteredTemplate, updatedBy: req.user.id });
      if (!updateTemplate) {
        util.setError(404, `Cannot find template with the id: ${id}`);
      } else {
        util.setSuccess(200, 'Template updated', updateTemplate);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async getOneTemplate(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(res);
    }

    try {
      const theTemplate = await TemplateService.getOneTemplate(id);

      if (!theTemplate) {
        util.setError(404, `Cannot find template with the id ${id}`);
      } else {
        util.setSuccess(200, 'Found Template', theTemplate);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async deleteTemplate(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Please provide a numeric value');
      return util.send(res);
    }

    try {
      const templateToDelete = await TemplateService.deleteTemplate(id);

      if (templateToDelete) {
        util.setSuccess(200, 'Template deleted');
      } else {
        util.setError(404, `Template with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default TemplateController;
