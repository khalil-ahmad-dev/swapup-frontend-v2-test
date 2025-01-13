import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
import serveStatic from 'serve-static';
import history from 'connect-history-api-fallback';

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'dist' directory
app.use(serveStatic(path.join(__dirname, 'dist')));

// Handle client-side routing with history API fallback
app.use(history());

// Fallback to serve index.html for all other requests
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});