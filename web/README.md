# Procedural Animal Animation - p5.js Version

This is the JavaScript/p5.js version of the procedural animal animation project, migrated from the original Processing version.

## About

An interactive animation showcasing procedural animation techniques for three different animals:
- **Fish** (鱼) - Smooth swimming with pectoral, ventral, caudal, and dorsal fins
- **Snake** (蛇) - Undulating motion with a 48-segment chain
- **Lizard** (蜥蜴) - Four-legged walking using FABRIK inverse kinematics

## Features

- **Inverse Kinematics**: Uses angle-constrained chain resolution and FABRIK algorithm
- **Procedural Animation**: All movements are calculated in real-time based on mouse position
- **Interactive**: Click or use keyboard shortcuts to switch between animals
- **Responsive**: Adapts to window size automatically

## How to Run Locally

### Option 1: Simple HTTP Server (Recommended)

1. Open a terminal in this directory (`web/`)
2. Run a local server:
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # Node.js (if you have npm)
   npx http-server -p 8000
   ```
3. Open your browser to `http://localhost:8000`

### Option 2: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Controls

- **Mouse**: Move to control the animal
- **Click**: Cycle through animals (Fish → Snake → Lizard → Fish)
- **Keyboard Shortcuts**:
  - `1` - Switch to Fish
  - `2` - Switch to Snake
  - `3` - Switch to Lizard

## Technical Details

### Technology Stack
- **p5.js** - Processing's JavaScript port for creative coding
- **ES6 Modules** - Modern JavaScript module system
- **No build tools** - Runs directly in the browser

### Algorithms
- **Standard IK Chain Resolution** - Angle-constrained forward kinematics
- **FABRIK** - Forward And Backward Reaching Inverse Kinematics (for lizard legs)
- **Procedural Geometry** - Dynamic body shapes using Bezier curves and curve vertices

### Project Structure
```
web/
├── index.html              # Entry point
├── styles/
│   └── main.css           # Styling
├── src/
│   ├── main.js            # Application entry
│   ├── core/
│   │   └── Chain.js       # IK chain system
│   ├── animals/
│   │   ├── Fish.js        # Fish class
│   │   ├── Snake.js       # Snake class
│   │   └── Lizard.js      # Lizard class
│   └── utils/
│       └── geometry.js    # Geometry utilities
└── README.md              # This file
```

## Browser Compatibility

Tested and working on:
- Chrome/Edge (Chromium) - Latest
- Firefox - Latest
- Safari - Latest
- Mobile browsers (Chrome Mobile, Safari iOS)

Requires a modern browser with ES6 module support (no IE11).

## Original Project

This is a migration of the original Processing version located in the parent directory. See [../README.md](../README.md) for the original Processing code.

## Credits

- **Original Processing Version**: argonaut (2024)
- **p5.js Migration**: Migrated with Claude Code (2025)

## License

MIT License - Same as the original project
