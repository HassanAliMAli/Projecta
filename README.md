# Projecta

A focused, essential memory MCP server using local storage and client-side AI via MCP Sampling.

## Features

*   `store_memory`: Remembers a piece of information. Automatically detects the project and uses the client's AI to generate tags and keywords.
*   `search_memory`: Searches stored memories. Uses the client's AI to expand your query for better results.
*   `list_projects`: Lists all projects that have stored memories.
*   **Automatic Context Resource (`memory://current-project`):** Automatically loads the last 5-10 memories into the AI's context when you open a project.

## Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Configure the database path:**
    Open `config.json` and replace `"REPLACE_WITH_YOUR_HOME_DIRECTORY/.memory-mcp/memories.db"` with an absolute path to where you want to store the `memories.db` file.

3.  **Run the server:**
    ```bash
    node src/index.js
    ```

4.  **Connect your AI Assistant:**
    Configure your client (Cursor, Windsurf, etc.) to connect to the server. For example, in Cursor, you might add a `.cursor/mcp.json` file to your project:
    ```json
    {
      "mcpServers": {
        "memory": {
          "command": "node",
          "args": ["/absolute/path/to/memory-mcp-mvp/src/index.js"]
        }
      }
    }
    ```

## Usage

- **Store a memory:** "Remember that we decided to use PostgreSQL for the database."
- **Search:** "What did we decide for the database?"
- **List:** "What projects do I have memories for?"
