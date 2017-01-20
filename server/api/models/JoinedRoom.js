export default (sequelize, DataTypes) => {
  return sequelize.define('joinedRoom', {
    roomName: { type: DataTypes.STRING, allowNull: false, unique: 'joinedRoom' },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: 'joinedRoom' },
  }, {
    timestamps: false,
  });
};
