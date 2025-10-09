// src/extension.ts
import * as vscode from "vscode";
import { DriftTreeDataProvider, StackItem } from "./treeDataProvider";
import { StackSummary } from "@aws-sdk/client-cloudformation";
import { linkBuilders } from "./types/constants";

export function activate(context: vscode.ExtensionContext) {
  const driftProvider = new DriftTreeDataProvider();

  vscode.window.registerTreeDataProvider("driftAnalyzer", driftProvider);
  vscode.commands.registerCommand("driftAnalyzer.refreshStack", () =>
    driftProvider.refresh()
  );
  vscode.commands.registerCommand(
    "resource.openResourceOnAws",
    (resourceType, physicalId) => {
      const builder = linkBuilders[resourceType as keyof typeof linkBuilders];
      console.log(builder ? builder(physicalId) : physicalId);

      if (!builder)
        vscode.window.showInformationMessage(`Error building link for...`);

      const uri = vscode.Uri.parse(
        builder ? builder(physicalId) : "https://console.aws.amazon.com/"
      );
      vscode.env.openExternal(uri);
    }
  );

  const runDriftCheck = vscode.commands.registerCommand(
    "driftAnalyzer.runDriftCheck",
    async (item: StackItem) => {
      const { StackName, StackId } = item.stack;

      vscode.window.showInformationMessage(
        `Running drift check for ${StackName}`
      );

      // TODO: Replace this mock with actual AWS SDK / CLI call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      vscode.window.showInformationMessage(
        `Drift check complete: ${StackName} is `
      );
    }
  );

  context.subscriptions.push(runDriftCheck);
}
export function deactivate() {}
