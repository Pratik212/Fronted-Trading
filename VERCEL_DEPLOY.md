# Deploy frontend on Vercel

## 1. Have your backend URL ready

Your backend must be deployed somewhere (e.g. Render, Railway) and reachable at a URL like:

- `https://mk-trading-api.onrender.com`

You will give this URL to Vercel so the frontend can call your API.

---

## 2. Deploy on Vercel

### Option A: Deploy from the `frontend` folder (recommended)

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub/GitLab/Bitbucket or email).

2. Click **Add New…** → **Project**.

3. **Import** your repository (or upload the `frontend` folder):
   - If you use Git: connect the repo, then set **Root Directory** to `frontend` (see Option B).
   - If you use **Vercel CLI**: run the commands below from inside the `frontend` folder.

4. **Configure project:**
   - **Framework Preset:** Vite (Vercel usually detects it).
   - **Root Directory:** leave default if you selected the `frontend` folder; otherwise set to `frontend`.
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `dist` (default).

5. **Environment variable (important):**
   - Click **Environment Variables**.
   - Add:
     - **Name:** `VITE_API_URL`
     - **Value:** your backend URL, e.g. `https://mk-trading-api.onrender.com` (no trailing slash).
   - Apply to **Production**, **Preview**, and **Development** if you use them.

6. Click **Deploy**. Wait for the build to finish.

7. Open the provided URL (e.g. `https://your-project.vercel.app`). You should see the login page; use **Mukesh** / **0308**.

---

### Option B: Repo root is the whole project (backend + frontend)

1. In Vercel, when importing the repo, set **Root Directory** to **`frontend`**.
2. Build command: `npm run build`, Output: `dist`.
3. Add `VITE_API_URL` as above.
4. Deploy.

---

### Option C: Deploy with Vercel CLI

From your project root:

```bash
cd frontend
npm install -g vercel
vercel
```

Follow the prompts. When asked for env vars, add:

- `VITE_API_URL` = your backend URL (e.g. `https://mk-trading-api.onrender.com`)

Or add it later in the Vercel dashboard: Project → **Settings** → **Environment Variables**.

---

## 3. After deployment

- **Login:** Mukesh / 0308
- If you see network errors or “Login failed”, check that:
  1. Backend is deployed and the URL is correct.
  2. `VITE_API_URL` in Vercel matches that URL (no trailing slash).
  3. Backend allows requests from your Vercel domain (your backend must send proper CORS headers; the current backend uses `cors()` so all origins are allowed).

---

## 4. Updates

Push to your Git branch (e.g. `main`); Vercel will redeploy automatically. If you change the backend URL, update `VITE_API_URL` in Vercel and redeploy.
