### OmniSync WatchParty

An enterprise-ready, **DRM-immune architecture** designed to synchronize viewing experiences across platforms like Netflix without screen capture interference. 

### Architecture Abstract

Traditional extensions fall short when platforms implement updates to their widevine/scrypt media protection rules, resulting in complete failure or pitch-black video inputs. **OmniSync** circumvents this completely by ignoring the rendering layer and implementing a **Sidecar State Synchronization Protocol**. Metadata hooks and navigation triggers remain completely outside the protected media context window. 

### Installation & Getting Started

### Prerequisites

* Node.js v16.x or superior installed on host machines.

### Running the Infrastructure Engine

1. Clone the codebase and move to the server environment directory: 

``` bash

cd server
npm install
npm start

```

2. Spin up client nodes to handle event monitoring: 

``` bash

cd ../client-agent
npm install
npm start

```

### Production Scaling Architecture

To link this directly to user view interfaces, engineers can use local Automation Server APIs (like Selenium Webdriver or Puppeteer Core) passing --remote-debugging-port to read active DOM window addresses without triggering browser element security alerts.
