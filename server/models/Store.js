module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [20, 60]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 400]
      }
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    avg_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 5
      }
    },
    ratings_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  }, {
    tableName: 'stores',
    timestamps: true
  });

  Store.associate = (models) => {
    Store.belongsTo(models.User, {
      foreignKey: 'owner_id',
      as: 'owner'
    });
    
    Store.hasMany(models.Rating, {
      foreignKey: 'store_id',
      as: 'ratings'
    });
  };

  return Store;
};

