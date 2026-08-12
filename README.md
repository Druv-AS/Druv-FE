# Dhruv Frontend

React 18 + Vite SPA for the Dhruv readiness platform.

## Running locally

```bash
npm ci
npm run dev      # http://localhost:5173
npm run build
```

Leave `VITE_BACKEND_URL` empty locally. Vite then proxies `/api` and `/ws` to
`localhost:8080`, keeping the browser on a single origin so the session cookie is
first-party and CORS never applies. See [`.env.example`](.env.example).

## Talking to the API

Use `apiFetch` from [`src/api.js`](src/api.js) for every request. It sends
`credentials: 'include'` (required for the session cookie), attaches the CSRF token to
mutations, and throws a typed `ApiError` carrying the server's stable `code`.

```js
import { apiFetch, ApiError } from './api';

try {
  const plan = await apiFetch('/api/v1/plan/daily');
} catch (err) {
  if (err instanceof ApiError && err.code === 'STUDENT_NOT_FOUND') { /* ... */ }
}
```

Branch on `err.code`, never on `err.message` — messages are copy and will change.

For read-only panels prefer the `useApiResource` hook, which supplies `data`, `error`,
`isLoading`, and `reload`, and pair it with `PanelLoading` / `PanelError`.

## Two rules worth keeping

**Identity is never stored client-side.** The signed-in user comes from
`GET /api/v1/auth/session` on load. An earlier version kept a user object in
`localStorage`, which meant a user could edit their own id, name, or role — and the
server, having no auth layer, believed it.

**Never substitute placeholder data on failure.** Every panel used to catch fetch errors
and render hardcoded demo values. In the parent portal that displayed invented study
statistics for fictional children as though they belonged to the signed-in parent. Show
`PanelError` instead; an error message is better than confident misinformation.

## Structure

```
src/
├── api.js                    # HTTP client: credentials, CSRF, typed errors
├── hooks/useApiResource.js   # load a resource with loading/error state
├── components/
│   ├── PanelState.jsx        # shared loading and error views
│   ├── ErrorBoundary.jsx     # keeps one crashed panel from blanking the app
│   └── ...
└── App.jsx                   # session restore, routing, logout
```

## Known gaps

- No test suite. Vitest + React Testing Library is the natural fit; the auth flow and
  `ParentPortal` empty/error states are the highest-value first targets.
- Navigation is `useState`, not a router, so views are not linkable or back-button aware.
- Styling is inline objects throughout; there is no design-token layer.
- Both career images ship at ~800 KB uncompressed and dominate the bundle. Converting
  them to WebP would cut most of it.
