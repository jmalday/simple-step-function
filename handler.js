'use strict';
var AWS = require('aws-sdk');
var stepfunctions = new AWS.StepFunctions();


module.exports.start = async (event,_, callback) => {
    const body = JSON.parse(event.body);
    const stateMachineArn = process.env.STATE_MACHINE_ARN;
    const awaitTime = process.env.AWAIT_TIME;
    const parameters = {
        stateMachineArn: stateMachineArn,
        input: JSON.stringify({
            waitTime: awaitTime,
            ...body
        })
    };
    console.log(JSON.stringify(parameters));
    return stepfunctions.startExecution(parameters).promise().then((execution) => {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(
              {
                stateMachine: stateMachineArn,
                input: parameters,
                state: execution
              }
            ),
          });
      }).catch(error => {
        callback(error.message);
      });
  };
  

module.exports.resolver = async (event) => {
    console.log(JSON.stringify(event));
    return {
        ...event,
        message: "FINISH EXECUTION"
    };
}