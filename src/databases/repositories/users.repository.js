require('dotenv').config();
const path = require('path');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const __dir = require('app-root-path');
const configKey = require(path.resolve(`${__dir}/configurations`)).tokenKey;
const jwt = require('jsonwebtoken');
const { userModel, requestSigninModel, userAuthenModel } = require('../models');
const { isValidObjectId } = require('mongoose');
const { UserRoleEnum } = require('../../constants/settings.constants');

class UserRepository {
  constructor() {}

  async getOneUserByFilter(query) {
    if ('_id' in query && !isValidObjectId(query._id)) return null;
    return userModel.findOne(query).lean();
  }

  async getOneUserByFilterWithPassword(query) {
    if ('_id' in query && !isValidObjectId(query._id)) return null;
    return userModel.findOne(query, '+password').lean();
  }

  async getAllUsers(query) {
    return userModel
      .find(query)
      .lean()
      .then((results) => {
        return results.filter((e) => e.level !== UserRoleEnum.SYSTEM_ADMIN);
      });
  }

  async getListByFilter(query) {
    return userModel.find(query).lean();
  }

  async checkUserExist(filter) {
    if ('_id' in filter && !isValidObjectId(filter._id)) return null;
    return userModel.exists(filter).then((doc) => !!doc);
  }

  async updateUserByObject(userId, dataObj) {
    if (!isValidObjectId(userId)) return null;
    return await userModel.findByIdAndUpdate(userId, dataObj, { upsert: true, new: true }).then((results) => {
      return JSON.parse(JSON.stringify(results));
    });
  }

  async deleteUser(userId) {
    if (!isValidObjectId(userId)) return null;
    return userModel.findOneAndRemove({ _id: userId }).exec();
  }

  async checkDupEmailAndUssername(_email, _username) {
    const email = _email.toLowerCase();
    const username = _username.toLowerCase();
    let getSameEmailAndUsername = await userModel.find({ $or: [{ email }, { username }] }).exec();
    if (getSameEmailAndUsername.length > 0) {
      return true;
    }
    return false;
  }

  async create(payload) {
    const { username: _username, email: _email, type } = payload;
    const username = _username.toLowerCase();
    const email = _email.toLowerCase();
    const dataForCreate = { ...payload, email, username, type };
    const schemUser = new userModel(dataForCreate);
    return await schemUser.save().then((results) => {
      return JSON.parse(JSON.stringify(results));
    });
  }

  async createAndCheckDup(userData, type) {
    let returnData = JSON.parse('{}');
    try {
      const email = userData['email'].toLowerCase();
      let _username = userData['username'];
      let getSameEmailAndUsername = await userModel.find({ $or: [{ email: email }, { username: _username }] }).exec();
      if (getSameEmailAndUsername.length > 0) {
        return false;
      }
      const dataForCreate = { ...userData, email, type };
      if (type === 'SITE_AUTHEN') {
        const hashPassword = bcrypt.hashSync(userData['password'], bcrypt.genSaltSync(8), null);
        dataForCreate['password'] = hashPassword;
      }
      const schemUser = new userModel(dataForCreate);
      return await schemUser
        .save()
        .then((results) => {
          return JSON.parse(JSON.stringify(results));
        })
        .catch(() => {
          return false;
        });
    } catch (error) {
      returnData['status'] = false;
      returnData['message'] = `${error['message']}`;
      return JSON.parse(JSON.stringify(returnData));
    }
  }

  async updateUserByFilter(userid, arrDataForUpdate) {
    let returnData = JSON.parse('{}');
    try {
      let arrValueUpdated = [];
      let getSameUsername = await userModel.findById(userid).exec();
      if (!getSameUsername) {
        returnData['status'] = false;
        returnData['message'] = `${userid} is not found.`;
      } else {
        let update = JSON.parse(`{}`);
        for (let data of arrDataForUpdate) {
          try {
            if (data['key'] === `password`) {
              let hashPassword = await bcrypt.hashSync(data['value'], bcrypt.genSaltSync(8), null);
              update[`${data['key']}`] = hashPassword;
            } else {
              update[`${data['key']}`] = data['value'];
            }
            let updated = await userModel
              .findByIdAndUpdate(
                userid,
                {
                  ...update,
                  updatedAt: moment().tz('Asia/Bangkok').unix(),
                },
                { upsert: true },
              )
              .exec();
            if (updated) {
              arrValueUpdated.push(data);
            }
          } catch (error) {
            return false;
          }
        }
        returnData['status'] = true;
        returnData['data'] = arrValueUpdated;
      }
      // ! for add some condition
      return JSON.parse(JSON.stringify(returnData));
    } catch (error) {
      returnData['status'] = false;
      returnData['message'] = `${error['message']}`;
      return JSON.parse(JSON.stringify(returnData));
    }
  }

