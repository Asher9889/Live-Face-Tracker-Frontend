# How app mounts:

- React mounts
-   ↓
- Auth bootstrap (/auth/me)
-   ↓
- If authenticated → run appBootstrap (cameras, sockets, etc.)
- If unauthenticated → show login
-   ↓
- Render routes
