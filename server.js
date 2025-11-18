import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 5000;

// Enable CORS for frontend
app.use(cors());

// Cache to store browser instance
let browser = null;

// Initialize browser
async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });
  }
  return browser;
}

// Proxy endpoint for Instagram resources (images, CSS, JS)
app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.instagram.com/',
      },
    });

    // Forward the content type
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.set('Content-Type', contentType);
    }

    // Forward the response
    const buffer = await response.buffer();
    res.send(buffer);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Failed to proxy resource');
  }
});

// Function to rewrite URLs in HTML to use our proxy
function rewriteHTML(html, baseUrl) {
  // Rewrite image sources
  html = html.replace(
    /src="(https?:\/\/[^"]+)"/g,
    (match, url) => `src="http://localhost:${PORT}/proxy?url=${encodeURIComponent(url)}"`
  );
  
  // Rewrite srcset attributes
  html = html.replace(
    /srcset="([^"]+)"/g,
    (match, srcset) => {
      const rewritten = srcset.split(',').map(part => {
        const [url, descriptor] = part.trim().split(' ');
        if (url.startsWith('http')) {
          return `http://localhost:${PORT}/proxy?url=${encodeURIComponent(url)} ${descriptor || ''}`;
        }
        return part;
      }).join(', ');
      return `srcset="${rewritten}"`;
    }
  );
  
  // Rewrite CSS background images
  html = html.replace(
    /url\((https?:\/\/[^)]+)\)/g,
    (match, url) => `url(http://localhost:${PORT}/proxy?url=${encodeURIComponent(url)})`
  );
  
  // Rewrite link hrefs for stylesheets
  html = html.replace(
    /<link([^>]*href=["'](https?:\/\/[^"']+)["'][^>]*)>/g,
    (match, attrs, url) => {
      return match.replace(url, `http://localhost:${PORT}/proxy?url=${encodeURIComponent(url)}`);
    }
  );
  
  // Rewrite script sources
  html = html.replace(
    /<script([^>]*src=["'](https?:\/\/[^"']+)["'][^>]*)>/g,
    (match, attrs, url) => {
      return match.replace(url, `http://localhost:${PORT}/proxy?url=${encodeURIComponent(url)}`);
    }
  );

  // Add base tag to handle relative URLs
  html = html.replace(
    '<head>',
    `<head><base href="${baseUrl}">`
  );

  return html;
}

// Endpoint to fetch Instagram profile with proxied resources
app.get('/api/instagram/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    console.log(`Fetching Instagram profile for: ${username}`);
    
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    // Set viewport for mobile or desktop
    const isMobile = req.query.mobile === 'true';
    await page.setViewport({
      width: isMobile ? 375 : 1200,
      height: isMobile ? 812 : 3000, // Taller viewport to capture more content
      isMobile: isMobile,
    });
    
    // Set user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    // Navigate to Instagram profile
    await page.goto(`https://www.instagram.com/${username}/`, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    
    // Wait for content to load
    await page.waitForSelector('main', { timeout: 10000 }).catch(() => {});
    
    // Scroll to load more content
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight || totalHeight >= 3000) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    
    // Wait a bit for lazy-loaded images
    await page.waitForTimeout(2000);
    
    // Get the rendered HTML
    let html = await page.content();
    
    // Rewrite URLs to use our proxy
    html = rewriteHTML(html, `https://www.instagram.com/${username}/`);
    
    // Close the page
    await page.close();
    
    res.send(html);
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    res.status(500).json({
      error: 'Failed to fetch Instagram profile',
      message: error.message,
    });
  }
});

// Endpoint to get screenshot
app.get('/api/instagram/:username/screenshot', async (req, res) => {
  const { username } = req.params;
  
  try {
    console.log(`Taking screenshot for: ${username}`);
    
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    const isMobile = req.query.mobile === 'true';
    await page.setViewport({
      width: isMobile ? 375 : 1200,
      height: isMobile ? 812 : 800,
      isMobile: isMobile,
    });
    
    await page.goto(`https://www.instagram.com/${username}/`, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    
    await page.waitForSelector('main', { timeout: 10000 }).catch(() => {});
    
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
    });
    
    await page.close();
    
    res.set('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (error) {
    console.error('Error taking screenshot:', error);
    res.status(500).json({
      error: 'Failed to take screenshot',
      message: error.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  if (browser) {
    await browser.close();
  }
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Instagram Proxy Server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  - GET /api/instagram/:username`);
  console.log(`  - GET /api/instagram/:username/screenshot`);
  console.log(`  - GET /api/health`);
});
