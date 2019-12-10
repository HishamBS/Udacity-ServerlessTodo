import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import * as AWS from "aws-sdk";
import "source-map-support/register";
import { parseUserId } from "../../auth/utils";

const DBC = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const token = event.headers.Authorization;
  const userId = parseUserId(token.split(" ")[1]);

  const result = await DBC.query({
    TableName: process.env.TODOS_TABLE,
    IndexName: process.env.USER_ID_INDEX,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    }
  }).promise();
  // const result = await DBC.scan({
  //   TableName: process.env.TODOS_TABLE
  //   // IndexName: process.env.USER_ID_INDEX,
  //   // KeyConditionExpression: "userId = :userId",
  //   // ExpressionAttributeValues: {
  //   //   ":userId": userId
  //   // },

  //   // ScanIndexForward: false
  // }).promise();
  console.log("userid:" + userId);
  console.log("table:" + process.env.TODOS_TABLE);
  console.log(process.env.USER_ID_INDEX);

  const items = result.Items;
  console.log("result" + items);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      items
    })
  };
};
