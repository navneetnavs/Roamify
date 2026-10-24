# Roamify

## Deployment: Render API and PostgreSQL, Vercel frontend

Keep credentials in the hosting providers' environment-variable settings. Do not commit `.env` files or paste secrets into GitHub.

### 1. Create PostgreSQL on Render

1. Create a PostgreSQL database in Render and choose a region.
2. Keep the database's internal hostname, database name, username, and password private.
3. Use the internal hostname when configuring the backend service in the same Render region.

### 2. Deploy the backend on Render

1. Create a Web Service from this GitHub repository and select the deployment branch.
2. Set the service runtime to **Docker** and leave the root directory at the repository root so Render finds `Dockerfile`.
3. Add these environment variables in the Render service settings:

   | Name | Value |
   | --- | --- |
   | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<internal-host>:5432/<database-name>` |
   | `SPRING_DATASOURCE_USERNAME` | Database username from Render |
   | `SPRING_DATASOURCE_PASSWORD` | Database password from Render |
   | `JWT_SECRET_KEY` | A new random secret of at least 32 characters |
   | `ROAMIFY_ADMIN_PASSWORD` | A strong, unique password for the initial `admin@roamify.com` manager account |
   | `FRONTEND_URL` | The exact production Vercel origin, such as `https://your-app.vercel.app` |
   | `AUTH_REFRESH_TOKEN_COOKIE_SECURE` | `true` |
   | `AUTH_REFRESH_TOKEN_COOKIE_SAME_SITE` | `None` |
   | `STRIPE_SECRET_KEY` | A Stripe secret key; use a test key until ready for live payments |
   | `STRIPE_WEBHOOK_SECRET` | The signing secret for the Stripe webhook endpoint; configure the real value before using payments |

   Use Render's internal PostgreSQL connection details, not its external/public connection string. Keep the `jdbc:postgresql://` prefix in the datasource URL.
4. Deploy and wait for the service to start. The API base path is `/api/v1`.

### 3. Deploy the frontend on Vercel

1. Import the same GitHub repository into Vercel and select the deployment branch.
2. Set the project root directory to `frontend`.
3. Add `VITE_API_BASE_URL` with the Render API URL ending in `/api/v1`, for example `https://your-api.onrender.com/api/v1`.
4. Deploy. Vercel builds with `npm run build` and serves the `dist` directory; `vercel.json` provides client-side route fallback.
5. Copy the Vercel production origin into Render's `FRONTEND_URL` variable and redeploy the backend if it was not set before the first deploy.
6. In Stripe test mode, create a webhook for `https://<render-service>.onrender.com/api/v1/webhook/payment` and set its signing secret as `STRIPE_WEBHOOK_SECRET` in Render before testing payments.

### 4. Verify

1. Open the Vercel site and test registration, login, and a page refresh.
2. In browser developer tools, confirm API requests go to the Render service and the refresh-token cookie is `HttpOnly`, `Secure`, and `SameSite=None`.
3. Review Render logs for startup or database connection errors. Do not share logs that contain credentials.

The Render service and database must be running for the deployed app to work. Review the provider's current plan and database retention settings before relying on it for persistent data.