# 🍗 Mandi Spinner - Fair Chicken Distribution

A simple, fun web application for fairly distributing chicken pieces (chest and leg) among people using a spinning wheel mechanism.

## Features

- **Custom Quarters Mode**: Define chicken quarters and toggle between chest and leg pieces
- **Manual Mode**: Directly input the number of chest and leg pieces
- **People Management**: Add and remove people who will receive pieces
- **Spinning Wheel**: Animated wheel that randomly assigns pieces to people based on availability
- **Assignment History**: Track all assignments made during the session
- **Reset Function**: Start fresh anytime

## Hosting on GitHub Pages

This is a static website that can be hosted for free on GitHub Pages. Follow these simple steps:

### Method 1: Manual Deployment

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it whatever you like (e.g., `mandi-spinner`)
   - Make it public

2. **Upload Files**
   - Upload all the files from this project to your repository:
     - `index.html`
     - `styles.css`
     - `script.js`
     - `public/` folder (with favicon.png)
     - `src/assets/` folder (with background images)

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

4. **Access Your Site**
   - Your site will be available at: `https://yourusername.github.io/repository-name/`
   - It may take a few minutes for the site to go live

### Method 2: Using GitHub Actions (Automated)

The `.github/workflows/deploy.yml` file is already configured for automatic deployment.

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/repository-name.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Under "Source", select "GitHub Actions"

3. **Automatic Deployment**
   - Every time you push to the `main` branch, the site will automatically rebuild and deploy
   - Check the "Actions" tab to see deployment progress

## Local Development

To run locally, simply open `index.html` in your web browser. No build process or server required!

## Technologies Used

- **HTML5**: Structure and semantics
- **CSS3**: Styling with custom animations
- **Vanilla JavaScript**: All functionality without frameworks
- **No Dependencies**: Completely self-contained

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # All styles and animations
├── script.js           # Application logic
├── public/
│   └── favicon.png     # Site favicon
└── src/
    └── assets/
        ├── mandi_back.jpg    # Background image
        └── mandi_back2.jpg   # Alternative background
```

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

Free to use and modify as needed.

---

Enjoy fair chicken distribution! 🍗🎉
