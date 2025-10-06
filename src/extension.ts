// src/extension.ts
import * as vscode from "vscode";
import { DriftTreeDataProvider, StackItem } from "./treeDataProvider";

export function activate(context: vscode.ExtensionContext) {
  const driftProvider = new DriftTreeDataProvider();
  vscode.window.registerTreeDataProvider("driftAnalyzerView", driftProvider);

  const runDriftCheck = vscode.commands.registerCommand(
    "driftAnalyzer.runDriftCheck",
    async (stack: StackItem) => {
      vscode.window.showInformationMessage(
        `Running drift check for ${stack.name}...`,
      );

      // TODO: Replace this mock with actual AWS SDK / CLI call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const status: StackItem["status"] =
        Math.random() > 0.5 ? "CLEAN" : "DRIFTED";
      driftProvider.updateStackStatus(stack.name, status);

      vscode.window.showInformationMessage(
        `Drift check complete: ${stack.name} is ${status}`,
      );
    },
  );

  context.subscriptions.push(runDriftCheck);
}
export function deactivate() {}
