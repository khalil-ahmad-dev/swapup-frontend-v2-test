# DEPLOYMENT STEPS
*npm run build*
vite will produce a client side output in the dist folder

From VSCode, deploy -> select the root directory.

In Azure App Service Configuration, specify startup command to be 
*node server.js*

check Server.js to see how it handles the client routing issues
* Increased the App Service Plan to have enough space and memory for node packages.

# React + TypeScript + Vite
