module.exports = (sequelize, DataTypes) => {
  const TemplateVariable = sequelize.define('TemplateVariable', {
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    variableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  }, {
    tableName: 'TemplateVariable',
    timestamps: false
  });
  TemplateVariable.associate = function (models) {
    TemplateVariable.belongsTo(models.Template, { foreignKey: 'templateId', as: 'template' });
    TemplateVariable.belongsTo(models.Variable, { foreignKey: 'variableId' });
  };
  return TemplateVariable;
};
