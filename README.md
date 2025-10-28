# Projecta: Your Local AI Memory Server

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-stable-green)

**Projecta** is a local, private, and intelligent memory server for your AI assistant. It acts as a persistent "second brain," allowing your AI to remember project context, decisions, and key information across multiple sessions, all without relying on any external APIs or services.

---

## The Core Problem

As a developer, your biggest challenge isn't writing code—it's managing context. When you return to a project, you constantly ask:

*   "What was I working on last week?"
*   "Why did we choose this library over that one?"
*   "I've solved this exact bug before... how did I do it?"

Projecta is designed to answer these questions instantly by giving your AI assistant a reliable, long-term memory.

## How It Works: The Magic of MCP Sampling

Projecta's key innovation is its **zero-dependency architecture**. Instead of using external APIs for its intelligence, it uses a feature of the Model Context Protocol (MCP) called **Sampling**.

When a "smart" action is needed (like generating tags or understanding a search query), Projecta simply asks your AI assistant (e.g., the model in Cursor or Windsurf) to perform the task. This means:

*   ✅ **No API keys** are needed.
*   ✅ **No internet connection** is required to use the AI features.
*   ✅ **100% Private:** All your data and AI interactions stay on your local machine.
*   ✅ It automatically uses whatever powerful model your client is configured with.

## Key Features (Version 1.0 - MVP)

*   **🧠 Smart Storage (`store_memory`)**
    *   Remembers notes, decisions, or any piece of information.
    *   **Automatically detects** the project you're working on.
    *   Uses the client's AI to **automatically generate relevant tags and keywords** for powerful searching later.

*   **🔍 Smart Search (`search_memory`)**
    *   Searches your entire memory database.
    *   Uses the client's AI to perform **query expansion**. Searching for "auth" might also find memories about "JWT," "login," or "OAuth."

*   **📂 Project Listing (`list_projects`)**
    *   Provides a quick overview of all the projects you have stored memories for.

*   **✨ Proactive Context Loading (`memory://current-project`)**
    *   This is an MCP **Resource** that automatically loads the last 10 memories for your current project into the AI's context the moment you open it.
    *   Your AI assistant has immediate context without you ever having to ask!

## Getting Started



Projecta is published on NPM and is designed for a zero-setup experience.



### One-Time Global Setup



1.  **Open Your IDE's Global Settings**

    In VS Code or Cursor, press `Ctrl+Shift+P` and search for "Open User Settings (JSON)".



2.  **Add the MCP Server Configuration**

    Add the following JSON snippet. This tells your IDE to automatically download and run Projecta whenever it's needed.



    ```json

    "copilot.mcp.servers": {

      "memory": {

        "command": "npx",

        "args": [

          "-y",

          "@realhassan/projecta"

        ]

      }

    }

    ```



3.  **Restart Your IDE**

    Save the settings file and restart your IDE.



**That's it!** Projecta is now installed and will run automatically in any project you open.

## Usage Examples

*   **Storing a memory:**
    > "Remember: We chose PostgreSQL over MongoDB because we need ACID compliance for transactions."

*   **Searching for a memory:**
    > "What did we decide for the database?"

*   **Listing your projects:**
    > "What projects do I have memories for?"

*   **Using automatic context:**
    Simply open a project you've worked on before. Then ask a question.
    > "What was I working on here last?"
    *(The AI will use the context from the `memory://current-project` resource to answer.)*

---

## 🚀 Future Roadmap

Projecta is built on a solid foundation that can be extended with even more powerful features. Here are some of the planned enhancements:

*   **🧠 Knowledge Graph & Memory Linking**
    *   The AI will be able to find and create relationships between memories. A "bug fix" memory could be automatically linked to the "technical decision" memory that caused the bug, creating a traceable history of your project.

*   **🗓️ Automated Session Journals**
    *   An end-of-day `save_session` tool that detects which files you've changed and asks the AI to write a summary of your work. The next morning, `restore_session` will get you back up to speed in seconds.

*   **🔗 Deeper IDE & Git Integration**
    *   **File-Specific Memories:** Link memories directly to a file or function, so context becomes available automatically when you open that file.
    *   **Git-Awareness:** Store memories against specific Git branches or automatically create summaries from your commit messages.

*   **💻 Specialized Memory Types**
    *   **Code Snippet Library:** A dedicated tool to save, explain, and retrieve useful code patterns.
    *   **Personal Error Database:** Remember an error message and its solution, creating a personal, searchable troubleshooting guide.

## Our Philosophy

*   **Local-First & Private:** Your data never leaves your machine.
*   **Zero-Dependency:** No reliance on external APIs, services, or keys.
*   **Intelligent & Proactive:** Uses your own AI to automate tasks and provide context before you ask.
*   **Effortless:** Designed for a "zero mental overhead" experience.

## Contributing

This is an open-source project, and feedback and contributions are welcome. Please feel free to open an issue or submit a pull request on GitHub.