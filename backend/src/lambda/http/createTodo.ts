import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import * as AWS from "aws-sdk";
import "source-map-support/register";
import * as uuid from "uuid";
import { parseUserId } from "../../auth/utils";

const DBC = new AWS.DynamoDB.DocumentClient();
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = uuid.v4();

  const parsedBody = JSON.parse(event.body);

  const token = event.headers.Authorization;
  const userId = parseUserId(token.split(" ")[1]);

  console.log("test", token);

  const item = {
    todoId: todoId,
    userId: userId,
    ...parsedBody
  };

  await DBC.put({
    TableName: process.env.TODOS_TABLE,
    Item: item
  }).promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      item
    })
  };
};
