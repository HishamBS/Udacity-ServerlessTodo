import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import * as AWS from "aws-sdk";
import "source-map-support/register";
//import { parseUserId } from '../../auth/utils'
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";

const DBC = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const updatedTodoJson: UpdateTodoRequest = JSON.parse(event.body);

  const updateTodoParams = {
    TableName: process.env.TODOS_TABLE,
    Key: { todoId: todoId },
    UpdateExpression: "set #n = :a, dueDate = :b, done = :c",
    ExpressionAttributeValues: {
      ":a": updatedTodoJson["name"],
      ":b": updatedTodoJson.dueDate,
      ":c": updatedTodoJson.done
    },
    ExpressionAttributeNames: {
      "#n": "name"
    },
    ReturnValues: "UPDATED_NEW"
  };

  const updatedTodo = await DBC.update(updateTodoParams).promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      updatedTodo
    })
  };
};
