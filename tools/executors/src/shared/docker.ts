import { spawn } from 'node:child_process';

export interface DockerRunOptions {
  workspaceRoot: string;
  cwd: string;
  command: string[];
  env?: Record<string, string>;
}

export async function runInDocker(options: DockerRunOptions): Promise<boolean> {
  if (process.env.VISUAL_NATIVE === '1') {
    return runNative(options);
  }

  const image = process.env.TYUI_PLAYWRIGHT_IMAGE ?? 'tyui-playwright:local';
  const args = [
    'run',
    '--rm',
    '--ipc=host',
    '-v',
    `${options.workspaceRoot}:/workspace`,
    '-w',
    `/workspace/${options.cwd}`,
  ];

  for (const [key, value] of Object.entries(options.env ?? {})) {
    args.push('-e', `${key}=${value}`);
  }

  if (process.platform === 'linux') args.push('--network=host');

  args.push(image, ...options.command);

  return new Promise((resolve) => {
    const child = spawn('docker', args, {
      cwd: options.workspaceRoot,
      stdio: 'inherit',
    });

    child.on('exit', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
}

function runNative(options: DockerRunOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(options.command[0]!, options.command.slice(1), {
      cwd: `${options.workspaceRoot}/${options.cwd}`,
      stdio: 'inherit',
      env: { ...process.env, ...options.env },
      shell: process.platform === 'win32',
    });

    child.on('exit', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
}
