# 🔐 Auth0 Setup Guide for Kol's Hub

## Complete Step-by-Step Instructions

---

## 📋 STEP 1: Create Auth0 Account

1. **Go to Auth0 website**
   ```
   https://auth0.com
   ```

2. **Click "Sign Up"** (top right corner)

3. **Choose sign-up method:**
   - Email + Password
   - GitHub
   - Google
   - Microsoft

4. **Verify your email** if using email sign-up

5. **Select your tenant region:**
   - US (default)
   - EU
   - AU

---

## 📋 STEP 2: Create Your Application

1. **Go to Dashboard**
   ```
   https://manage.auth0.com/dashboard
   ```

2. **Click "Applications"** in left sidebar

3. **Click "Applications"** again (submenu)

4. **Click "+ Create Application"** button (top right)

5. **Fill in the form:**
   | Field | Value |
   |-------|-------|
   | Name | `Kol's Hub` |
   | Application Type | **Single Page Application** |

6. **Click "Create"**

---

## 📋 STEP 3: Copy Your Credentials

After creating, you'll see the **Quick Start** page.

1. **Click "Settings" tab**

2. **Copy these values** (you'll need them later):

   | Field | Example Value |
   |-------|---------------|
   | **Domain** | `dev-abc123xyz.us.auth0.com` |
   | **Client ID** | `aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV` |
   | **Client Secret** | `xY1zA2bC3dE4fG5hI6jK7lM8nO9pQ0rS...` |

   ⚠️ **Keep Client Secret private!** Never commit to git.

---

## 📋 STEP 4: Configure Application URIs

Still in **Settings** tab, scroll down to **Application URIs**:

### 4.1 Allowed Callback URLs
Copy and paste this entire block:
```
http://localhost:5173/auth/callback,
http://localhost:5173/callback,
https://kolhub.netlify.app/auth/callback,
https://kolhub.netlify.app/callback,
https://kol-personal-os.netlify.app/auth/callback,
https://kol-personal-os.netlify.app/callback,
kolhub://auth/callback,
kolhub://callback,
com.unified.megaapp://auth/callback,
com.unified.megaapp://callback
```

### 4.2 Allowed Logout URLs
Copy and paste:
```
http://localhost:5173,
https://kolhub.netlify.app,
https://kol-personal-os.netlify.app,
kolhub://logout,
com.unified.megaapp://logout
```

### 4.3 Allowed Web Origins
Copy and paste:
```
http://localhost:5173,
https://kolhub.netlify.app,
https://kol-personal-os.netlify.app
```

### 4.4 Allowed Origins (CORS)
Copy and paste:
```
http://localhost:5173,
https://kolhub.netlify.app,
https://kol-personal-os.netlify.app
```

### 4.5 Click "Save Changes" (bottom of page)

---

## 📋 STEP 5: Configure Advanced Settings

1. **Scroll down** to "Advanced Settings"

2. **Click to expand**

3. **Go to "Grant Types" tab**

4. **Enable these:**
   - ✅ Authorization Code
   - ✅ Refresh Token
   - ✅ Implicit (optional, for legacy)

5. **Click "Save Changes"**

---

## 📋 STEP 6: Add Social Connections (Optional)

### 6.1 Google Login
1. Go to **Authentication → Social** in sidebar
2. Click **Google**
3. Toggle **ON**
4. Choose:
   - Use Auth0 dev keys (for testing)
   - Or enter your own Google OAuth credentials
5. Click **Save**

### 6.2 Spotify Login
1. Go to **Authentication → Social**
2. Click **Create Connection**
3. Search for **Spotify**
4. Enter:
   - Client ID: `860927c26ac74e26a65d64f3ce331431`
   - Client Secret: `61b7c1b2f67c451fa8d2ba6480965a40`
5. Click **Create**
6. Toggle **ON** for your application

### 6.3 Apple Login (for iOS)
1. Go to **Authentication → Social**
2. Click **Apple**
3. Requires Apple Developer credentials
4. Follow Auth0's Apple setup guide

---

## 📋 STEP 7: Update Environment Variables

### 7.1 Local Development (.env file)

Open your `.env` file and update:

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=dev-YOUR-TENANT.us.auth0.com
VITE_AUTH0_CLIENT_ID=YOUR_CLIENT_ID_HERE
VITE_AUTH0_AUDIENCE=https://api.kolhub.app
```

Replace:
- `dev-YOUR-TENANT.us.auth0.com` → Your actual Auth0 domain
- `YOUR_CLIENT_ID_HERE` → Your actual Client ID

---

## 📋 STEP 8: Add to Netlify

1. **Go to Netlify**
   ```
   https://app.netlify.com
   ```

2. **Select your site** (kols-hub or kol-personal-os)

3. **Go to:** Site Settings → Build & Deploy → Environment Variables

4. **Add these variables:**

   | Key | Value |
   |-----|-------|
   | `VITE_AUTH0_DOMAIN` | `dev-YOUR-TENANT.us.auth0.com` |
   | `VITE_AUTH0_CLIENT_ID` | `YOUR_CLIENT_ID_HERE` |
   | `VITE_AUTH0_AUDIENCE` | `https://api.kolhub.app` |

5. **Click "Save"**

6. **Trigger a new deploy** (Deploys → Trigger deploy)

---

## 📋 STEP 9: Add to GitHub Secrets

1. **Go to your GitHub repo**
   ```
   https://github.com/sydnikol/kols-hub
   ```

2. **Go to:** Settings → Secrets and variables → Actions

3. **Click "New repository secret"**

4. **Add these secrets:**

   | Name | Value |
   |------|-------|
   | `VITE_AUTH0_DOMAIN` | `dev-YOUR-TENANT.us.auth0.com` |
   | `VITE_AUTH0_CLIENT_ID` | `YOUR_CLIENT_ID_HERE` |
   | `VITE_AUTH0_CLIENT_SECRET` | `YOUR_CLIENT_SECRET_HERE` |

---

## 📋 STEP 10: Test Your Setup

### 10.1 Local Testing
```bash
cd "C:\Users\Asus User\Desktop\kols-hub-merge"
npm run dev
```

1. Open http://localhost:5173
2. Click the Login button
3. You should see Auth0's login page
4. Login with email or social provider
5. You should be redirected back to your app

### 10.2 Production Testing
1. Push your changes to GitHub
2. Wait for Netlify deploy
3. Go to https://kolhub.netlify.app
4. Test login flow

---

## 📋 STEP 11: Using Auth in Your App

### Import the hook:
```tsx
import { useAuth } from '../auth/useAuth';
```

### In your component:
```tsx
const MyComponent = () => {
  const { isAuthenticated, user, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={() => login()}>Login</button>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};
```

### Protect a route:
```tsx
import { ProtectedRoute } from '../auth/ProtectedRoute';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## ✅ CHECKLIST

Copy this to track your progress:

```
[ ] 1. Created Auth0 account
[ ] 2. Created "Kol's Hub" SPA application
[ ] 3. Copied Domain and Client ID
[ ] 4. Added Callback URLs
[ ] 5. Added Logout URLs
[ ] 6. Added Web Origins
[ ] 7. Enabled Grant Types
[ ] 8. (Optional) Added Google social login
[ ] 9. (Optional) Added Spotify social login
[ ] 10. Updated local .env file
[ ] 11. Added env vars to Netlify
[ ] 12. Added secrets to GitHub
[ ] 13. Tested login locally
[ ] 14. Tested login in production
```

---

## 🔗 QUICK LINKS

| Resource | URL |
|----------|-----|
| Auth0 Dashboard | https://manage.auth0.com |
| Auth0 Docs | https://auth0.com/docs |
| React SDK Docs | https://auth0.com/docs/libraries/auth0-react |
| Netlify Site Settings | https://app.netlify.com/sites/kols-hub/settings/env |
| GitHub Secrets | https://github.com/sydnikol/kols-hub/settings/secrets/actions |

---

## ❓ TROUBLESHOOTING

### "Invalid callback URL"
- Make sure your callback URL in Auth0 matches exactly
- Check for trailing slashes
- Verify http vs https

### "Login works but I'm not authenticated"
- Check that `cacheLocation: 'localstorage'` is set
- Verify the audience matches your API identifier

### "Social login not working"
- Make sure the social connection is enabled for your app
- Check that the callback URL is correct for that provider

### "CORS errors"
- Add your domain to "Allowed Origins (CORS)" in Auth0
- Make sure it matches exactly (no trailing slash)

---

**Created:** 2026-02-07
**Version:** 10.6.0
