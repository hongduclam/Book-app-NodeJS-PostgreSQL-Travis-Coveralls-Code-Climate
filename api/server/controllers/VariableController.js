import VariableService from '../services/VariableService';
import Util from '../utils/Utils';

const util = new Util();

class VariableController {
  static async getAllVariables(req, res) {
    try {
      const allVariables = await VariableService.getAllVariables();
      if (allVariables.length > 0) {
        util.setSuccess(200, 'Variables retrieved', allVariables);
      } else {
        util.setSuccess(200, 'No variable found');
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addVariable(req, res) {
    if (!req.body.name || !req.body.value) {
      util.setError(400, 'Please provide complete details');
      return util.send(res);
    }
    const newVariable = req.body;
    try {
      const createdVariable = await VariableService.addVariable({
        ...newVariable,
        createdBy: req.user.id,
        updatedBy: req.user.id
      });
      util.setSuccess(201, 'Variable Added!', createdVariable);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updatedVariable(req, res) {
    const alteredVariable = req.body;
    const { id } = req.params;
    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(res);
    }
    try {
      const updateVariable = await VariableService.updateVariable(id,
        { ...alteredVariable, updatedBy: req.user.id });
      if (!updateVariable) {
        util.setError(404, `Cannot find variable with the id: ${id}`);
      } else {
        util.setSuccess(200, 'Variable updated', updateVariable);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async getOneVariable(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(res);
    }

    try {
      const theVariable = await VariableService.getOneVariable(id);

      if (!theVariable) {
        util.setError(404, `Cannot find variable with the id ${id}`);
      } else {
        util.setSuccess(200, 'Found Variable', theVariable);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async deleteVariable(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Please provide a numeric value');
      return util.send(res);
    }

    try {
      const variableToDelete = await VariableService.deleteVariable(id);

      if (variableToDelete) {
        util.setSuccess(200, 'Variable deleted');
      } else {
        util.setError(404, `Variable with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default VariableController;
