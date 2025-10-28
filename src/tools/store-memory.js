import { z } from 'zod';
import { ProjectDetector } from '../utils/project-detector.js';

export const storeMemoryTool = {
  name: 'store_memory',
  description: 'Remembers a piece of information (a memory). Automatically detects the project and uses AI to generate tags and keywords.',
  inputSchema: {
    type: 'object',
    properties: {
      content: { type: 'string', description: 'The information or note to remember.' },
      importance: { type: 'number', minimum: 1, maximum: 10, default: 5, description: 'How important is this memory? (1-10)' },
    },
    required: ['content']
  },
  
  async handler(args, { sqliteStorage, samplingHelper }) {
    const { content, importance } = args;
    
    // 1. Auto-detect the project from the current working directory
    const projectInfo = ProjectDetector.detectProject();
    const project = projectInfo.name;

    // 2. Use the client's AI to generate relevant tags and keywords
    const tags = await samplingHelper.generateTags(content);
    const semanticKeywords = await samplingHelper.extractKeywords(content);
    
    // 3. Insert the complete memory into the database
    const id = sqliteStorage.insertMemory({
      content,
      tags,
      semanticKeywords,
      importance,
      project,
    });
    
    // 4. Return a confirmation message
    const tagStr = tags.join(', ');
    const stars = '★'.repeat(Math.min(importance, 5));
    
    return {
      content: [{
        type: 'text',
        text: `✓ Stored [${tagStr}${stars}] memory #${id} for project: ${project}`
      }]
    };
  }
};
