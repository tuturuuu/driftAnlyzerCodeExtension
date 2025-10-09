import {
  ListStackResourcesCommand,
  ListStacksCommand,
  ListStacksCommandOutput,
  StackStatus,
  StackSummary,
} from "@aws-sdk/client-cloudformation";
import { cloudformationClient } from "../clients/cloudFormationClient";
import { tryCatch } from "../utils/tryCatch";
import { statusFilter } from "../types/constants";

export async function listAllStacks() {
  const stacks: StackSummary[] = [];
  let nextToken: string | undefined = undefined;

  do {
    const promise: Promise<ListStacksCommandOutput> = cloudformationClient.send(
      new ListStacksCommand({
        NextToken: nextToken,
        StackStatusFilter: statusFilter as StackStatus[],
      })
    );

    const { data: response, error } = await tryCatch(promise);

    if (error) return error;

    stacks.push(...(response.StackSummaries ?? []));
    nextToken = response.NextToken;
  } while (nextToken);

  console.log("Stacks:");
  for (const s of stacks) {
    console.log(`- ${s.StackName} (${s.StackStatus})`);
  }

  return stacks;
}

export async function listStackResources(stackName: string) {
  const { data: res, error } = await tryCatch(
    cloudformationClient.send(
      new ListStackResourcesCommand({ StackName: stackName })
    )
  );
  if (error) return error;

  console.log(`Resources in ${stackName}:`);
  console.dir(res.StackResourceSummaries, { depth: null });
  return res;
}
