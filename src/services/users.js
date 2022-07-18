const UserModel = require("../models/user");
const dbError = require("../helpers/dbError");
const uuid = require("uuid");

class UserService {
  async getAll() {
    const users = await UserModel.find();
    return users;
  }

  async getByEmail(email) {
    try {
      const user = await UserModel.findOne({email});
      return user;
    } catch(error) {
      console.log(error);
      return error;
    }
  }

  async getOrCreateByProvider(data) {
    let user = await UserModel.findOne({
      [`provider.${data.provider}`]: true,
      [`idProvider.${data.provider}`]: data.idProvider
    });
    if(user) {
      return {
        created: true,
        user
      };
    }
    data.password = uuid.v4();
    const newData = {
      ...data,
      provider: {
        [data.provider]: true
      },
      idProvider: {
        [data.provider]: data.idProvider
      }
    };
    try {
      user = await UserModel.create(newData);

      return {
        created: true,
        user
      };
    } catch(error) {
      if(error.code === 11000 && error.keyValue.email) { // Duplicated Entry
        const email = error.keyValue.email;
        user = await UserModel.findOneAndUpdate({email}, {
          [`provider.${data.provider}`]: true,
          [`idProvider.${data.provider}`]: data.idProvider
        }, {new:true});
        
        return {
          created: true,
          user
        };
      }
      return dbError(error);
    }
  }

  async create(data) {
    try {
      const user = await UserModel.create(data);

      return {
        created: true,
        user
      };
    } catch(error) {
      return dbError(error);
    }
  }
}

module.exports = UserService;