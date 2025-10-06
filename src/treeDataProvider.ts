// src/treeDataProvider.ts
import { StackSummary } from "@aws-sdk/client-cloudformation";
import * as vscode from "vscode";
import { listAllStacks } from "./services/stackService";

class DriftTreeItem extends vscode.TreeItem {
  constructor(public readonly stack: StackSummary) {
    super(
      stack.StackName ?? "Unknown Stack",
      vscode.TreeItemCollapsibleState.None,
    );
    this.tooltip = `Stack: ${stack.StackName}\nStatus: ${stack.StackStatus}`;
    this.description = stack.StackStatus;
    this.iconPath = new vscode.ThemeIcon(
      stack.StackStatus === "UPDATE_COMPLETE"
        ? "check"
        : stack.StackStatus === "UPDATE_ROLLBACK_COMPLETE"
        ? "warning"
        : "circle-outline",
    );
    this.command = {
      command: "driftAnalyzer.runDriftCheck",
      title: "Run Drift Check",
      arguments: [stack],
    };
  }
}

export class DriftTreeDataProvider
  implements vscode.TreeDataProvider<DriftTreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    DriftTreeItem | undefined | void
  > = new vscode.EventEmitter<DriftTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<DriftTreeItem | undefined | void> =
    this._onDidChangeTreeData.event;

  private stacks: StackSummary[] = [];

  constructor() {
    this.loadStacks();
  }

  private async loadStacks() {
    this.stacks = await listAllStacks();
    this.refresh();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: DriftTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<DriftTreeItem[]> {
    return Promise.resolve(
      this.stacks.map((stack) => new DriftTreeItem(stack)),
    );
  }

  updateStackStatus(name: string, status: StackSummary["StackStatus"]) {
    const stack = this.stacks.find((s) => s.StackName === name);
    if (stack) {
      stack.StackStatus = status;
      // StackSummary does not have lastChecked, so we skip it
    }
    this.refresh();
  }
}
