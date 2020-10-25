import database from '../src/models';

class TemplateService {
  static async getAllTemplates() {
    try {
      const templates = await database.Template.findAll({
        include: [{
          model: database.TemplateVariable,
          as: 'templateVariables',
          attributes: ['variableId'],
          include: [
            {
              model: database.Variable,
              as: 'variable'
            }
          ]
        }]
      });
      console.log('templates', templates);
      return templates.map((t) => {
        const data = t.toJSON();
        return {
          ...data,
          templateVariables: data.templateVariables.map(({ variable }) => {
            return {
              id: variable.id, name: variable.name
            };
          })
        };
      });
    } catch (error) {
      throw error;
    }
  }

  static async createTemplateVariables(templateId, variables = [], transaction) {
    const promises = [];
    variables.forEach((tv) => {
      promises.push(database.TemplateVariable.create({
        variableId: tv.variableId,
        templateId
      }, { transaction }));
    });
    await Promise.all(promises);
  }

  static async addTemplate(newTemplate) {
    let transaction = null;
    try {
      transaction = await database.sequelize.transaction();
      const { templateVariables } = newTemplate;
      const createdTemplate = await database.Template.create({
        ...newTemplate,
      }, { transaction });
      await this.createTemplateVariables(createdTemplate.id, templateVariables, transaction);
      await transaction.commit();
      return createdTemplate;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  static async updateTemplate(id, updateTemplate) {
    let transaction = null;
    try {
      transaction = await database.sequelize.transaction();
      const templateToUpdate = await database.Template.findOne({
        where: { id: Number(id) }
      });
      if (templateToUpdate) {
        const { templateVariables } = updateTemplate;
        await database.Template.update(updateTemplate, { where: { id: Number(id) } });
        await this.createTemplateVariables(id, templateVariables, transaction);
        await transaction.commit();
        return updateTemplate;
      }
      return null;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  static async getOneTemplate(id) {
    try {
      const theTemplate = await database.Template.findOne({
        where: { id: Number(id) },
        include: [
          {
            model: database.TemplateVariable,
            as: 'templateVariables',
            attributes: ['variableId'],
            include: [
              {
                model: database.Variable,
                as: 'variable'
              }
            ]
          }
        ]
      });
      const data = theTemplate.toJSON();
      return {
        ...data,
        templateVariables: data.templateVariables.map(({ variable }) => {
          return {
            id: variable.id, name: variable.name
          };
        })
      };
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
