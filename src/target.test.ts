import { describe, it, expect } from 'vitest';
import { GitHubActionsTarget } from './target.js';

const target = new GitHubActionsTarget();

// Access private methods for unit testing
const renderJob = (target as any).renderJob.bind(target);
const translateCondition = (target as any).translateCondition.bind(target);

function makeJob(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test',
    name: 'test',
    needs: [] as string[],
    steps: [],
    secrets: [] as string[],
    ...overrides,
  };
}

const minimalAst = { functionName: 'myWorkflow', options: { cicd: {} } } as any;

describe('Bug 4: retry warning in GitHub Actions', () => {
  it('emits warning for retry (no native support)', () => {
    (target as any)._warnings = [];
    const job = makeJob({ retry: 2, retryWhen: ['runner_system_failure'] });
    renderJob(job, minimalAst);

    expect((target as any)._warnings).toContainEqual(
      expect.stringContaining('no native job-level retry'),
    );
  });
});

describe('Bug 5: @rule conditions in GitHub Actions', () => {
  it('translateCondition converts GitLab CI variables to GitHub equivalents', () => {
    expect(translateCondition('$CI_COMMIT_BRANCH == "main"'))
      .toBe('github.ref_name == "main"');
    expect(translateCondition('$CI_COMMIT_TAG'))
      .toBe("startsWith(github.ref, 'refs/tags/')");
    expect(translateCondition('$CI_PIPELINE_SOURCE == "push"'))
      .toBe('github.event_name == "push"');
  });
});
