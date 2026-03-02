# @synergenius/flowweaver-pack-github-actions

GitHub Actions CI/CD export target for [Flow Weaver](https://github.com/synergenius-fw/flow-weaver).

Generates native `.github/workflows/<name>.yml` files from Flow Weaver CI/CD workflows. No runtime dependency — outputs pure GitHub Actions YAML.

## Installation

```bash
npm install @synergenius/flowweaver-pack-github-actions
```

This package is a **marketplace pack** — once installed, Flow Weaver automatically discovers it via `createTargetRegistry()`.

## Usage

### CLI

```bash
# Export a CI/CD workflow as GitHub Actions YAML
npx flow-weaver export my-pipeline.ts --target github-actions
```

### Programmatic

```typescript
import { createTargetRegistry } from '@synergenius/flow-weaver/deployment';

const registry = await createTargetRegistry(process.cwd());
const gha = registry.get('github-actions');

const artifacts = await gha.generate({
  sourceFile: 'my-pipeline.ts',
  workflowName: 'myPipeline',
  displayName: 'my-pipeline',
  outputDir: './dist/github-actions',
});
```

## What it generates

- `.github/workflows/<name>.yml` — Native GitHub Actions workflow
- `SECRETS_SETUP.md` — Documentation for required secrets

### Mapping

| Flow Weaver | GitHub Actions |
|-------------|---------------|
| `[job: "name"]` annotation | Job in `jobs:` |
| `@path` dependencies | `needs:` |
| `@secret NAME` | `${{ secrets.NAME }}` |
| `@cache` | `actions/cache@v4` |
| `@artifact` | `actions/upload-artifact@v4` / `actions/download-artifact@v4` |
| `@trigger push` | `on: push` |

## Requirements

- `@synergenius/flow-weaver` >= 0.14.0

## License

See [LICENSE](./LICENSE).
