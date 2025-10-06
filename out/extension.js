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
exports.activate = activate;
exports.deactivate = deactivate;
// src/extension.ts
const vscode = __importStar(require("vscode"));
const treeDataProvider_1 = require("./treeDataProvider");
function activate(context) {
    const driftProvider = new treeDataProvider_1.DriftTreeDataProvider();
    vscode.window.registerTreeDataProvider("driftAnalyzerView", driftProvider);
    const runDriftCheck = vscode.commands.registerCommand("driftAnalyzer.runDriftCheck", async (stack) => {
        vscode.window.showInformationMessage(`Running drift check for ${stack.name}...`);
        // TODO: Replace this mock with actual AWS SDK / CLI call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const status = Math.random() > 0.5 ? "CLEAN" : "DRIFTED";
        driftProvider.updateStackStatus(stack.name, status);
        vscode.window.showInformationMessage(`Drift check complete: ${stack.name} is ${status}`);
    });
    context.subscriptions.push(runDriftCheck);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map