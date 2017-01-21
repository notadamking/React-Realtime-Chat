import models from '../models';

export default (sequelize, DataTypes) => {
  return sequelize.define('room', {
    name: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  }, {
    classMethods: {
      associate({ JoinedRoom, User }) {
        this.belongsToMany(User, {
          through: {
            model: JoinedRoom
          },
          as: 'users',
          foreignKey: 'roomName',
          constraints: false,
        });
      },
      async getOnlineUsersForRoom(room) {
        const users = await models.User.findAll({ where: { currentRoom: room } });
        return users;
      },
      async getAllUsersForRoom(aRoom) {
        const room = await this.findCreateFind({
          where: {
            name: aRoom,
          },
          attributes: [],
          include: [{
            model: models.User,
            as: 'users',
          }],
        });
        return room[0].users ? room[0].users.map((u) => u.toJSON()) : [];
      },
    },
    timestamps: false,
  });
};
