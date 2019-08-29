"use strict";

/** Generated by Serverless WarmUp Plugin at 2019-08-29T18:06:42.057Z */
const aws = require("aws-sdk");
aws.config.region = "us-east-1";
const lambda = new aws.Lambda();
const functions = [{"name":"milia-api-dev-authenticate","config":{"enabled":true,"payload":"{\"source\":\"serverless-plugin-warmup\"}","concurrency":1}},{"name":"milia-api-dev-ask-milia","config":{"enabled":true,"payload":"{\"source\":\"serverless-plugin-warmup\"}","concurrency":1}}];

module.exports.warmUp = async (event, context) => {
  console.log("Warm Up Start");

  const invokes = await Promise.all(functions.map(async (func) => {
    let concurrency;
    const functionConcurrency = process.env["WARMUP_CONCURRENCY_" + func.name.toUpperCase().replace(/-/g, '_')]

    if (functionConcurrency) {
      concurrency = parseInt(functionConcurrency);
      console.log(`Warming up function: ${func.name} with concurrency: ${concurrency} (from function-specific environment variable)`);
    } else if (process.env.WARMUP_CONCURRENCY) {
      concurrency = parseInt(process.env.WARMUP_CONCURRENCY);
      console.log(`Warming up function: ${func.name} with concurrency: ${concurrency} (from global environment variable)`);
    } else {
      concurrency = func.config.concurrency;
      console.log(`Warming up function: ${func.name} with concurrency: ${concurrency}`);
    }

    const params = {
      ClientContext: Buffer.from(`{"custom":${func.config.payload}}`).toString('base64'),
      FunctionName: func.name,
      InvocationType: "RequestResponse",
      LogType: "None",
      Qualifier: process.env.SERVERLESS_ALIAS || "$LATEST",
      Payload: func.config.payload
    };

    try {
      await Promise.all(Array(concurrency).fill(0).map(async () => await lambda.invoke(params).promise()));
      console.log(`Warm Up Invoke Success: ${func.name}`);
      return true;
    } catch (e) {
      console.log(`Warm Up Invoke Error: ${func.name}`, e);
      return false;
    }
  }));

  console.log(`Warm Up Finished with ${invokes.filter(r => !r).length} invoke errors`);
}