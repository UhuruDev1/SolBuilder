# cPanel Node.js Deployment Instructions for Solana AI Builder

This guide provides step-by-step instructions for deploying the Solana AI Builder application to a cPanel hosting environment with Node.js support.

## Prerequisites

1. A cPanel hosting account with Node.js support
2. SSH access to your cPanel server (recommended)
3. Git installed on your cPanel server
4. Your Solana AI Builder codebase

## Step 1: Set Up Node.js in cPanel

1. Log in to your cPanel account
2. In the "Software" section, click on "Setup Node.js App"
3. Click "Create Application"
4. Fill in the following details:
   - **Node.js version**: Select the latest LTS version (16.x or higher)
   - **Application mode**: Production
   - **Application root**: Set to the directory where you want to deploy your app (e.g., `solana-ai-builder`)
   - **Application URL**: The URL path where your app will be accessible
   - **Application startup file**: `server.js` (we'll create this file later)
5. Click "Create"

## Step 2: Upload Your Application

### Option 1: Using Git

1. SSH into your cPanel server
2. Navigate to your application directory:
   \`\`\`bash
   cd ~/your_application_directory
   \`\`\`
3. Clone your repository:
   \`\`\`bash
   git clone https://github.com/your-username/solana-ai-builder.git .
   \`\`\`

### Option 2: Using File Manager

1. In cPanel, open File Manager
2. Navigate to your application directory
3. Upload your application files (you can use the "Upload" button or drag and drop)

## Step 3: Create a Server File

Create a file named `server.js` in your application root directory with the following content:

\`\`\`javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Create the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
\`\`\`

## Step 4: Install Dependencies

1. SSH into your cPanel server
2. Navigate to your application directory:
   \`\`\`bash
   cd ~/your_application_directory
   \`\`\`
3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
4. Build the application:
   \`\`\`bash
   npm run build
   \`\`\`

## Step 5: Configure Environment Variables

1. In cPanel, go to the "Setup Node.js App" section
2. Click on your application
3. Scroll down to the "Environment variables" section
4. Add all required environment variables:
   - `NODE_ENV=production`
   - `GROQ_API_KEY=your_groq_api_key`
   - `DATABASE_URL=your_database_url`
   - Add any other environment variables your application needs

## Step 6: Start Your Application

1. In cPanel, go to the "Setup Node.js App" section
2. Click on your application
3. Click "Run JS Script"
4. Your application should now be running

## Step 7: Set Up a Custom Domain (Optional)

1. In cPanel, go to "Domains" or "Subdomains"
2. Add your domain or subdomain
3. Point it to your application directory

## Step 8: Set Up SSL (Optional but Recommended)

1. In cPanel, go to "SSL/TLS"
2. Use "Let's Encrypt" or another SSL provider to secure your domain

## Troubleshooting

### Application Won't Start

1. Check the application logs in cPanel
2. Verify all environment variables are set correctly
3. Make sure all dependencies are installed
4. Check that the build was successful

### Database Connection Issues

1. Verify your database credentials
2. Check if your database is accessible from your cPanel server
3. Make sure your database connection string is correctly formatted

### Memory Issues

If your application crashes due to memory limits:

1. In cPanel, go to the "Setup Node.js App" section
2. Click on your application
3. Increase the memory limit if possible
4. Optimize your application to use less memory

## Maintenance

### Updating Your Application

1. SSH into your cPanel server
2. Navigate to your application directory
3. Pull the latest changes:
   \`\`\`bash
   git pull origin main
   \`\`\`
4. Install any new dependencies:
   \`\`\`bash
   npm install
   \`\`\`
5. Rebuild the application:
   \`\`\`bash
   npm run build
   \`\`\`
6. Restart your application in cPanel

### Monitoring

1. Regularly check your application logs in cPanel
2. Set up monitoring tools to alert you of any downtime
3. Implement error tracking with a service like Sentry

## Security Considerations

1. Keep your Node.js version updated
2. Regularly update dependencies with `npm audit fix`
3. Use environment variables for sensitive information
4. Implement rate limiting for API endpoints
5. Set up proper CORS policies
