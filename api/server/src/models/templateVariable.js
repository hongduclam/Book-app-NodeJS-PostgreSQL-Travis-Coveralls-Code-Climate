module.exports = (sequelize, DataTypes) => {
  const TemplateVariable = sequelize.define('TemplateVariable', {
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    variableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  TemplateVariable.associate = function (models) {
    TemplateVariable.belongsTo(models.Template, { foreignKey: 'templateId', as: 'template' });
    TemplateVariable.belongsTo(models.Variable, { foreignKey: 'variableId', as: 'variable' });
  };
  return TemplateVariable;
};
