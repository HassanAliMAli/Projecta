import { ProjectDetector } from '../utils/project-detector.js';

/**
 * Exposes recent project memories as an MCP Resource.
 * AI clients like Cursor/Windsurf can auto-load this resource when a project is opened.
 */
export async function registerProjectContextResource(server, storage) {
  // Announce the available resources to the client
  server.setRequestHandler('resources/list', async () => {
    return {
      resources: [
        {
          uri: 'memory://current-project',
          name: 'Current Project Context',
          description: 'The last 10 memories recorded for the currently active project.',
          mimeType: 'text/plain'
        },
      ]
    };
  });

  // Handle read requests for our announced resources
  server.setRequestHandler('resources/read', async (request) => {
    const uri = request.params.uri;

    if (uri === 'memory://current-project') {
      const project = ProjectDetector.detectProject();
      if (!project || !project.name) {
        return { contents: [] }; // No project detected
      }

      const memories = storage.getMemoriesByProject(project.name, 10);
      if (memories.length === 0) {
        return {
          contents: [{
            uri,
            mimeType: 'text/plain',
            text: `No memories found for project: ${project.name}`
          }]
        };
      }

      const formatted = memories.map(m => {
        const tags = JSON.parse(m.tags || '[]').join(', ');
        const date = new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `[${date}] [${tags}] (Importance: ${m.importance}/10)\n${m.content}`;
      }).join('\n\n---\n\n');

      return {
        contents: [{
          uri,
          mimeType: 'text/plain',
          text: `# Context for: ${project.name}\n\n${formatted}`
        }]
      };
    }

    // Return empty if the URI is not recognized
    return { contents: [] };
  });
}
