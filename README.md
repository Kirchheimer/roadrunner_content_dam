# Digital Asset Repository

A static digital asset repository hosted on GitHub Pages, serving as a headless content source for multiple client applications.

## 🚀 Overview

This repository provides organized content in nested project folders, with each project containing descriptions, feeds, and assets accessible via public URLs. No authentication or dynamic CMS required.

## 📁 Directory Structure

```
digital-asset-site/
│
├── index.html              # Landing page listing all projects
├── sitemap.json            # Machine-readable project index
├── generate-sitemap.js     # Automatic sitemap generation script
├── package.json            # Node.js configuration and scripts
│
├── projects/               # Project directories
│   ├── project-a/          # JavaScript Testing Framework
│   │   ├── index.html      # Project page
│   │   ├── content.json    # Structured project data
│   │   ├── feeds/          # Project feeds
│   │   │   ├── news.json   # News feed
│   │   │   └── updates.json # Updates feed
│   │   └── images/         # Project images
│   │       ├── banner.jpg  # Project banner
│   │       └── logo.png    # Project logo
│   │
│   └── project-b/          # React UI Component Library
│       └── ...             # Same structure as project-a
│
└── assets/                 # Shared resources
    ├── css/
    │   └── main.css        # Site-wide styling
    ├── js/
    │   └── main.js         # Site-wide JavaScript
    └── shared-images/      # Global images
```

## 🔧 Development Setup

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Installation
```bash
git clone [your-repo-url]
cd digital-asset-site
npm install
```

### Development Commands
```bash
# Generate sitemap from projects
npm run build

# Start local development server
npm run serve

# Generate sitemap and start server
npm run dev

# Validate all content files
npm run validate

# Test all API endpoints
npm run test
```

## 📊 Content Structure

### Project Content (`content.json`)
```json
{
  "title": "Project Name",
  "description": "Project description",
  "version": "1.0.0",
  "status": "stable",
  "repository": "https://github.com/...",
  "documentation": "https://docs.example.com",
  "sections": [
    {
      "heading": "Overview", 
      "body": "Project overview content..."
    }
  ],
  "tags": ["javascript", "testing"],
  "maintainers": [
    {
      "name": "Developer Name",
      "email": "dev@example.com",
      "github": "username"
    }
  ],
  "license": "MIT"
}
```

### News Feed (`feeds/news.json`)
```json
[
  {
    "id": "news-001",
    "date": "2025-10-05",
    "title": "Version 1.2 Released",
    "summary": "Major update with new features...",
    "category": "release",
    "author": "Developer Name",
    "tags": ["release", "features"],
    "content": "Full article content..."
  }
]
```

### Generated Sitemap (`sitemap.json`)
```json
{
  "last_updated": "2025-10-05",
  "total_projects": 2,
  "projects": [
    {
      "id": "project-a",
      "title": "Project A - JavaScript Testing Framework",
      "path": "projects/project-a/",
      "feeds": ["news.json", "updates.json"],
      "version": "1.2.0",
      "status": "stable"
    }
  ]
}
```

## 🌐 Client Integration

### Fetch Project Content
```javascript
fetch('https://[username].github.io/[repo]/projects/project-a/content.json')
  .then(res => res.json())
  .then(data => console.log(data.title, data.description));
```

### Get Latest News
```javascript
fetch('https://[username].github.io/[repo]/projects/project-a/feeds/news.json')
  .then(res => res.json())
  .then(news => console.log('Latest:', news[0].title));
```

### Embed Project Page
```html
<iframe 
  src="https://[username].github.io/[repo]/projects/project-a/"
  width="100%" 
  height="600">
</iframe>
```

### Discover All Projects
```javascript
fetch('https://[username].github.io/[repo]/sitemap.json')
  .then(res => res.json())
  .then(sitemap => {
    sitemap.projects.forEach(project => {
      console.log(project.title, project.path);
    });
  });
```

## 🚀 GitHub Pages Deployment

### 1. Repository Setup
1. Create GitHub repository: `digital-asset-site`
2. Push code to `main` branch
3. Go to Settings → Pages
4. Select Source: "Deploy from a branch"
5. Choose branch: `main` 
6. Click Save

### 2. Custom Domain (Optional)
Add `CNAME` file with your domain:
```
assets.yourdomain.com
```

### 3. Automatic Sitemap Generation
The sitemap updates automatically when:
- New projects are added
- Content files are modified  
- Manual trigger: `npm run build`

## 🔍 Adding New Projects

1. **Create Project Directory**
   ```bash
   mkdir projects/new-project
   ```

2. **Add Required Files**
   ```bash
   touch projects/new-project/content.json
   touch projects/new-project/index.html
   mkdir projects/new-project/feeds
   mkdir projects/new-project/images
   ```

3. **Generate Sitemap**
   ```bash
   npm run build
   ```

4. **Validate Content** 
   ```bash
   npm run validate
   ```

## 📝 Content Guidelines

- **IDs**: Use lowercase, hyphenated names (e.g., `my-awesome-project`)
- **Descriptions**: Keep under 200 characters for better display
- **Images**: Optimize for web (< 500KB recommended)
- **JSON**: Validate syntax before committing
- **News**: Sort by date (newest first)
- **Tags**: Use consistent lowercase tags

## 🛠️ Customization

### Theming
Edit `/assets/css/main.css` to customize:
- Color scheme
- Typography
- Layout spacing
- Component styling

### JavaScript
Modify `/assets/js/main.js` for:
- Custom interactions
- Additional API calls
- Enhanced UI features

### Project Templates
Copy existing project structure and modify:
```bash
cp -r projects/project-a projects/new-project
# Edit content.json and other files
npm run build
```

## 🔒 Security & Performance

- **Static Files Only**: No server-side processing required
- **CORS Enabled**: All JSON files accessible cross-origin
- **CDN Cached**: GitHub Pages provides global CDN
- **HTTPS**: Automatic SSL/TLS encryption
- **Version Control**: Complete history in Git

## 🆘 Troubleshooting

### Sitemap Not Updating
```bash
# Re-generate sitemap
npm run build

# Check for errors
node generate-sitemap.js
```

### JSON Validation Errors
```bash
# Validate all content
npm run validate

# Check specific file
node -p "JSON.parse(require('fs').readFileSync('projects/project-a/content.json', 'utf8'))"
```

### Local Development Issues
```bash
# Clear cache and restart
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add/modify projects and content
4. Run validation: `npm run validate`
5. Generate sitemap: `npm run build`
6. Submit pull request

---

**Live Demo**: Replace `[username]` and `[repo]` with your GitHub details to see your site at:
`https://[username].github.io/[repo]/`
