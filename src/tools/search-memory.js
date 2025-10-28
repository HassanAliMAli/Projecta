import { z } from 'zod';
import { ProjectDetector } from '../utils/project-detector.js';

export const searchMemoryTool = {
  name: 'search_memory',
  description: 'Searches memories. Uses AI to expand your query for better results.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'What you want to search for.' },
      project: { type: 'string', description: 'Optional: Search in a specific project. Defaults to the current project.' }
    },
    required: ['query']
  },
  
  async handler(args, { sqliteStorage, samplingHelper }) {
    let { query, project } = args;

    // 1. If no project is specified, default to the current one.
    if (!project) {
      const projectInfo = ProjectDetector.detectProject();
      project = projectInfo.name;
    }

    // 2. Use the client's AI to expand the search query
    const expandedQuery = await samplingHelper.expandQuery(query);

    // 3. Search the database using the expanded query
    const results = sqliteStorage.searchMemories({
      query: expandedQuery, 
      project: project, 
      limit: 5 // Limit to 5 results as per MVP spec
    });
    
    if (results.length === 0) {
      return {
        content: [{ type: 'text', text: `No memories found for "${query}" in project ${project}` }]
      };
    }
    
    // 4. Format and return the results
    const formatted = results.map((m, idx) => {
      const tags = JSON.parse(m.tags || '[]').join(', ');
      const stars = '★'.repeat(Math.min(m.importance, 5));
      const date = new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${idx + 1}. [${tags}${stars}] ${m.content} (${date})`;
    }).join('\n');
    
    return {
      content: [{ type: 'text', text: `Found memories in ${project} for "${query}":\n\n${formatted}` }]
    };
  }
};
