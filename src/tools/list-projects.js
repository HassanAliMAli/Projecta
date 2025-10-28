import { z } from 'zod';

export const listProjectsTool = {
  name: 'list_projects',
  description: 'Lists all projects that have stored memories.',
  inputSchema: {
    type: 'object',
    properties: {},
  },
  
  async handler(args, { sqliteStorage }) {
    const projects = sqliteStorage.listProjects();
    
    if (projects.length === 0) {
      return {
        content: [{ type: 'text', text: 'No projects with memories found.' }]
      };
    }
    
    const formatted = projects.map(p => `• ${p.project} (${p.count} memories)`).join('\n');
    
    return {
      content: [{ type: 'text', text: `Found memories for the following projects:\n\n${formatted}` }]
    };
  }
};
