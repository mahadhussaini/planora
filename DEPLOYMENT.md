# Planora Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git repository
- Vercel account

### Quick Deploy

#### Option 1: Deploy Button (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/planora)

#### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? [Y/n] Y
# - Which scope? Select your account
# - Link to existing project? [y/N] N
# - What's your project's name? planora
# - In which directory is your code located? ./
```

#### Option 3: GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure settings (auto-detected)
6. Click "Deploy"

### Environment Variables

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```env
VITE_APP_NAME=Planora
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=AI-Powered Daily Planner
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true
NODE_ENV=production
```

### Build Settings

Vercel will auto-detect these settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Domain Configuration

1. **Custom Domain**: 
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **SSL**: Automatically provided by Vercel

### Performance Optimizations

The app is configured with:
- ✅ Code splitting
- ✅ Asset optimization  
- ✅ Compression
- ✅ CDN delivery
- ✅ PWA caching

### Monitoring

Access your deployment:
- **Dashboard**: vercel.com/dashboard
- **Analytics**: Built-in Vercel Analytics
- **Logs**: Real-time function logs
- **Performance**: Web Vitals monitoring

### Troubleshooting

#### Build Errors
```bash
# Test build locally
npm run build
npm run preview
```

#### Routing Issues
- SPA routing is configured in `vercel.json`
- All routes redirect to `index.html`

#### Environment Variables
- Must start with `VITE_` for client-side access
- Restart deployment after changes

### Automatic Deployments

Every push to main branch triggers:
1. 🔄 **Build** - Automated build process
2. 🧪 **Preview** - Deploy to preview URL  
3. 🚀 **Production** - Deploy to production domain
4. 📊 **Analytics** - Performance monitoring

### URLs

After deployment you'll get:
- **Production**: `https://planora-yourusername.vercel.app`
- **Preview**: `https://planora-git-branch-yourusername.vercel.app`
- **Custom Domain**: `https://yourdomain.com`

## 📱 PWA Features

Your app includes:
- ✅ **Offline Mode**: Service worker caching
- ✅ **Install Prompt**: Add to home screen
- ✅ **App-like Experience**: Standalone mode
- ✅ **Push Notifications**: Ready for implementation

## 🔐 Security

Configured security headers:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

## 📈 Performance

Expected metrics:
- **Lighthouse Score**: 95+
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1

---

**🎉 Your Planora app is now live and ready for users!**