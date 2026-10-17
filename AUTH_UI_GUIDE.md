# Login / Signup – UI Integration Guide

For whoever is building the frontend of the login page. The auth logic (Supabase) is already done and working. You only need to design the UI.

## Where to put your UI

File: `app/login/loginDemo.tsx` (wherever `page.tsx` for the login route lives)

Find this block and build your design **inside it**:

```tsx
return (
  // ===================== FRONTEND UI START =====================
  ...
  // ====================== FRONTEND UI END ======================
);
```

The existing markup there is a bare, unstyled placeholder so the flow can be tested. Replace it freely (Tailwind, CSS modules, a component library, whatever the project uses).

**Do not edit** anything above the `return` (the STATE & LOGIC section), and don't touch `page.tsx`, `browser-client.ts` or `server-client.ts`.

## What you can use

| Name | Type | What it's for |
|---|---|---|
| `user` | `User \| null` | The logged-in user. `null` if nobody is logged in. Use `user.email` to show who's signed in. |
| `mode` | `"login" \| "signup"` | Which form is currently showing. Use it to switch titles, button text, and extra fields. |
| `toggleMode()` | function | Switches between login and signup. Wire it to a "Don't have an account?" link/button. |
| `email`, `setEmail` | string, setter | Controlled email input: `value={email} onChange={e => setEmail(e.target.value)}` |
| `password`, `setPassword` | string, setter | Controlled password input, same pattern. |
| `handleSubmit` | function | Put on the form: `<form onSubmit={handleSubmit}>`. Handles both login and signup depending on `mode`. |
| `handleGoogleSignIn` | function | `onClick` for a "Continue with Google" button. |
| `handleSignOut` | function | `onClick` for a sign out button (shown when `user` exists). |
| `status` | string | Message to display (error or success). Empty string when there's nothing to show. |
| `isError` | boolean | `true` if `status` is an error, so you can style it red. |
| `loading` | boolean | `true` while a request is running. Use it to disable buttons / show a spinner. |

## Rules for the form

- Wrap the inputs in a `<form onSubmit={handleSubmit}>` and make the main button `type="submit"`. Any other button (Google, toggle, sign out) must be `type="button"` or it will submit the form.
- Use `type="email"` and `type="password"` on the inputs.
- Disable buttons with `disabled={loading}` to prevent double-submits.
- Show `status` somewhere visible; it's the only feedback the user gets (wrong password, "check your email", etc.).

## Behaviour you should know about (so you design for it)

- **Login success** → user is redirected to `/dashboard` automatically.
- **Signup success** → no redirect. `status` says "Check your email to confirm your account." Design a clear message state for this.
- **Email already registered** → `status` says so, with `isError = true`.
- **Google sign-in** → the browser leaves the page for Google and comes back via `/auth/callback`, then lands on `/dashboard`.
- **Already logged in** → `user` is not null when the page loads. The placeholder shows "Signed in as …" plus a sign out button; you can style that or redirect instead.
- If the callback fails, the user lands on `/login?error=auth_callback_failed`. You can read this query param to show an error banner.

## Adding extra fields (e.g. username, confirm password)

Add your own `useState` for the field **in the UI section only if it is purely visual** (like "show password" toggle or confirm-password matching). If a new field needs to be sent to Supabase, ask the backend dev to add it to `handleSubmit`.

## Quick test checklist

1. Sign up with a new email → "Check your email…" appears.
2. Click the confirm link in the email → lands on `/dashboard`.
3. Log in with correct details → redirected to `/dashboard`.
4. Log in with a wrong password → red error message, stays on page.
5. Click Google → Google screen → back to `/dashboard`.
6. Buttons are disabled while loading.

hara