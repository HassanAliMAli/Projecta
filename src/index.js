#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';

import { SQLiteStorage } from './storage/sqlite.js';
import { SamplingHelper } from './utils/sampling.js';
import { logger } from './utils/logger.js';

import { storeMemoryTool } from './tools/store-memory.js';
import { searchMemoryTool } from './tools/search-memory.js';
import { listProjectsTool } from './tools/list-projects.js';

import { registerProjectContextResource } from './resources/project-context.js';

// --- CONFIGURATION ---
// Read the database path from the command-line arguments.
const dbPath = process.argv[2];
if (!dbPath) {
  logger.error('DATABASE_PATH_ERROR: The path to the database file must be provided as a command-line argument.');
  process.exit(1); // Exit if no path is provided.
}

// --- INITIALIZATION ---
// Create the MCP server instance, enabling tools, resources, and sampling
const server = new Server(
  {
    name: 'projecta',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      sampling: {}
    },
  }
);

// Initialize the database and AI sampling helper
const sqliteStorage = new SQLiteStorage(dbPath);
const samplingHelper = new SamplingHelper(server);

// --- RESOURCE REGISTRATION ---
// Register the resource that provides automatic context to the client
registerProjectContextResource(server, sqliteStorage);

// --- TOOL REGISTRATION ---
// Define the list of tools available to the AI client
const tools = [
  storeMemoryTool,
  searchMemoryTool,
  listProjectsTool
];

// Handle the client's request to list available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map(t => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema
  }))
}));

// Handle the client's request to call a specific tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find(t => t.name === request.params.name);
  if (!tool) {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }
  
  logger.info(`Calling tool: ${request.params.name}`, request.params.arguments);
  // Pass the storage and sampling helpers to the tool handler
  return await tool.handler(request.params.arguments, { sqliteStorage, samplingHelper });
});

// --- SERVER START ---
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info('Memory MCP MVP Server running. Ready to connect to an AI assistant.');
}

main().catch((error) => {
  logger.error('Server failed to start:', error);
  process.exit(1);
});
