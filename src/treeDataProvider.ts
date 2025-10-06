// src/treeDataProvider.ts
import * as vscode from "vscode";

export interface StackItem {
  name: string;
  status: "CLEAN" | "DRIFTED" | "UNKNOWN";
  lastChecked?: Date;
}

class DriftTreeItem extends vscode.TreeItem {
  constructor(public readonly stack: StackItem) {
    super(stack.name, vscode.TreeItemCollapsibleState.None);
    this.tooltip = `Stack: ${stack.name}\nStatus: ${stack.status}`;
    this.description = stack.status;
    this.iconPath = new vscode.ThemeIcon(
      stack.status === "CLEAN"
        ? "check"
        : stack.status === "DRIFTED"
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

  private stacks: StackItem[] = [
    { name: "dev-app-stack", status: "UNKNOWN" },
    { name: "prod-network-stack", status: "UNKNOWN" },
    { name: "demo-stack", status: "UNKNOWN" },
  ];

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

  updateStackStatus(name: string, status: StackItem["status"]) {
    const stack = this.stacks.find((s) => s.name === name);
    if (stack) {
      stack.status = status;
      stack.lastChecked = new Date();
    }
    this.refresh();
  }
}
