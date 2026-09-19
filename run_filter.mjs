import { spawnSync } from 'child_process';

console.log('Rewriting Git history for all commits...');

const envFilter = 'GIT_AUTHOR_NAME="Pranya Patel"; GIT_AUTHOR_EMAIL="patelpranya15@gmail.com"; GIT_COMMITTER_NAME="Pranya Patel"; GIT_COMMITTER_EMAIL="patelpranya15@gmail.com";';

const result = spawnSync(
  'git',
  ['filter-branch', '-f', '--env-filter', envFilter, '--tag-name-filter', 'cat', '--', '--all'],
  {
    env: { ...process.env, FILTER_BRANCH_SQUELCH_WARNING: '1' },
    stdio: 'inherit',
    shell: true,
  }
);

if (result.status === 0) {
  console.log('Git author history rewritten successfully!');
} else {
  console.error('Failed to rewrite Git history:', result.error || result.status);
}
