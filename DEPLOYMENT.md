# GitHub Pages Deployment Guide

This guide explains how to deploy the Shithub-Explorer application to GitHub Pages using the automated GitHub Actions workflow.

## Overview

The deployment process uses GitHub Actions to automatically build and deploy the application to GitHub Pages whenever changes are pushed to the main branch. The application is configured with:

- **Base URL**: `/shithub-explorer/` (configured in [`vite.config.ts`](vite.config.ts:9))
- **Build Output**: `dist/` directory
- **Jekyll Processing**: Disabled via [`.nojekyll`](public/.nojekyll) file

## First-Time Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy on the next push to main

### 2. Verify Repository Settings

Ensure your repository settings allow:
- Actions to run workflows
- Pages deployment from GitHub Actions

## Workflow Configuration

The deployment workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) includes:

### Triggers
- **Push to main branch**: Automatic deployment on code changes
- **Manual dispatch**: Deploy manually from GitHub Actions tab

### Build Process
1. **Checkout code**: Uses `actions/checkout@v4`
2. **Setup Node.js**: Version 18 with npm caching
3. **Install dependencies**: `npm ci` for clean, fast installs
4. **Build application**: `npm run build` (outputs to `dist/`)
5. **Upload artifacts**: Prepares build for Pages deployment

### Deployment
- Uses GitHub's official `actions/deploy-pages@v4`
- Deploys from the `dist/` directory
- Sets up custom domain support if configured

## Build Configuration

The application is optimized for GitHub Pages deployment:

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/shithub-explorer/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    assetsDir: 'assets',
    // ... additional optimizations
  }
}));
```

## Manual Deployment

To trigger a manual deployment:

1. Go to **Actions** tab in your repository
2. Select the **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**

## Local Testing

Test the production build locally:

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

The preview will run on `http://localhost:4173` with the correct base URL.

## Deployment URL

Once deployed, your application will be available at:
```
https://[username].github.io/shithub-explorer/
```

Replace `[username]` with your GitHub username or organization name.

## Troubleshooting

### Common Issues

**Build Fails**
- Check Node.js version compatibility (workflow uses Node 18)
- Verify all dependencies are listed in `package.json`
- Review build logs in the Actions tab

**Assets Not Loading**
- Ensure the base URL in `vite.config.ts` matches your repository name
- Verify the `.nojekyll` file exists in the `public/` directory

**Pages Not Updating**
- Check if Pages is enabled in repository settings
- Verify the workflow completed successfully in Actions tab
- GitHub Pages may take a few minutes to update

### Workflow Permissions

The workflow requires these permissions (already configured):
```yaml
permissions:
  contents: read    # Read repository contents
  pages: write      # Deploy to GitHub Pages
  id-token: write   # Authentication
```

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS settings with your domain provider
3. Enable custom domain in GitHub Pages settings

## Security

The deployment process:
- Uses minimal required permissions
- Runs in isolated environments
- Only deploys from the main branch
- Caches dependencies securely

## Monitoring

Monitor deployments via:
- **GitHub Actions tab**: View workflow runs and logs
- **Pages settings**: Check deployment status and URL
- **Repository insights**: Track deployment frequency

## Next Steps

After successful deployment:
1. ✅ Verify the application loads correctly
2. ✅ Test all features work with the base URL
3. ✅ Set up branch protection rules (recommended)
4. ✅ Configure custom domain if needed
5. ✅ Monitor deployment metrics

The deployment workflow is now ready to automatically deploy your Shithub-Explorer application to GitHub Pages on every push to the main branch.