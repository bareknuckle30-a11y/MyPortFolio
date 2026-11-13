# Instagram Audit — extra files only

Copy these folders into the root of your existing Webhead project, keeping the same paths. These are additive files; they do not overwrite your existing project files.

## Required one-time integration edits

The new files are not active until you connect them to the existing app:

1. **Frontend route:** in `client/src/App.jsx`, add the lazy import:
   ```jsx
   const InstagramAudit = lazy(() => import('./pages/InstagramAudit.jsx'));
   ```
   Then add this route inside the existing `<Route element={<Layout />}>`:
   ```jsx
   <Route path="instagram-audit" element={<InstagramAudit />} />
   ```

2. **Backend route:** in `server/src/app.js`, add:
   ```js
   import instagramAuditRoutes from './routes/instagramAudit.js';
   ```
   Then, inside `createApp()` with the other API route mounts, add:
   ```js
   app.use('/api/instagram-audit', instagramAuditRoutes);
   ```

3. **Database:** run `supabase/migrations/002_instagram_audits.sql` in the Supabase SQL Editor.

4. **Frontend API URL:** set `VITE_API_URL` to your deployed backend origin in the frontend environment (for local development, use your local API origin). If your current app already uses this variable, keep its existing value.

5. **Brevo:** the backend route reuses the project's existing Brevo helper and configuration. Lead-list/email notifications will only work if those existing server-side settings are configured. Supabase stores the audit independently.

6. **Navigation (optional):** add a link to `/instagram-audit` in your existing navigation or homepage CTA. The page is reachable directly once the route is registered.

## Important

- This first version creates a preliminary audit from the visitor's answers. It does not scrape Instagram or access private account analytics.
- Do not expose the Supabase service-role key or Brevo API key in frontend environment variables.
- Back up the project before editing `App.jsx` and `server/src/app.js`.
- Build the frontend from `client/` with `npm run build`, and test the backend endpoint before deployment.
