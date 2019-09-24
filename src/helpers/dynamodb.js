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
  };

  static async getUserSession(idValue) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-user-session`;
    const idKey = 'accessToken';
    return AwsHelper.findById(idKey, idValue, table);
  };

  static async getUserActualTrip(idValue) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-user-actual-trip`;
    const idKey = 'email';
    return AwsHelper.findById(idKey, idValue, table);
  };

  static async getTripItinerary(idValue) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-trip-itinerary`;
    const idKey = 'tripId';
    return AwsHelper.findById(idKey, idValue, table);
  };  

  static async getUserMessages(idValue) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-user-messages`;

    const params = {
      TableName : table,
      IndexName : "emailIndex",
      KeyConditionExpression: "#email = :v_email",
      ExpressionAttributeNames:{
          "#email": "email"
      },
      ExpressionAttributeValues: {
          ":v_email": idValue
      }
    };

    return AwsHelper.query(params);
  };

  static async getUserTimeline(idValue) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-user-timeline`;
    const idKey = 'email';
    return AwsHelper.findById(idKey, idValue, table);
  };
  
  static async setNewUser(obj) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-users`;
    return AwsHelper.save(table, obj);
  };  

  static async setNewUserMessage(obj) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-user-messages`;
    return AwsHelper.save(table, obj);
  };    
  
  static async setUserSession(obj) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-user-session`;
    return AwsHelper.save(table, obj);
  };
  
  static async saveNewTrip(obj) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-user-actual-trip`;
    return AwsHelper.save(table, obj);
  };
  
  static async setNewUserPost(obj) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-user-timeline`;
    return AwsHelper.save(table, obj);
  };
  
  static async setNewItinerary(obj) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-trip-itinerary`;
    return AwsHelper.save(table, obj);
  };   

  static async deleteUserSession(accessToken) {

    AwsHelper.dynamodb = AwsHelper.getDynamo();
    const params = {
      Key: {
        accessToken,
      },
      TableName: `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-user-session`,
    };

    try {
      await AwsHelper.dynamodb.delete(params).promise();
    } catch (error) {
      throw new DbConnectionError(error.message);
    }
  }
  
  static async deleteUserPost(email) {

    AwsHelper.dynamodb = AwsHelper.getDynamo();
    const params = {
      Key: {
        email,
      },
      TableName: `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-user-timeline`,
    };

    try {
      await AwsHelper.dynamodb.delete(params).promise();
    } catch (error) {
      throw new DbConnectionError(error.message);
    }
  }  

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
  
  static async updateSession(sessionId, dynamoContext) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-user-session`;
    const idKey = 'accessToken';

    const params = {
      TableName: table,
      Key: {
        [idKey]: sessionId,
      },
      UpdateExpression: "set dynamoContext = :dynamoContext",
      ExpressionAttributeValues:{
        ":dynamoContext": dynamoContext,
      },
      ReturnValues: "UPDATED_NEW"
    };

    return await AwsHelper.update(params);
  }
  
  static async updateItinerary(tripId, itinerary) {
    const table = `${process.env.SERVERLESS_SERVICE}-${process.env.STAGE}-trip-itinerary`;
    const idKey = 'tripId';

    const params = {
      TableName: table,
      Key: {
        [idKey]: tripId,
      },
      UpdateExpression: "set itinerary = :itinerary",
      ExpressionAttributeValues:{
        ":itinerary": itinerary,
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

  static async query(params) {

    AwsHelper.dynamodb = AwsHelper.getDynamo();

    let item = {};

    try {
      item = await AwsHelper.dynamodb.query(params).promise();
    } catch (error) {
      throw new DbConnectionError(error.message);
    }

    if (item == null || item.Items == null) {
      return null;
    } else {
      return item.Items;
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