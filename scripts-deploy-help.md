# One-shot deploy help for DongRui

Repo is already committed locally at `/workspace/devtoolpick` on branch `main`.

## Fastest path

1. Open https://github.com/new → create **public** repo `devtoolpick` (owner ideally `rtj0352-maker`). No README.
2. Authenticate and push:

```bash
export PATH="/home/box/.local/node-v22.20.0-linux-x64/bin:$PATH"
cd /workspace/devtoolpick
gh auth login
git remote add origin https://github.com/rtj0352-maker/devtoolpick.git
git push -u origin main
```

3. Repo Settings → Pages → Source: **GitHub Actions**
4. Wait for the deploy workflow.
5. Live: https://rtj0352-maker.github.io/devtoolpick/
