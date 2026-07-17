# Meovv

A minimal, Vim-native code editor built with Tauri, React, and Monaco.

![License](https://img.shields.io/badge/license-MIT-violet)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-black)
![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri-24C8DB)
![Editor](https://img.shields.io/badge/editor-Monaco-blue)

## About

Meovv is a lightweight desktop code editor for people who live in Vim. It pairs the Monaco editor (the engine behind VS Code) with real Vim keybindings, a frameless custom titlebar, a file explorer, and multi-tab editing — all wrapped in a fast, native Tauri shell.

## Features

- **Real Vim keybindings** — powered by `monaco-vim`, including ex commands (`:w`, `:q`, `:wq`, `:qa`, `:e <path>`)
- **File explorer** — browse and open files from any folder
- **Tabs** — work across multiple open files with unsaved-change indicators
- **Custom titlebar** — frameless native window with minimize / maximize / close
- **Dark theme** — pure black editor theme built for long sessions
- **Fast & lightweight** — native performance via Tauri, no Electron overhead

## Screenshots

<p align="center">
  <img src="./assets/Screenshot 2026-07-17 174707.jpg" width="800" alt="Meovv Code Editor"/>
</p>

<p align="center">
  <img src="./assets/Screenshot 2026-07-17 174803.jpg" width="800" alt="Meovv Code Editor"/>
</p>

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your OS

### Setup

```bash
git clone https://github.com/Meovv-Code-Editor/meovv.git
cd meovv
npm install
```

### Run in development

```bash
npm run tauri dev
```

### Build for production

```bash
npm run tauri build
```

The compiled binary will be available under `src-tauri/target/release/`.

## Vim Commands

| Command | Action |
|---|---|
| `:w` | Save current file |
| `:q` | Close current tab |
| `:wq` | Save and close |
| `:qa` | Close all tabs |
| `:e <path>` | Open a file by path |

Standard Vim modal editing (Normal / Insert / Visual) works as expected, with the current mode shown in the status bar.

## Tech Stack

- **Tauri** — native app shell
- **React + TypeScript** — UI layer
- **Monaco Editor** — code editing engine
- **monaco-vim** — Vim keybindings
- **Tailwind CSS** — styling

## Roadmap

- [ ] Split windows (`:vs` / `:sp`)
- [ ] Unsaved-changes confirmation on close
- [ ] Fuzzy file finder (`Ctrl+P`)
- [ ] Command palette
- [ ] Theming support beyond the default black theme

## Contributing

Issues and pull requests are welcome. If you run into a bug or have a feature request, please open an issue first to discuss what you'd like to change.

## License

GPL v3