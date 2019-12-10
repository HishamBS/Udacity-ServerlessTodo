import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import * as AWS from "aws-sdk";
import "source-map-support/register";

const DBC = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  await DBC.delete({
    TableName: process.env.TODOS_TABLE,
    Key: {
      todoId
    }
  }).promise();

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: "Item removed"
  };
};
