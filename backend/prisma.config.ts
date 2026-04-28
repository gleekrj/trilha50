import { defineConfig } from 'prisma/config';
import path from 'node:path';
import dotenv from 'dotenv';

function loadDotEnv(): void {
  const nodeEnv = (process.env.NODE_ENV ?? 'development').toLowerCase();
  const envFileByNodeEnv: Record<string, string> = {
    development: '.env.development',
    dev: '.env.development',
    test: '.env.test',
    homol: '.env.homol',
    staging: '.env.homol',
    production: '.env.production',
    prod: '.env.production',
  };
  const selectedEnvFile = envFileByNodeEnv[nodeEnv] ?? `.env.${nodeEnv}`;
  const selectedEnvPath = path.resolve(process.cwd(), selectedEnvFile);
  const selectedResult = dotenv.config({ path: selectedEnvPath });
  if (!selectedResult.error) {
    return;
  }
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

loadDotEnv();

function getMigrationsDatasourceUrl(): string {
  const directUrl = process.env.DIRECT_URL;
  if (typeof directUrl === 'string' && directUrl.length > 0) {
    return directUrl;
  }
  const databaseUrl = process.env.DATABASE_URL;
  if (typeof databaseUrl === 'string' && databaseUrl.length > 0) {
    return databaseUrl;
  }
  throw new Error(
    'Missing DATABASE_URL (or DIRECT_URL) for Prisma migrations.',
  );
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: getMigrationsDatasourceUrl(),
  },
});
