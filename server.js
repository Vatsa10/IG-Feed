import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

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

// Endpoint to fetch Instagram profile
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
      height: isMobile ? 812 : 800,
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
    
    // Get the rendered HTML
    const html = await page.content();
    
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
