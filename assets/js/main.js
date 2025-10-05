// Digital Asset Repository - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
});

async function loadProjects() {
    try {
        const response = await fetch('sitemap.json');
        const data = await response.json();
        
        const projectList = document.getElementById('project-list');
        if (!data.projects || data.projects.length === 0) {
            projectList.innerHTML = '<div class="no-projects">No projects found.</div>';
            return;
        }

        const projectCards = data.projects.map(project => createProjectCard(project)).join('');
        projectList.innerHTML = projectCards;
        
    } catch (error) {
        console.error('Error loading projects:', error);
        const projectList = document.getElementById('project-list');
        projectList.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                Error loading projects. Please check the sitemap.json file.
            </div>
        `;
    }
}

function createProjectCard(project) {
    const feeds = project.feeds || [];
    const feedLinks = feeds.map(feed => 
        `<a href="${project.path}feeds/${feed}" class="feed-link">${feed}</a>`
    ).join('');

    return `
        <div class="project-card">
            <h3>${escapeHtml(project.title)}</h3>
            <p>Project ID: <code>${escapeHtml(project.id)}</code></p>
            
            <div class="project-links">
                <a href="${project.path}">
                    <i class="fas fa-home"></i>
                    View Project
                </a>
                <a href="${project.path}content.json">
                    <i class="fas fa-file-code"></i>
                    Content JSON
                </a>
            </div>
            
            ${feeds.length > 0 ? `
                <div class="project-feeds">
                    <h4><i class="fas fa-rss"></i> Feeds</h4>
                    <div class="feed-list">
                        ${feedLinks}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add some interactive features
document.addEventListener('click', function(e) {
    // Handle external link clicks
    if (e.target.tagName === 'A' && e.target.href) {
        const url = new URL(e.target.href);
        
        // If it's a JSON file, try to preview it
        if (url.pathname.endsWith('.json')) {
            e.preventDefault();
            previewJson(e.target.href, e.target.textContent);
        }
    }
});

async function previewJson(url, title) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Create a modal or popup to show JSON preview
        showJsonPreview(data, title, url);
        
    } catch (error) {
        console.error('Error loading JSON:', error);
        // Fallback to opening the link normally
        window.open(url, '_blank');
    }
}

function showJsonPreview(data, title, url) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    // Create modal content
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 10px;
        max-width: 800px;
        max-height: 80vh;
        width: 100%;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;
    
    content.innerHTML = `
        <div style="padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; color: #2c3e50;">${escapeHtml(title)}</h3>
            <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
        </div>
        <div style="padding: 0;">
            <pre style="margin: 0; padding: 20px; background: #2d3748; color: #e2e8f0; overflow: auto; max-height: 60vh; font-family: Monaco, monospace; font-size: 0.9rem;">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
        </div>
        <div style="padding: 15px 20px; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center;">
            <a href="${url}" target="_blank" style="color: #667eea; text-decoration: none;">
                <i class="fas fa-external-link-alt"></i> Open in new tab
            </a>
            <button onclick="navigator.clipboard.writeText('${url}')" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
                Copy URL
            </button>
        </div>
    `;
    
    modal.className = 'modal';
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.querySelector('.modal')) {
            document.querySelector('.modal').remove();
        }
    });
}
