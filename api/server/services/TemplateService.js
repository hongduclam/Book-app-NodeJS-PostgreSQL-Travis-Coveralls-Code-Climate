import * as uuid from 'uuid';
import database from '../src/models';
import { createFilePromise, readFilePromise } from '../utils/fileUtils';

const velocity = require('velocity-template-engine');
const puppeteer = require('puppeteer');
const fs = require('fs');

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
        uuid: uuid.v4()
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
            ...variable,
            id: variable.id,
            name: variable.name,
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

  static async exportTemplate(id, { templateContent, templateData }) {
    try {
      const templateModel = await database.Template.findOne({ where: { id: Number(id) } });
      if (templateModel) {
        const template = templateModel.toJSON();
        const folderPackageId = template.uuid || uuid.v4();
        const { dataCss, dataHtml } = templateContent;
        const modelData = templateData || {};
        const publicFolderPath = `${global.appRoot}/public`;

        console.log('template.uuid', template.uuid);

        // eslint-disable-next-line no-undef
        const folderPath = `${publicFolderPath}/${folderPackageId}`;

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
        }
        await createFilePromise(`${folderPath}/${'gjsCss'}.css`, dataCss);
        await createFilePromise(`${folderPath}/${'gjsHtml'}.html`, dataHtml);

        const gjsHtml = await readFilePromise(`${folderPath}/gjsHtml.html`);
        const htmlContent = velocity.render(gjsHtml, modelData, {});

        const reportHtmlContent = `<!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <link rel="stylesheet" href="./gjsCss.css">
          </head>
          <body>${htmlContent}</body>
        <html>`;
        const templateHtmlPath = `${folderPath}/report-template.html`;

        await createFilePromise(`${templateHtmlPath}`, reportHtmlContent);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`http://localhost:${global.port}/public/${folderPackageId}/report-template.html`, { waitUntil: 'networkidle2', });
        const pdfName = `${template.name.split(' ').join('')}-report.pdf`;
        const pdfPath = `${folderPath}/${pdfName}`;
        await page.pdf({
          path: pdfPath,
          format: 'letter',
        });
        await browser.close();
        return { pdfName, pdfPath: `public/${folderPackageId}/${pdfName}` };
      }

      return null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default TemplateService;
