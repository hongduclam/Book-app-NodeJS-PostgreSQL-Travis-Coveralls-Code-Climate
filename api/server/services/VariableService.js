import database from '../src/models';

class VariableService {
  static async getAllVariables() {
    try {
      return await database.Variable.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async addVariable(newVariable) {
    try {
      return await database.Variable.create(newVariable);
    } catch (error) {
      throw error;
    }
  }

  static async updateVariable(id, updateVariable) {
    try {
      const variableToUpdate = await database.Variable.findOne({
        where: { id: Number(id) }
      });

      if (variableToUpdate) {
        await database.Variable.update(updateVariable, { where: { id: Number(id) } });

        return updateVariable;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getOneVariable(id) {
    try {
      const theVariable = await database.Variable.findOne({
        where: { id: Number(id) }
      });

      return theVariable;
    } catch (error) {
      throw error;
    }
  }

  static async deleteVariable(id) {
    try {
      const variableToDelete = await database.Variable.findOne({ where: { id: Number(id) } });

      if (variableToDelete) {
        const deletedVariable = await database.Variable.destroy({
          where: { id: Number(id) }
        });
        return deletedVariable;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default VariableService;
