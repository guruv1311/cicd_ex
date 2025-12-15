# CI/CD Web Application

A modern, responsive web application with a complete Jenkins CI/CD pipeline for automated building, testing, and deployment.

## 🚀 Features

- **Modern UI Design**: Beautiful glassmorphism effects, smooth animations, and vibrant gradients
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Elements**: Dynamic pipeline visualization, smooth scrolling, and form handling
- **CI/CD Pipeline**: Complete Jenkins pipeline with multiple stages
- **Automated Testing**: Built-in test suite for validation
- **Dark Mode**: Modern dark theme with carefully crafted color palette

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (Node Package Manager)
- Jenkins (for CI/CD pipeline)
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cicd_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application locally**
   ```bash
   npm start
   ```
   
   The application will open in your default browser at `http://localhost:8080`

## 📦 Project Structure

```
cicd_app/
├── index.html          # Main HTML file
├── styles.css          # CSS styles with modern design system
├── script.js           # JavaScript for interactivity
├── Jenkinsfile         # Jenkins pipeline configuration
├── package.json        # Project metadata and dependencies
├── test.js             # Automated test suite
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

## 🔄 Jenkins Pipeline

The Jenkins pipeline includes the following stages:

### 1. **Checkout**
- Pulls the latest code from the repository
- Captures commit information and author details

### 2. **Install Dependencies**
- Installs Node.js dependencies using `npm ci`
- Ensures consistent dependency versions

### 3. **Build**
- Creates a production build in the `dist` directory
- Copies all necessary files (HTML, CSS, JS)
- Runs build scripts if defined in package.json

### 4. **Test**
- Runs automated test suite
- Validates all required files exist
- Checks HTML structure, CSS, and JavaScript

### 5. **Code Quality**
- Runs linting if configured
- Generates code statistics

### 6. **Security Scan**
- Runs `npm audit` to check for vulnerabilities
- Reports security issues

### 7. **Deploy**
- Deploys to staging/production (only on main/master branch)
- Archives build artifacts
- Can be configured for various deployment targets:
  - Web servers (via rsync)
  - AWS S3
  - GitHub Pages
  - Other hosting platforms

## 🧪 Running Tests

Run the test suite locally:

```bash
npm test
```

The test suite validates:
- File existence and sizes
- HTML structure and required elements
- CSS features (variables, responsive design, animations)
- JavaScript functionality (event listeners, DOM manipulation)

## 🚀 Deployment

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Serve the built files from the `dist` directory:
   ```bash
   npm run serve
   ```

### Jenkins Deployment

1. **Configure Jenkins**:
   - Create a new Pipeline job in Jenkins
   - Point it to your repository
   - Jenkins will automatically detect the `Jenkinsfile`

2. **Environment Variables**:
   Configure these in Jenkins if needed:
   - `NODE_VERSION`: Node.js version (default: 18)
   - `APP_NAME`: Application name
   - `DEPLOY_ENV`: Deployment environment (staging/production)

3. **Deployment Target**:
   Customize the deploy stage in `Jenkinsfile` based on your hosting platform

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run dev` - Start development server (alias)
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - Run linting
- `npm run serve` - Serve production build

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-hue: 250;
    --secondary-hue: 200;
    --accent-hue: 320;
}
```

### Content
- Modify `index.html` to change page content
- Update `script.js` to add new interactive features
- Customize `styles.css` for different visual styles

### Pipeline
- Edit `Jenkinsfile` to add/remove stages
- Configure deployment targets in the Deploy stage
- Add notification integrations (email, Slack, etc.)

## 🔧 Jenkins Configuration

### Required Plugins
- Pipeline
- Git
- NodeJS
- Workspace Cleanup (optional)

### Recommended Setup
1. Install NodeJS plugin in Jenkins
2. Configure NodeJS installation (version 18+)
3. Set up credentials for deployment targets
4. Configure notification channels (email/Slack)

## 📊 Pipeline Features

- **Parallel Execution**: Stages can run in parallel where applicable
- **Build Artifacts**: Automatic archiving of build outputs
- **Notifications**: Success/failure notifications (configurable)
- **Cleanup**: Automatic workspace cleanup after builds
- **Branch-based Deployment**: Deploy only from main/master branch
- **Timeout Protection**: 30-minute timeout to prevent hanging builds

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version compatibility
- Ensure all dependencies are installed
- Review Jenkins console output

### Tests Fail
- Verify all required files exist
- Check file permissions
- Ensure HTML/CSS/JS syntax is valid

### Deployment Issues
- Verify deployment credentials
- Check network connectivity
- Review deployment target configuration

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

## 📞 Support

For issues and questions:
- Open an issue in the repository
- Check existing documentation
- Review Jenkins logs for pipeline issues

---

Built with ❤️ using modern web technologies and Jenkins CI/CD
