import database from '../src/models';

class TemplateService {
  static async getAllTemplates() {
    try {
      return await database.Template.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async addTemplate(newTemplate) {
    try {
      const templateType = database.TemplateType.findByPk(newTemplate.templateTypeId);
      return await database.Template.create({
        ...newTemplate,
        templateType
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateTemplate(id, updateTemplate) {
    try {
      const templateToUpdate = await database.Template.findOne({
        where: { id: Number(id) }
      });

      if (templateToUpdate) {
        await database.Template.update(updateTemplate, { where: { id: Number(id) } });

        return updateTemplate;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getOneTemplate(id) {
    try {
      const theTemplate = await database.Template.findOne({
        where: { id: Number(id) }
      });

      return theTemplate;
    } catch (error) {
      throw error;
    }
  }

  static async deleteTemplate(id) {
    try {
      const templateToDelete = await database.Template.findOne({ where: { id: Number(id) } });

      if (templateToDelete) {
        const deletedTemplate = await database.Template.destroy({
          where: { id: Number(id) }
        });
        return deletedTemplate;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default TemplateService;
