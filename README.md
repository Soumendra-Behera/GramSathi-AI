# GramSathi AI

**Smart Support for Every Village.** Built by **SouEra**.

GramSathi AI is a simple website that helps rural and tribal communities in India find official information on government schemes, farming, learning, health and local help. It uses plain HTML, CSS and JavaScript. There is nothing to install or build.

## Features

- AI assistant chat. It runs in **DEMO MODE** until a backend is connected. Demo replies are keyword matches that point to official links, not AI-generated answers.
- Sections for government schemes, farming, education and digital literacy, health awareness, and local and emergency contacts.
- Language selector for English, Hindi and Odia. Menu, tagline and chat labels are translated. Resource descriptions are in English for now.
- Voice input using the browser's speech recognition. If the browser does not support it, the page shows a message and typing still works.
- Local contacts form. Contacts are saved only in the visitor's own browser.
- Loading, empty and error states, input checks, and safe rendering of all user text.

All links point to government websites. Please check each link before you share the site, because websites can change. Emergency numbers (112, 100, 101, 108) are widely published national numbers and are labelled "confirm for your state". The site does not state scheme eligibility or benefits.

## Folder structure

```
gramsathi-ai/
├── index.html   page structure
├── style.css    responsive styling
├── app.js       chat, language, voice, contacts, resource cards
└── README.md    this file
```

## Run locally

1. Put the four files in one folder.
2. Double-click `index.html` to open it in a browser.

Voice input may need a secure page. If the microphone does not work from a file, run `python3 -m http.server 8000` in the folder and open `http://localhost:8000`.

## Upload to GitHub

1. Sign in at github.com and click **New repository**. Name it, for example, `gramsathi-ai`. Choose **Public**.
2. On the new repository page, click **uploading an existing file**.
3. Drag in all four files: `index.html`, `style.css`, `app.js`, `README.md`.
4. Click **Commit changes**.

## Turn on GitHub Pages

1. Open the repository and go to **Settings**, then **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**, then click **Save**.
4. Wait a minute or two. The page shows your site address, usually `https://YOUR-USERNAME.github.io/gramsathi-ai/`.

## Why GitHub Pages cannot keep API keys private

GitHub Pages only serves static files. Everything in `app.js` is downloaded by every visitor, so anyone can read it. A secret key placed there would be stolen and misused. Never put API keys, passwords or private credentials in these files.

## Connect a backend for real AI

Real AI answers need a small server that keeps the key private and calls the AI service for you. Options include a serverless function (Cloudflare Workers, Vercel, Netlify) or any small web server.

1. Build a backend endpoint that accepts `POST` with this JSON:
   ```json
   { "message": "visitor question", "language": "en" }
   ```
2. It should return JSON in this form:
   ```json
   { "reply": "answer text" }
   ```
3. On the backend, store the AI key as a secret environment variable. Add rate limits, limit the message length, and allow requests only from your site address (CORS).
4. Give the AI a clear instruction to share only general information, to point to official sources, and to avoid inventing scheme rules, benefits or phone numbers.
5. In `app.js`, set `CONFIG.BACKEND_URL` to your endpoint address. The DEMO MODE notice hides automatically and the chat uses your backend. The reply is shown as plain text, so it is safe to display.

## Credits

GramSathi AI by SouEra.
