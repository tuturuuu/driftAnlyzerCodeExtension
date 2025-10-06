"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriftTreeDataProvider = void 0;
// src/treeDataProvider.ts
const vscode = __importStar(require("vscode"));
class DriftTreeItem extends vscode.TreeItem {
    stack;
    constructor(stack) {
        super(stack.name, vscode.TreeItemCollapsibleState.None);
        this.stack = stack;
        this.tooltip = `Stack: ${stack.name}\nStatus: ${stack.status}`;
        this.description = stack.status;
        this.iconPath = new vscode.ThemeIcon(stack.status === "CLEAN"
            ? "check"
            : stack.status === "DRIFTED"
                ? "warning"
                : "circle-outline");
        this.command = {
            command: "driftAnalyzer.runDriftCheck",
            title: "Run Drift Check",
            arguments: [stack],
        };
    }
}
class DriftTreeDataProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    stacks = [
        { name: "dev-app-stack", status: "UNKNOWN" },
        { name: "prod-network-stack", status: "UNKNOWN" },
        { name: "demo-stack", status: "UNKNOWN" },
    ];
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        return Promise.resolve(this.stacks.map((stack) => new DriftTreeItem(stack)));
    }
    updateStackStatus(name, status) {
        const stack = this.stacks.find((s) => s.name === name);
        if (stack) {
            stack.status = status;
            stack.lastChecked = new Date();
        }
        this.refresh();
    }
}
exports.DriftTreeDataProvider = DriftTreeDataProvider;
//# sourceMappingURL=treeDataProvider.js.map