import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export class ProjectDetector {
  /**
   * Auto-detect project from current working directory.
   * IDE clients like Cursor/Windsurf typically set the CWD to the project root.
   */
  static detectProject() {
    const cwd = process.cwd();
    
    // Try to get the project name from the Git repository root
    try {
      const gitDir = execSync('git rev-parse --show-toplevel', { 
        cwd,
        encoding: 'utf-8',
        stdio: 'pipe' // Suppress command output on stderr
      }).trim();
      const projectName = path.basename(gitDir);
      return {
        name: projectName,
        path: gitDir,
        type: 'git'
      };
    } catch (e) {
      // If not a git repository, fall back to using the current directory name
      return {
        name: path.basename(cwd),
        path: cwd,
        type: 'folder'
      };
    }
  }
}
