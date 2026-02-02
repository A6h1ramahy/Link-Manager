import axios from 'axios';
import * as cheerio from 'cheerio';

// Fetch webpage content and metadata
export const fetchWebpageContent = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000, // 10 second timeout
    });

    const $ = cheerio.load(response.data);

    // Extract Open Graph metadata
    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    const ogTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const ogDescription = $('meta[property="og:description"]').attr('content') || 
                          $('meta[name="description"]').attr('content') || '';

    // Extract domain and favicon
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const favicon = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;

    return {
      title: ogTitle,
      description: ogDescription,
      ogImage,
      ogTitle,
      ogDescription,
      domain,
      favicon,
    };
  } catch (error) {
    console.error('Error fetching webpage:', error.message);
    
    // Fallback: extract domain and basic info
    const urlObj = new URL(url);
    return {
      title: urlObj.hostname,
      description: '',
      ogImage: '',
      ogTitle: urlObj.hostname,
      ogDescription: '',
      domain: urlObj.hostname,
      favicon: `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`,
    };
  }
};

// Process link (simplified without AI)
export const processLink = async (url) => {
  try {
    console.log(`📄 Processing link: ${url}`);

    // Fetch webpage content
    const webData = await fetchWebpageContent(url);

    return {
      ...webData,
    };
  } catch (error) {
    console.error('Error processing link:', error.message);
    throw error;
  }
};

