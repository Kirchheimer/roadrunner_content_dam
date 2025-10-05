#!/usr/bin/env node

/**
 * Sitemap Generator for Digital Asset Repository
 * 
 * This script automatically generates a sitemap.json file by scanning
 * the projects directory and reading content.json files.
 */

const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = './projects';
const OUTPUT_FILE = './sitemap.json';

/**
 * Recursively scan directories for projects
 */
function scanProjects(baseDir) {
    const projects = [];
    
    if (!fs.existsSync(baseDir)) {
        console.warn(`Projects directory not found: ${baseDir}`);
        return projects;
    }
    
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });
    
    for (const entry of entries) {
        if (entry.isDirectory()) {
            const projectPath = path.join(baseDir, entry.name);
            const contentFile = path.join(projectPath, 'content.json');
            
            // Check if this directory contains a content.json file
            if (fs.existsSync(contentFile)) {
                try {
                    const content = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
                    const project = {
                        id: entry.name,
                        title: content.title || entry.name,
                        path: `projects/${entry.name}/`,
                        feeds: []
                    };
                    
                    // Scan for feed files
                    const feedsDir = path.join(projectPath, 'feeds');
                    if (fs.existsSync(feedsDir)) {
                        const feedFiles = fs.readdirSync(feedsDir)
                            .filter(file => file.endsWith('.json'))
                            .sort();
                        project.feeds = feedFiles;
                    }
                    
                    // Add optional metadata if available
                    if (content.description) {
                        project.description = content.description;
                    }
                    if (content.version) {
                        project.version = content.version;
                    }
                    if (content.status) {
                        project.status = content.status;
                    }
                    if (content.tags && Array.isArray(content.tags)) {
                        project.tags = content.tags;
                    }
                    
                    projects.push(project);
                    console.log(`✓ Found project: ${project.title} (${project.id})`);
                    
                } catch (error) {
                    console.warn(`⚠ Error reading content.json for ${entry.name}:`, error.message);
                }
            }
        }
    }
    
    return projects;
}

/**
 * Generate the sitemap object
 */
function generateSitemap() {
    const projects = scanProjects(PROJECTS_DIR);
    
    // Sort projects by title
    projects.sort((a, b) => a.title.localeCompare(b.title));
    
    return {
        last_updated: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        generated_at: new Date().toISOString(),
        total_projects: projects.length,
        projects: projects,
        meta: {
            generator: 'Digital Asset Repository Sitemap Generator',
            version: '1.0.0',
            description: 'Auto-generated project index for static content repository'
        }
    };
}

/**
 * Write sitemap to file
 */
function writeSitemap(sitemap) {
    try {
        const jsonString = JSON.stringify(sitemap, null, 2);
        fs.writeFileSync(OUTPUT_FILE, jsonString, 'utf8');
        console.log(`✓ Sitemap generated: ${OUTPUT_FILE}`);
        console.log(`✓ Projects indexed: ${sitemap.total_projects}`);
        return true;
    } catch (error) {
        console.error('✗ Error writing sitemap:', error.message);
        return false;
    }
}

/**
 * Validate the generated sitemap
 */
function validateSitemap(sitemap) {
    const errors = [];
    
    if (!sitemap.projects || !Array.isArray(sitemap.projects)) {
        errors.push('Missing or invalid projects array');
    }
    
    for (const project of sitemap.projects || []) {
        if (!project.id) {
            errors.push(`Project missing id: ${JSON.stringify(project)}`);
        }
        if (!project.title) {
            errors.push(`Project missing title: ${project.id}`);
        }
        if (!project.path) {
            errors.push(`Project missing path: ${project.id}`);
        }
    }
    
    if (errors.length > 0) {
        console.error('✗ Sitemap validation failed:');
        errors.forEach(error => console.error(`  - ${error}`));
        return false;
    }
    
    console.log('✓ Sitemap validation passed');
    return true;
}

/**
 * Main execution
 */
function main() {
    console.log('🚀 Generating sitemap for Digital Asset Repository...\n');
    
    const sitemap = generateSitemap();
    
    if (!validateSitemap(sitemap)) {
        process.exit(1);
    }
    
    if (!writeSitemap(sitemap)) {
        process.exit(1);
    }
    
    console.log('\n📋 Sitemap Summary:');
    console.log(`   Total Projects: ${sitemap.total_projects}`);
    console.log(`   Generated: ${sitemap.generated_at}`);
    
    if (sitemap.projects.length > 0) {
        console.log('\n📦 Projects:');
        sitemap.projects.forEach(project => {
            const feedsInfo = project.feeds.length > 0 ? ` (${project.feeds.length} feeds)` : '';
            console.log(`   - ${project.title}${feedsInfo}`);
        });
    }
    
    console.log('\n✅ Sitemap generation complete!');
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    scanProjects,
    generateSitemap,
    writeSitemap,
    validateSitemap
};
