const { existsSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const prismaCommand = process.execPath;
const prismaCli = path.join(__dirname, '..', 'node_modules', 'prisma', 'build', 'index.js');
const prismaArgs = [prismaCli, 'generate', '--schema=prisma/schema.prisma'];
const maxAttempts = 3;

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  const result = spawnSync(prismaCommand, prismaArgs, {
    cwd: __dirname + '/..',
    encoding: 'utf8',
    shell: false,
  });

  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');

  if (result.status === 0) {
    process.exit(0);
  }

  const output = `${result.stdout || ''}\n${result.stderr || ''}`;
  const isWindowsEngineLock = process.platform === 'win32' && (
    result.error?.code === 'EPERM' || /EPERM|query_engine-windows\.dll\.node|access is denied/i.test(output)
  );
  const generatedClient = path.join(__dirname, '..', 'node_modules', '.prisma', 'client', 'index.js');

  if (!isWindowsEngineLock || attempt === maxAttempts) {
    if (isWindowsEngineLock && existsSync(generatedClient)) {
      console.warn('Prisma Client is locked by another Windows process; using the existing generated client.');
      process.exit(0);
    }
    process.exit(result.status || 1);
  }

  console.warn(`Prisma Client generation failed on Windows; retrying (${attempt}/${maxAttempts - 1})...`);
}