  async getUserProfile(userid) {
    let returnData = JSON.parse('{}');
    try {
      let dataTemp = await userModel.findById(userid).exec();
      if (dataTemp !== null) {
        return JSON.parse(JSON.stringify(dataTemp));
      } else {
        returnData['code'] = `userNotFound`;
        returnData['message'] = `user id ${userid} not found.`;
        return JSON.parse(JSON.stringify({ error: returnData }));
      }
    } catch (error) {
      returnData['code'] = `errorInGetUserProfile`;
      returnData['message'] = `${error['message']}`;
      return JSON.parse(JSON.stringify({ error: returnData }));
    }
  }

  async getAccessToken(userData, remember) {
    try {
      const { email } = userData;
      delete userData['password'];
      const accessToken = jwt.sign(userData, configKey.accessToken.privateKey, {
        expiresIn: configKey.accessToken.accessTokenLife,
        algorithm: 'RS256',
      });
      const refreshToken = jwt.sign(userData, configKey.refreshToken.privateKey, {
        expiresIn: configKey.refreshToken.refreshTokenLife,
        algorithm: 'RS256',
      });
      await this.updateTokenOfUser(email, accessToken, refreshToken, remember);
      await this.clearRequestSignIn(email);
      return { accessToken, refreshToken };
    } catch (error) {
      return false;
    }
  }

  async increaseRequestSignIn(email) {
    try {
      const requestSignInData = await requestSigninModel
        .findOne({ email: email })
        .then((result) => {
          return JSON.parse(JSON.stringify(result));
        })
        .catch(() => false);
      if (!requestSignInData) {
        const schemData = new requestSigninModel({ email, count: 1 });
        const resquestData = await schemData.save();
        return JSON.parse(JSON.stringify(resquestData));
      } else {
        const update = {
          count: requestSignInData['count'] + 1,
        };
        return await requestSigninModel
          .findByIdAndUpdate(requestSignInData['_id'], update, { upsert: true, new: true })
          .then((result) => {
            return JSON.parse(JSON.stringify(result));
          })
          .catch(() => {
            return false;
          });
      }
    } catch (error) {
      return false;
    }
  }

  async setRequestSignInDeactive(email) {
    try {
      await userModel.findOneAndUpdate({ email }, { status: 'deactive' }, { upsert: true }).exec();
      return true;
    } catch (error) {
      return false;
    }
  }

  async clearRequestSignIn(email) {
    return await requestSigninModel.find({ email }).deleteMany().exec();
  }

  async updateTokenOfUser(email, accessToken, refreshToken, rememberStatus) {
    try {
      let _unixTime = moment().tz(this.timezone).unix();
      let filter = JSON.parse('{}');
      filter[`email`] = email;
      let userData = await JSON.parse(JSON.stringify(await userAuthenModel.findOne(filter).exec()));
      if (userData === null) {
        // ! create user token
        let dataForCreate = JSON.parse('{}');
        dataForCreate[`email`] = email.toLowerCase();
        dataForCreate[`accessToken`] = accessToken;
        dataForCreate[`refreshToken`] = refreshToken;
        dataForCreate[`remember`] = rememberStatus;
        dataForCreate[`createdAt`] = _unixTime;
        dataForCreate[`updatedAt`] = _unixTime;
        let userSchema = new userAuthenModel(dataForCreate);
        let dataCreated = await userSchema.save();
        return JSON.parse(JSON.stringify(dataCreated));
      } else {
        // ! update user token
        let update = JSON.parse('{}');
        update[`accessToken`] = accessToken;
        update[`refreshToken`] = refreshToken;
        update[`remember`] = rememberStatus;
        update[`updatedAt`] = _unixTime;
        let userUpdated = await userAuthenModel.updateOne(filter, update, { useFindAndModify: false }).exec();
        return JSON.parse(JSON.stringify(userUpdated));
      }
    } catch (error) {
      return false;
    }
  }

  async getrefresTokenData(refreshToken) {
    return userAuthenModel.findOne({ refreshToken }).lean();
  }
}

module.exports = UserRepository;
