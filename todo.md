Use a Headless Browser / WebView Proxy

If you want to render the real Instagram UI, you can:

Run a server-side browser (like Puppeteer or Playwright)

That browser loads https://instagram.com/drrohan.derm

Then you proxy the page to your React frontend

Essentially, your backend fetches & serves the Instagram HTML + assets.

Here’s the concept flow:

React App (frontend) --> Your Node Server --> Puppeteer (headless browser) --> Instagram


The Node server returns a screenshot or proxied page.

🧠 Implementation Sketch (Node.js + React)

Backend (Node + Puppeteer)

import express from 'express';
import puppeteer from 'puppeteer';

const app = express();

app.get('/instagram', async (req, res) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/drrohan.derm', { waitUntil: 'networkidle2' });

  const html = await page.content(); // get the full rendered HTML
  await browser.close();

  res.send(html);
});

app.listen(5000, () => console.log('Server running on port 5000'));


Frontend (React)

import { useEffect, useState } from 'react';

function InstagramMirror() {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/instagram')
      .then(res => res.text())
      .then(setHtml);
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export default InstagramMirror;


✅ This will render the actual Instagram profile inside your app, like a “mini browser.”
⚠️ You’ll need to handle CSS/scripts/proxying images, since Instagram uses dynamic JS and authentication cookies — it won’t be interactive without extra setup.