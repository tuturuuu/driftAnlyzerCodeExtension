// src/extension.ts
import * as vscode from "vscode";
import { DriftTreeDataProvider } from "./treeDataProvider";
import { StackSummary } from "@aws-sdk/client-cloudformation";

export function activate(context: vscode.ExtensionContext) {
  const driftProvider = new DriftTreeDataProvider();
  vscode.window.registerTreeDataProvider("driftAnalyzerView", driftProvider);

  const runDriftCheck = vscode.commands.registerCommand(
    "driftAnalyzer.runDriftCheck",
    async (stack: StackSummary) => {
      vscode.window.showInformationMessage(
        `Running drift check for ${stack.StackName}...`,
      );

      // TODO: Replace this mock with actual AWS SDK / CLI call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // const status: StackSummary["status"] =
      //   Math.random() > 0.5 ? "CLEAN" : "DRIFTED";
      // driftProvider.updateStackStatus(stack.StackName, status);

      vscode.window.showInformationMessage(
        `Drift check complete: ${stack.StackName} is `,
      );
    },
  );

  context.subscriptions.push(runDriftCheck);
}
export function deactivate() {}
