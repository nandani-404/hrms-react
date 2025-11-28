# Basic Functionality Test

## Test 1: Can you see this in browser console?

Open browser console (F12) and paste:

```javascript
console.log('HR Portal Test - If you see this, JavaScript is working!')
```

## Test 2: Check if React is loading

In browser console, paste:

```javascript
console.log('React version:', React.version)
```

## Test 3: Check if page loads at all

1. Open: http://localhost:3000
2. Right-click → View Page Source
3. Look for: `<div id="root"></div>`

If you see it, React should mount there.

## Test 4: Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for:
   - `main.jsx` or `index.js` - Should load
   - `App.jsx` - Should load
   - Status should be 200 (green)

## Test 5: Check if Vite is serving files

Visit these URLs directly:

- http://localhost:3000/ - Should show app
- http://localhost:3000/src/main.jsx - Should show code or 404
- http://localhost:3000/@vite/client - Should load

## Common Issues

### Issue: Blank white page
**Cause**: JavaScript error preventing React from mounting
**Fix**: Check browser console for errors

### Issue: "Cannot GET /"
**Cause**: Dev server not running
**Fix**: Run `npm run dev`

### Issue: Styles not loading
**Cause**: Tailwind not compiling
**Fix**: Check `tailwind.config.js` exists

### Issue: Components not found
**Cause**: Import path errors
**Fix**: Check all imports use correct paths

## Manual Test Steps

1. **Stop dev server** (Ctrl+C)

2. **Clear everything**:
```bash
rm -rf node_modules/.vite
rm -rf dist
```

3. **Start fresh**:
```bash
npm run dev
```

4. **Open browser**: http://localhost:3000

5. **Check console**: Should have no errors

6. **Check page**: Should see login form

## If Still Not Working

Try this minimal test:

1. Create `test.html` in `tasksuite/frontend/`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test</title>
</head>
<body>
    <h1>If you see this, the server is working!</h1>
    <div id="root">React should mount here</div>
    <script>
        console.log('HTML loaded successfully')
    </script>
</body>
</html>
```

2. Visit: http://localhost:3000/test.html

3. If you see the heading, server is working
4. If not, there's a server issue

## Check Vite Config

Your `vite.config.js` should look like:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

## Check index.html

Your `index.html` should have:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HR Portal</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## Success Criteria

✅ Dev server starts without errors
✅ Browser opens to localhost:3000
✅ No console errors (F12)
✅ Login page visible
✅ Styles applied (blue theme)
✅ Can click buttons

## Get Help

If none of this works, provide:

1. **Terminal output** from `npm run dev`
2. **Browser console errors** (F12 → Console)
3. **Network tab** (F12 → Network → Screenshot)
4. **Node version**: `node --version`
5. **npm version**: `npm --version`
