module.exports = (sequelize, DataTypes) => {
  const TemplateType = sequelize.define('TemplateType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT('tiny'),
      allowNull: false,
    }
  }, {
    tableName: 'TemplateType',
    timestamps: false
  });
  return TemplateType;
};
