# Deployment Guide

This guide covers deploying the Cozy Social Platform to Vercel and Render.

## Prerequisites

- Node.js 18+ 
- Supabase account for database
- Cloudinary account for media storage
- Pusher account for real-time features
- GitHub/Google OAuth apps for authentication

## Environment Variables

Create the following environment variables in your deployment platform:

### Required Variables

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
AUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# OAuth Providers  
AUTH_GITHUB_ID="your-github-oauth-app-id"
AUTH_GITHUB_SECRET="your-github-oauth-app-secret"
AUTH_GOOGLE_ID="your-google-oauth-client-id" 
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# Media Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"  
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Database & Auth (Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Real-time Features (Pusher)
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster"
```

## Vercel Deployment

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to Vercel dashboard → Project → Settings → Environment Variables
   - Add all required variables from the list above
   - Mark PUBLIC variables as available to all environments

3. **Database Setup**
   ```bash
   npm run db:push
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

## Render Deployment

1. **Create Web Service**
   - Connect your GitHub repository
   - Use the included `render.yaml` configuration
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

2. **Configure Environment Variables**
   - Add all required variables in Render dashboard
   - Create a PostgreSQL database if not using Supabase

3. **Database Setup**
   ```bash
   npm run db:push
   ```

## Database Migration

The app uses Prisma with Supabase PostgreSQL. To set up the database:

```bash
# Install dependencies
npm install

# Push schema to database
npm run db:push

# Generate Prisma client
npx prisma generate
```

## Security Considerations

- Use strong random strings for `AUTH_SECRET`
- Keep all API keys and secrets secure
- Enable 2FA on all service accounts
- Use environment-specific OAuth redirect URLs
- Regularly rotate API keys

## Performance Optimization

- Images are optimized via Cloudinary CDN
- Static assets are cached with appropriate headers
- Database queries use connection pooling
- Real-time features are optimized for scale

## Monitoring

- Check Vercel/Render dashboard for deployment status
- Monitor Supabase for database performance
- Track Cloudinary usage and quotas
- Monitor Pusher concurrent connections

## Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Check Node.js version compatibility
- Verify database connection

### Runtime Errors  
- Check server logs in deployment dashboard
- Verify OAuth redirect URLs match deployment URL
- Ensure database schema is up to date

### Performance Issues
- Monitor Cloudinary bandwidth usage
- Check database query performance in Supabase
- Review Pusher connection limits

## Support

For deployment issues:
1. Check deployment logs
2. Verify environment variables
3. Test database connectivity
4. Review OAuth configuration