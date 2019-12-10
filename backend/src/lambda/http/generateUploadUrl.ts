import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import * as AWS from "aws-sdk";
import * as uuid from "uuid";
import "source-map-support/register";

const DBC = new AWS.DynamoDB.DocumentClient();
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  const imageId = uuid.v4();

  const s3 = new AWS.S3({
    signatureVersion: "v4"
  });

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

  const url = s3.getSignedUrl("putObject", {
    Bucket: process.env.S3_BUCKET,
    Key: imageId,
    Expires: process.env.SIGNED_URL_EXPIRATION
  });

  const imageUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${imageId}`;

  const updateUrlOnTodo = {
    TableName: process.env.TODOS_TABLE,
    Key: { todoId: todoId },
    UpdateExpression: "set attachmentUrl = :a",
    ExpressionAttributeValues: {
      ":a": imageUrl
    },
    ReturnValues: "UPDATED_NEW"
  };

  await DBC.update(updateUrlOnTodo).promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      iamgeUrl: imageUrl,
      uploadUrl: url
    })
  };
};
