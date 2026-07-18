"use client";
import { useEffect, useRef } from "react";
import { initVimMode, VimMode } from "monaco-vim";
import { Editor as MonacoEditor, type OnMount } from "@monaco-editor/react";

interface EditorProps {
    code: string;
    language: string;
    onChangeCode: (code: string) => void;
    onSave: () => void;
    onCloseTab: () => void;
    onOpenFile: (path: string) => void;
    onQuitAll: () => void;
}

let exCommandsRegistered = false;

function Editor({
    code,
    language,
    onChangeCode,
    onSave,
    onCloseTab,
    onOpenFile,
    onQuitAll,
}: EditorProps) {
    const statusBarRef = useRef<HTMLDivElement>(null);
    const vimModeRef = useRef<{ dispose: () => void } | null>(null);
    const handlersRef = useRef({ onSave, onCloseTab, onOpenFile, onQuitAll });
    handlersRef.current = { onSave, onCloseTab, onOpenFile, onQuitAll };

    useEffect(() => {
        return () => vimModeRef.current?.dispose();
    }, []);

    const handleMount: OnMount = (editor, monaco) => {
        monaco.editor.defineTheme("mello-black", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "comment", foreground: "6b7280", fontStyle: "italic" },
                { token: "comment.doc", foreground: "71717a", fontStyle: "italic" },

                { token: "keyword", foreground: "a78bfa", fontStyle: "bold" },
                { token: "keyword.control", foreground: "c4b5fd", fontStyle: "bold" },
                { token: "keyword.operator", foreground: "d4d4d8" },

                { token: "string", foreground: "86efac" },
                { token: "string.escape", foreground: "5eead4" },
                { token: "string.invalid", foreground: "f87171" },

                { token: "number", foreground: "fb923c" },
                { token: "number.float", foreground: "fb923c" },
                { token: "number.hex", foreground: "fdba74" },
                { token: "number.octal", foreground: "fdba74" },
                { token: "number.binary", foreground: "fdba74" },

                { token: "type", foreground: "67e8f9" },
                { token: "type.identifier", foreground: "67e8f9" },
                { token: "class", foreground: "22d3ee", fontStyle: "bold" },
                { token: "class.identifier", foreground: "22d3ee", fontStyle: "bold" },
                { token: "entity.name.class", foreground: "22d3ee", fontStyle: "bold" },
                { token: "entity.name.type.class", foreground: "22d3ee", fontStyle: "bold" },
                { token: "struct", foreground: "22d3ee", fontStyle: "bold" },

                { token: "function", foreground: "facc15", fontStyle: "bold" },
                { token: "function.declaration", foreground: "facc15", fontStyle: "bold" },
                { token: "entity.name.function", foreground: "facc15", fontStyle: "bold" },
                { token: "support.function", foreground: "fde047" },
                { token: "meta.function-call", foreground: "fde047" },

                { token: "identifier", foreground: "e4e4e7" },
                { token: "variable", foreground: "e4e4e7" },
                { token: "variable.predefined", foreground: "f0abfc" },
                { token: "variable.parameter", foreground: "fca5a5" },
                { token: "operator", foreground: "d4d4d8" },
                { token: "delimiter", foreground: "a1a1aa" },
                { token: "delimiter.bracket", foreground: "a1a1aa" },
                { token: "delimiter.parenthesis", foreground: "a1a1aa" },
                { token: "tag", foreground: "a78bfa" },
                { token: "attribute.name", foreground: "5eead4" },
                { token: "annotation", foreground: "fbbf24" },
                { token: "regexp", foreground: "f472b6" },
                { token: "constant", foreground: "f0abfc" },

                { token: "keyword.directive", foreground: "f472b6", fontStyle: "bold" },
                { token: "keyword.preprocessor", foreground: "f472b6", fontStyle: "bold" },
                { token: "meta.preprocessor", foreground: "f472b6" },

                { token: "identifier.macro", foreground: "fb7185", fontStyle: "bold" },
                { token: "macro", foreground: "fb7185", fontStyle: "bold" },

                { token: "string.include", foreground: "bef264" },
                { token: "string.include.identifier", foreground: "bef264" },

                { token: "storage", foreground: "c4b5fd", fontStyle: "italic" },
                { token: "storage.type", foreground: "67e8f9" },
                { token: "storage.modifier", foreground: "c4b5fd", fontStyle: "italic" },

                { token: "operator.pointer", foreground: "fb923c", fontStyle: "bold" },
                { token: "punctuation.pointer", foreground: "fb923c", fontStyle: "bold" },

                { token: "namespace", foreground: "5eead4" },
                { token: "entity.name.namespace", foreground: "5eead4" },

                { token: "type.parameter", foreground: "a5f3fc", fontStyle: "italic" },

                { token: "keyword.instruction", foreground: "a78bfa", fontStyle: "bold" },
                { token: "instruction", foreground: "a78bfa", fontStyle: "bold" },

                { token: "variable.register", foreground: "f0abfc", fontStyle: "bold" },
                { token: "register", foreground: "f0abfc", fontStyle: "bold" },

                { token: "keyword.directive.asm", foreground: "f472b6", fontStyle: "bold" },
                { token: "meta.directive.asm", foreground: "f472b6", fontStyle: "bold" },

                { token: "entity.name.label", foreground: "fde047", fontStyle: "bold" },
                { token: "tag.label", foreground: "fde047", fontStyle: "bold" },

                { token: "constant.numeric", foreground: "fdba74" },
                { token: "constant.character", foreground: "86efac" },
            ],
            colors: {
                "editor.background": "#000000",
                "editor.foreground": "#e4e4e7",
                "editor.lineHighlightBackground": "#0d0d10",
                "editor.lineHighlightBorder": "#18181b",
                "editorGutter.background": "#000000",
                "editorLineNumber.foreground": "#3a3a3f",
                "editorLineNumber.activeForeground": "#a78bfa",
                "editorCursor.foreground": "#a78bfa",
                "editor.selectionBackground": "#7c3aed40",
                "editor.selectionHighlightBackground": "#7c3aed26",
                "editor.inactiveSelectionBackground": "#7c3aed20",
                "editor.wordHighlightBackground": "#3b3b4020",
                "editor.wordHighlightStrongBackground": "#7c3aed30",
                "editor.findMatchBackground": "#a78bfa55",
                "editor.findMatchHighlightBackground": "#a78bfa2a",
                "editorIndentGuide.background": "#18181b",
                "editorIndentGuide.activeBackground": "#3f3f46",
                "editorWhitespace.foreground": "#27272a",
                "editorBracketMatch.background": "#7c3aed30",
                "editorBracketMatch.border": "#a78bfa",
                "scrollbarSlider.background": "#27272a80",
                "scrollbarSlider.hoverBackground": "#3f3f46a0",
                "scrollbarSlider.activeBackground": "#7c3aeda0",
                "editorOverviewRuler.border": "#000000",
                "editorSuggestWidget.background": "#0a0a0a",
                "editorSuggestWidget.border": "#27272a",
                "editorSuggestWidget.selectedBackground": "#7c3aed30",
                "editorHoverWidget.background": "#0a0a0a",
                "editorHoverWidget.border": "#27272a",
                "editorWidget.background": "#0a0a0a",
                "editorWidget.border": "#27272a",
            },
        });
        monaco.editor.setTheme("mello-black");

        if (!exCommandsRegistered) {
            exCommandsRegistered = true;
            const Vim = (VimMode as unknown as { Vim: any }).Vim;

            Vim.defineEx("write", "w", () => handlersRef.current.onSave());
            Vim.defineEx("quit", "q", () => handlersRef.current.onCloseTab());
            Vim.defineEx("wq", "wq", () => {
                handlersRef.current.onSave();
                handlersRef.current.onCloseTab();
            });
            Vim.defineEx("qall", "qa", () => handlersRef.current.onQuitAll());
            Vim.defineEx("edit", "e", (_cm: unknown, params: { args?: string[] }) => {
                const path = params.args?.[0];
                if (path) handlersRef.current.onOpenFile(path);
            });
        }

        if (statusBarRef.current) {
            vimModeRef.current = initVimMode(editor, statusBarRef.current);
        }
    };

    return (
        <div className="h-full w-full bg-black overflow-hidden flex flex-col">
            <div className="flex-1 min-h-0">
                <MonacoEditor
                    theme="mello-black"
                    height="100%"
                    language={language}
                    value={code}
                    onChange={(value) => onChangeCode(value || "")}
                    onMount={handleMount}
                    options={{
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        minimap: { enabled: false },
                        cursorBlinking: "blink",
                        cursorStyle: "block",
                        smoothScrolling: true,
                        scrollBeyondLastLine: false,
                        renderLineHighlight: "all",
                        automaticLayout: true,
                        padding: { top: 12 },
                    }}
                />
            </div>
            <div
                ref={statusBarRef}
                className="h-6 bg-black text-violet-400 text-xs px-2 flex items-center border-t border-zinc-800 font-mono"
            />
        </div>
    );
}

export default Editor;