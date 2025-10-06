import { CloudFormationClient } from "@aws-sdk/client-cloudformation";

export const cloudformationClient = new CloudFormationClient({
  region: process.env.AWS_REGION || "us-east-1",
});
