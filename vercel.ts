import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  installCommand: "pnpm install --frozen-lockfile",
  buildCommand: "pnpm build",
  // Deployments are driven by GitHub Actions (.github/workflows), so migrations always run first.
  git: { deploymentEnabled: false },
};
