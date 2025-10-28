export class SamplingHelper {
  constructor(server) {
    this.server = server;
  }

  /**
   * Uses the client's AI to generate relevant tags for a memory.
   */
  async generateTags(content) {
    try {
      const response = await this.server.request({
        method: 'sampling/createMessage',
        params: {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Categorize this developer note with 1-3 tags from this list: bug, api, auth, database, frontend, backend, todo, decision, performance, security, deployment, testing, style, refactor, docs.\n\nReturn ONLY the tags, comma-separated:\n\n"${content}"`
              }
            }
          ],
          systemPrompt: 'You are an expert at categorizing developer notes. You only return comma-separated tags.',
          maxTokens: 30,
          temperature: 0.2,
        }
      });

      const tags = response.content.text.trim().split(',').map(t => t.trim()).filter(Boolean);
      return tags.length > 0 ? tags : ['general'];
    } catch (error) {
      console.error('Sampling error (generateTags):', error);
      return ['general']; // Fallback
    }
  }

  /**
   * Uses the client's AI to extract semantic keywords for better search.
   */
  async extractKeywords(content) {
    try {
      const response = await this.server.request({
        method: 'sampling/createMessage',
        params: {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Extract 5-7 semantic keywords or phrases from this developer note. Focus on technologies, concepts, and intent. Return ONLY comma-separated keywords, no explanations:\n\n"${content}"`
              }
            }
          ],
          systemPrompt: 'You are an expert at extracting search keywords from text. You only return comma-separated keywords.',
          maxTokens: 50,
          temperature: 0.3,
        }
      });

      return response.content.text.trim();
    } catch (error) {
      console.error('Sampling error (extractKeywords):', error);
      // Simple fallback: extract words longer than 4 chars
      return content.toLowerCase().split(/\W+/).filter(w => w.length > 4).slice(0, 5).join(', ') || 'general';
    }
  }

  /**
   * Uses the client's AI to expand a user's search query with related terms.
   */
  async expandQuery(query) {
    try {
      const response = await this.server.request({
        method: 'sampling/createMessage',
        params: {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Expand this developer search query with 5-7 related technical synonyms or concepts. Include the original query. Return ONLY comma-separated terms:\n\n"${query}"`
              }
            }
          ],
          systemPrompt: 'You are an expert at expanding search queries. You only return comma-separated search terms.',
          maxTokens: 60,
          temperature: 0.4,
        }
      });

      const terms = response.content.text.trim().split(',').map(t => t.trim()).filter(Boolean);
      // Ensure the original query is part of the search
      if (!terms.includes(query)) {
        terms.unshift(query);
      }
      return terms.join(' OR ');
    } catch (error) {
      console.error('Sampling error (expandQuery):', error);
      return query; // Fallback to the original query
    }
  }
}
