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
    // Decode any HTML entities in the URL
    const decodedUrl = url.replace(/&amp;/g, '&');
    console.log('Proxying:', decodedUrl.substring(0, 100) + '...');
    
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        'Referer': 'https://www.instagram.com/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    });

    if (!response.ok) {
      console.error('Proxy fetch failed:', response.status, url);
      return res.status(response.status).send('Failed to fetch resource');
    }

    // Forward the content type
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.set('Content-Type', contentType);
    }

    // Add CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'public, max-age=3600');

    // Forward the response
    const buffer = await response.buffer();
    res.send(buffer);
  } catch (error) {
    console.error('Proxy error for', url, ':', error.message);
    res.status(500).send('Failed to proxy resource');
  }
});

// Function to rewrite URLs in HTML to use our proxy
function rewriteHTML(html, baseUrl) {
  // First, decode HTML entities in URLs (&amp; -> &)
  html = html.replace(/&amp;/g, '&');
  
  const proxyUrl = (url) => {
    if (!url || url.startsWith('data:') || url.startsWith('blob:')) return url;
    // Decode HTML entities in the URL
    url = url.replace(/&amp;/g, '&');
    if (url.startsWith('http')) {
      return `http://localhost:${PORT}/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  // Rewrite image sources (including single quotes and no quotes)
  html = html.replace(
    /src=["']?(https?:\/\/[^"'\s>]+)["']?/gi,
    (match, url) => `src="${proxyUrl(url)}"`
  );
  
  // Rewrite srcset attributes
  html = html.replace(
    /srcset=["']([^"']+)["']/gi,
    (match, srcset) => {
      const rewritten = srcset.split(',').map(part => {
        const trimmed = part.trim();
        const spaceIndex = trimmed.lastIndexOf(' ');
        if (spaceIndex > 0) {
          const url = trimmed.substring(0, spaceIndex);
          const descriptor = trimmed.substring(spaceIndex + 1);
          if (url.startsWith('http')) {
            return `${proxyUrl(url)} ${descriptor}`;
          }
        } else if (trimmed.startsWith('http')) {
          return proxyUrl(trimmed);
        }
        return part;
      }).join(', ');
      return `srcset="${rewritten}"`;
    }
  );
  
  // Rewrite CSS background images in style attributes
  html = html.replace(
    /style=["']([^"']*url\([^)]+\)[^"']*)["']/gi,
    (match, styleContent) => {
      const rewritten = styleContent.replace(
        /url\(["']?(https?:\/\/[^"')]+)["']?\)/gi,
        (m, url) => `url(${proxyUrl(url)})`
      );
      return `style="${rewritten}"`;
    }
  );
  
  // Rewrite CSS background images in style tags
  html = html.replace(
    /<style[^>]*>([\s\S]*?)<\/style>/gi,
    (match, css) => {
      const rewritten = css.replace(
        /url\(["']?(https?:\/\/[^"')]+)["']?\)/gi,
        (m, url) => `url(${proxyUrl(url)})`
      );
      return match.replace(css, rewritten);
    }
  );
  
  // Rewrite link hrefs for stylesheets and icons
  html = html.replace(
    /<link([^>]*href=["'](https?:\/\/[^"']+)["'][^>]*)>/gi,
    (match, attrs, url) => {
      return match.replace(url, proxyUrl(url));
    }
  );
  
  // Rewrite script sources
  html = html.replace(
    /<script([^>]*src=["'](https?:\/\/[^"']+)["'][^>]*)>/gi,
    (match, attrs, url) => {
      return match.replace(url, proxyUrl(url));
    }
  );

  // Rewrite data-src attributes (lazy loading)
  html = html.replace(
    /data-src=["']?(https?:\/\/[^"'\s>]+)["']?/gi,
    (match, url) => `data-src="${proxyUrl(url)}"`
  );

  // Add base tag to handle relative URLs
  html = html.replace(
    '<head>',
    `<head><base href="${baseUrl}">`
  );

  // Inject script to remove login modals and fix images on client side
  const modalRemovalScript = `
    <script>
      // Proxy URL helper
      const proxyUrl = (url) => {
        if (!url || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('http://localhost')) return url;
        if (url.startsWith('http')) {
          return 'http://localhost:${PORT}/proxy?url=' + encodeURIComponent(url);
        }
        return url;
      };
      
      // Fix images that failed to load
      function fixImages() {
        document.querySelectorAll('img').forEach(img => {
          // Fix src
          if (img.src && img.src.includes('instagram') && !img.src.includes('localhost')) {
            const originalSrc = img.getAttribute('src');
            if (originalSrc && originalSrc.startsWith('http') && !originalSrc.includes('localhost')) {
              img.src = proxyUrl(originalSrc);
            }
          }
          
          // Fix srcset
          if (img.srcset && img.srcset.includes('instagram')) {
            const newSrcset = img.srcset.split(',').map(part => {
              const trimmed = part.trim();
              const spaceIndex = trimmed.lastIndexOf(' ');
              if (spaceIndex > 0) {
                const url = trimmed.substring(0, spaceIndex);
                const descriptor = trimmed.substring(spaceIndex + 1);
                if (url.includes('instagram') && !url.includes('localhost')) {
                  return proxyUrl(url) + ' ' + descriptor;
                }
              } else if (trimmed.includes('instagram') && !trimmed.includes('localhost')) {
                return proxyUrl(trimmed);
              }
              return part;
            }).join(', ');
            img.srcset = newSrcset;
          }
          
          // Fix data-src (lazy loading)
          if (img.dataset.src && img.dataset.src.includes('instagram') && !img.dataset.src.includes('localhost')) {
            img.dataset.src = proxyUrl(img.dataset.src);
            img.src = img.dataset.src;
          }
        });
        
        // Fix background images in style attributes
        document.querySelectorAll('[style]').forEach(el => {
          const style = el.getAttribute('style');
          if (style && style.includes('url(') && style.includes('instagram')) {
            // Simple string replacement to avoid regex issues
            let newStyle = style;
            const urlMatches = style.match(/url\\([^)]+\\)/g);
            if (urlMatches) {
              urlMatches.forEach(urlMatch => {
                const url = urlMatch.replace(/url\\(["']?/, '').replace(/["']?\\)/, '');
                if (url.includes('instagram') && !url.includes('localhost')) {
                  newStyle = newStyle.replace(urlMatch, 'url(' + proxyUrl(url) + ')');
                }
              });
              el.setAttribute('style', newStyle);
            }
          }
        });
      }
      
      // Debug: Log images
      console.log('Instagram Proxy: Checking images...');
      const images = document.querySelectorAll('img');
      console.log('Found', images.length, 'images');
      
      // Run image fix
      fixImages();
      setTimeout(fixImages, 500);
      setTimeout(fixImages, 1000);
      setTimeout(fixImages, 2000);
      setInterval(fixImages, 3000);
      
      // Also observe for new images
      const imgObserver = new MutationObserver(() => {
        fixImages();
      });
      imgObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'srcset', 'data-src']
      });
    </script>
    <script>
      // Aggressively remove ALL login/signup elements
      function removeLoginModals() {
        try {
          // Remove all dialogs and modals
          document.querySelectorAll('[role="dialog"]').forEach(el => el.remove());
          document.querySelectorAll('[role="presentation"]').forEach(el => el.remove());
          
          // Remove by text content
          const loginTexts = ['Log in', 'Log In', 'Sign up', 'Sign Up', 'Not now', 'Not Now', 'Save your login', 'Continue as'];
          
          loginTexts.forEach(text => {
            document.querySelectorAll('*').forEach(el => {
              if (el.textContent && el.textContent.trim() === text && el.children.length === 0) {
                // Remove parent containers
                let parent = el;
                for (let i = 0; i < 6; i++) {
                  if (parent.parentElement && parent.parentElement !== document.body) {
                    parent = parent.parentElement;
                  }
                }
                if (parent && parent !== document.body && parent !== document.documentElement) {
                  parent.remove();
                }
              }
            });
          });
          
          // Remove fixed overlays with high z-index
          document.querySelectorAll('div').forEach(div => {
            const style = window.getComputedStyle(div);
            if (style.position === 'fixed' && parseInt(style.zIndex) > 100) {
              const text = div.textContent || '';
              if (text.includes('Log') || text.includes('Sign') || text.includes('login') || text.length < 500) {
                div.remove();
              }
            }
          });
          
          // Force enable scrolling
          document.body.style.overflow = 'auto !important';
          document.documentElement.style.overflow = 'auto !important';
          document.body.style.position = 'static !important';
          
          // Remove any elements blocking interaction
          document.querySelectorAll('[style*="pointer-events"]').forEach(el => {
            if (el.style.pointerEvents === 'none' && el !== document.body) {
              el.remove();
            }
          });
        } catch (e) {
          console.error('Error removing modals:', e);
        }
      }
      
      // Run immediately and repeatedly
      removeLoginModals();
      setTimeout(removeLoginModals, 500);
      setTimeout(removeLoginModals, 1000);
      setTimeout(removeLoginModals, 2000);
      
      // Run after DOM loads
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeLoginModals);
      }
      
      // Run periodically
      setInterval(removeLoginModals, 500);
      
      // Observe DOM changes
      const observer = new MutationObserver(() => {
        removeLoginModals();
      });
      
      if (document.body) {
        observer.observe(document.body, { 
          childList: true, 
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class']
        });
      }
    </script>
  `;
  
  html = html.replace('</body>', `${modalRemovalScript}</body>`);

  return html;
}

// Endpoint to fetch Instagram profile with proxied resources
app.get('/api/instagram/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    console.log(`Fetching Instagram profile for: ${username}`);
    
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    // Always use mobile viewport (mobile web is more lenient)
    await page.setViewport({
      width: 414,
      height: 896,
      isMobile: true,
      hasTouch: true,
    });
    
    // Set mobile user agent (Instagram mobile web shows content without login)
    await page.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    );
    
    // Set extra headers to appear more like a real browser
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    });
    
    // Navigate to Instagram profile
    await page.goto(`https://www.instagram.com/${username}/`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Aggressively remove ALL login/signup prompts and modals
    await page.evaluate(() => {
      // Remove all modals and dialogs
      document.querySelectorAll('[role="dialog"]').forEach(el => el.remove());
      document.querySelectorAll('[role="presentation"]').forEach(el => el.remove());
      
      // Remove elements containing login/signup text
      const removeByText = (text) => {
        const xpath = `//*[contains(text(), '${text}')]`;
        const elements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < elements.snapshotLength; i++) {
          const el = elements.snapshotItem(i);
          // Remove parent containers
          let parent = el;
          for (let j = 0; j < 5; j++) {
            if (parent.parentElement) parent = parent.parentElement;
          }
          if (parent && parent !== document.body) {
            parent.remove();
          }
        }
      };
      
      removeByText('Log in');
      removeByText('Sign up');
      removeByText('Log In');
      removeByText('Sign Up');
      removeByText('Not now');
      removeByText('Save your login');
      
      // Remove fixed/sticky overlays
      document.querySelectorAll('div').forEach(div => {
        const style = window.getComputedStyle(div);
        if (style.position === 'fixed' && style.zIndex > 100) {
          const text = div.textContent || '';
          if (text.includes('Log') || text.includes('Sign') || text.length < 500) {
            div.remove();
          }
        }
      });
      
      // Force enable scrolling
      document.body.style.overflow = 'auto !important';
      document.documentElement.style.overflow = 'auto !important';
      document.body.style.position = 'static';
    });
    
    await page.waitForTimeout(1000);
    
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
  console.log(`  - GET /api/health`);
});
