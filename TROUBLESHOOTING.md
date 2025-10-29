# GitHub Pages Troubleshooting

## Steps to Verify Deployment

### 1. Check GitHub Actions Status
Go to: https://github.com/pjeon18/pauljeon/actions

- Look for "Deploy to GitHub Pages" workflow
- Click on the latest run
- Check if all steps completed successfully
- Look for any red X marks or error messages

### 2. Verify Pages Settings
Go to: https://github.com/pjeon18/pauljeon/settings/pages

**Required Settings:**
- Source: Must be set to "GitHub Actions" (NOT "Deploy from a branch")
- If you see an option for branch deployment, make sure you select "GitHub Actions" instead

### 3. Check Deployment Environment
1. Go to: https://github.com/pjeon18/pauljeon/settings/environments
2. Look for "github-pages" environment
3. If it doesn't exist, the workflow will create it on first run
4. Make sure there are no restrictions blocking it

### 4. Common Issues

#### Issue: "Workflow not running"
**Solution:** Manually trigger it:
- Go to Actions tab
- Click "Deploy to GitHub Pages"
- Click "Run workflow" button
- Select "main" branch and run

#### Issue: "Build failed in GitHub Actions"
**Solution:** 
- Check the Actions logs for specific errors
- Ensure all dependencies are in package.json
- Verify node_modules is not committed (should be in .gitignore)

#### Issue: "Site shows 404"
**Possible causes:**
1. GitHub Actions hasn't completed yet (wait 2-5 minutes)
2. Pages settings not configured correctly
3. Base path mismatch in Vite config

### 5. Verify Build Output
The workflow should produce:
- `dist/index.html` at the root
- `dist/404.html` (copy of index.html for SPA routing)
- Assets in `dist/assets/`

### 6. Expected URL
Your site should be available at:
**https://pjeon18.github.io/pauljeon/**

Note the `/pauljeon/` suffix - this is because it's a project site, not a user site.

### 7. Force Redeployment
If changes aren't appearing:

1. Make a small change and commit:
   ```bash
   git commit --allow-empty -m "trigger: redeploy"
   git push origin main
   ```

2. Or manually trigger the workflow in GitHub Actions

### 8. Check Browser Cache
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Try incognito/private mode
- Clear cache if needed

### 9. Verify Workflow File
The workflow is located at: `.github/workflows/deploy.yml`

Key points:
- Builds from `./Website Wireframe/`
- Output path: `./Website Wireframe/dist`
- Creates 404.html for SPA routing
- Uses GitHub Actions to deploy

---

**If still not working**, check:
1. GitHub Actions logs for specific error messages
2. Repository settings → Pages → confirm "Source" is "GitHub Actions"
3. Wait a few minutes after push (deployment can take 2-5 minutes)

