module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.medicmode.com',  
    generateRobotsTxt: true,  // Optionally generate a robots.txt file
    sitemapSize: 7000,  // Set maximum number of URLs per sitemap
    changefreq: 'daily',  // Set the frequency of changes (e.g., 'daily', 'weekly')
    priority: 0.7,  // Set the priority for pages
    exclude: ['/exclude'],  // Exclude specific paths from being included in the sitemap
  };
  