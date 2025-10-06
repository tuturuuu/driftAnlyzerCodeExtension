import {
  ListStacksCommand,
  ListStacksOutput,
  StackSummary,
} from "@aws-sdk/client-cloudformation";
import { cloudformationClient } from "../clients/cloudFormationClient";

export async function listAllStacks() {
  const stacks: StackSummary[] = [];
  let nextToken: string | undefined = undefined;

  do {
    const response: ListStacksOutput = await cloudformationClient.send(
      new ListStacksCommand({
        NextToken: nextToken,
        StackStatusFilter: [
          "CREATE_COMPLETE",
          "UPDATE_COMPLETE",
          "DELETE_COMPLETE",
        ],
      }),
    );
    stacks.push(...(response.StackSummaries ?? []));
    nextToken = response.NextToken;
  } while (nextToken);

  console.log("Stacks:");
  for (const s of stacks) {
    console.log(`- ${s.StackName} (${s.StackStatus})`);
  }

  return stacks;
}
