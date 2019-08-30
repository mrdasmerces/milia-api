'use strict';

const {
  ItemNotFoundError, 
  DbConnectionError,
} = require('../utils/custom-errors');

const DynamoDB = require('aws-sdk/clients/dynamodb');

class AwsHelper {

  static async getUser(idValue) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-users`;
    const idKey = 'email';
    return AwsHelper.findById(idKey, idValue, table);
  }

  static async getUserSession(idValue) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-session`;
    const idKey = 'accessToken';
    return AwsHelper.findById(idKey, idValue, table);
  };

  static async deleteUserSession(accessToken) {

    AwsHelper.dynamodb = AwsHelper.getDynamo();
    const params = {
      Key: {
        accessToken,
      },
      TableName: `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-session`,
    };

    try {
      await AwsHelper.dynamodb.delete(params).promise();
    } catch (error) {
      throw new DbConnectionError(error.message);
    }
  }

  static async setUserSession(obj) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-session`;
    return AwsHelper.save(table, obj);
  };  

  static async updateUserAccessToken(email, accessToken) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-users`;
    const idKey = 'email';

    const params = {
      TableName: table,
      Key: {
        [idKey]: email,
      },
      UpdateExpression: "set accessToken = :accessToken",
      ExpressionAttributeValues:{
        ":accessToken": accessToken,
      },
      ReturnValues: "UPDATED_NEW"
    };

    return await AwsHelper.update(params);
  }  

  static async save(table, obj) {
    AwsHelper.dynamodb = AwsHelper.getDynamo();
    const params = {
      TableName: table,
      Item: obj,
    };

    try {
      await AwsHelper.dynamodb.put(params).promise();
    } catch (error) {
      throw new DbConnectionError(error.message);
    }

    return obj;
  }

  static async update(params) {
    AwsHelper.dynamodb = AwsHelper.getDynamo();

    try {
      await AwsHelper.dynamodb.update(params).promise();
    } catch (error) {
      throw new DbConnectionError(error.message);
    }

    return params;
  }

  static async findById(idKey, idValue, table) {

    AwsHelper.dynamodb = AwsHelper.getDynamo();

    const params = {
      TableName: table,
      Key: {
        [idKey]: idValue,
      },
    };

    let item = {};

    try {
      item = await AwsHelper.dynamodb.get(params).promise();
    } catch (error) {
      throw new DbConnectionError(error.message);
    }

    if (item == null || item.Item == null) {
      return null;
    } else {
      return item.Item;
    }

  }

  static getDynamo() {

    if (AwsHelper.dynamodb == null) {
      AwsHelper.dynamodb = new DynamoDB.DocumentClient({ region: process.env.REGION });
    }

    return AwsHelper.dynamodb;

  }

}

AwsHelper.dynamodb = null;

module.exports = AwsHelper;