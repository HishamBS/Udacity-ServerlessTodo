import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";

import { verify} from "jsonwebtoken";
import { createLogger } from "../../utils/logger";

import { JwtPayload } from "../../auth/JwtPayload";

const logger = createLogger("auth");

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJRMlJ2/UEnSliMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi13cGdhaDl5MS5hdXRoMC5jb20wHhcNMTkxMjEwMTIxOTMzWhcNMzMw
ODE4MTIxOTMzWjAhMR8wHQYDVQQDExZkZXYtd3BnYWg5eTEuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwJLukZdC8+aPNNWP8WX5aKIK
SOg/34hO5oUWk7/lAHXnJ3r5oAPlt/R1Wbd7YErFQz2DZVmFM23dR6qvPgHenwY/
jUnWBDbrfvfGxzYzQYrUCCgBHdnGPoFNC1zyZCYaYelk9aKlwVIRBEEaiaV11Ei+
GlKl1bgwYHKwZdnLQBn2LnyBlMC9ykY6vh/rwsN5hMIUFC/5cZHfMrquPOA/OzR9
3ZwV0nj8P7qHySo5yjATSdeFMw+GzihdMf3j7vpDTmUIKNrX2l8pQHc9aDz4X+n+
gJej3jfZxR0rPphIuyr8aDCannjhoaE2Vem/Zgi7+o+SlL602N/Gip6VssU2oQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQTu+Zuvb7/O9V5s0EN
+UIzsZ506zAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAAi5+gNU
yTV0v6NpVangUcRefZRF7q1Sem8ejRnItI9COYzja8AfpkL6pJXTUdijiAUIudVa
hfT5RL+vFbpxb2Sk3j3JQiFFLZCum/YcZEGNjev0ka0sVMvmcdNy8L/L54aSMZBI
pzvFCzBuSJI4wd060kQOMDsvW99o6ceexNqVjjBq8ZEt5orhDVZThtXOHTi6IMIX
rzyLScT4TPXXaKia7f6wNk79JuNN27fgADCNYeHgSDF9bhaBAc8qEGzsz4QWlCIV
kczDdBCK54i8iB2Okk82lyoxZz5vtYtSS1NcmfAgClOcCqnUbXqHIgxZ+Yh7UIvI
pL99IXQs7Ol6QkE=
-----END CERTIFICATE-----
`;
export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info("Authorizing a user", event.authorizationToken);
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info("User was authorized", jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*"
          }
        ]
      }
    };
  } catch (e) {
    logger.error("User not authorized", { error: e.message });

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*"
          }
        ]
      }
    };
  }
};

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt;

  // console.log(jwt);

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ["RS256"] }) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return token;
}
