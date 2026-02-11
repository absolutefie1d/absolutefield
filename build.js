const fs = require('fs');
const path = require('path');

// ===== MARKDOWN FRONTMATTER PARSER =====
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    return null;
  }
  
  const frontmatter = {};
  const frontmatterLines = frontmatterMatch[1].split('\n');
  
  frontmatterLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Parse booleans
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      
      frontmatter[key] = value;
    }
  });
  
  frontmatter.body = frontmatterMatch[2].trim();
  
  return frontmatter;
}

// ===== BUILD JOURNAL JSON =====
function buildJournalJson() {
  const journalDir = path.join(__dirname, 'content', 'journal');
  const outputPath = path.join(__dirname, 'data', 'journal.json');
  
  if (!fs.existsSync(journalDir)) {
    console.log('ℹ️ No journal content folder found');
    return;
  }
  
  const files = fs.readdirSync(journalDir).filter(f => f.endsWith('.md'));
  const entries = [];
  
  files.forEach(file => {
    const filePath = path.join(journalDir, file);
    const data = parseMarkdownFile(filePath);
    
    if (data) {
      entries.push({
        title: data.title || 'Untitled',
        date: data.date || '',
        excerpt: data.excerpt || '',
        image: data.image || '',
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        body: data.body || ''
      });
    }
  });
  
  // Sort by date, newest first
  entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
  console.log(`✅ Built journal.json (${entries.length} entries)`);
}

// ===== BUILD PHOTOGRAPHY JSON =====
function buildPhotographyJson() {
  const photoDir = path.join(__dirname, 'content', 'photography');
  const outputPath = path.join(__dirname, 'data', 'photography.json');
  
  if (!fs.existsSync(photoDir)) {
    console.log('ℹ️ No photography content folder found');
    return;
  }
  
  const files = fs.readdirSync(photoDir).filter(f => f.endsWith('.md'));
  const photos = [];
  
  files.forEach(file => {
    const filePath = path.join(photoDir, file);
    const data = parseMarkdownFile(filePath);
    
    if (data) {
      photos.push({
        image: data.image || '',
        caption: data.caption || '',
        date: data.date || '',
        category: data.category || '',
        featured: data.featured === true || data.featured === 'true'
      });
    }
  });
  
  // Sort by date, newest first
  photos.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  fs.writeFileSync(outputPath, JSON.stringify(photos, null, 2));
  console.log(`✅ Built photography.json (${photos.length} photos)`);
}

// ===== CSV PARSER =====
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      rows.push(row);
    }
  }
  return rows;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

// ===== PROCESS STORYGRAPH DATA =====
function processStorygraphData(rows) {
  const booksByRating = {
    '5star': [],
    '4.5star': [],
    '4star': [],
    '3.5star': [],
    '3star': [],
    '2star': [],
    '1star': [],
    'dnf': []
  };
  
  let totalRead = 0;
  let currentlyReading = [];
  let tbr = 0;
  let booksRead2026 = 0;
  
  rows.forEach(row => {
    const status = row['Read Status'] || '';
    const title = row['Title'] || '';
    const author = row['Authors'] || '';
    const rating = parseFloat(row['Star Rating'] || '0');
    const dateRead = row['Last Date Read'] || '';
    
    const book = { title, author };
    
    if (status === 'read') {
      totalRead++;
      
      // Check if read in 2026
      if (dateRead && dateRead.includes('2026')) {
        booksRead2026++;
      }
      
      // Sort by rating
      if (rating >= 5) {
        booksByRating['5star'].push(book);
      } else if (rating >= 4.5) {
        booksByRating['4.5star'].push(book);
      } else if (rating >= 4) {
        booksByRating['4star'].push(book);
      } else if (rating >= 3.5) {
        booksByRating['3.5star'].push(book);
      } else if (rating >= 3) {
        booksByRating['3star'].push(book);
      } else if (rating >= 2) {
        booksByRating['2star'].push(book);
      } else if (rating >= 1) {
        booksByRating['1star'].push(book);
      }
    } else if (status === 'currently-reading') {
      currentlyReading.push(book);
    } else if (status === 'to-read') {
      tbr++;
    } else if (status === 'did-not-finish') {
      booksByRating['dnf'].push(book);
    }
  });
  
  return {
    booksByRating,
    stats: {
      totalRead,
      currentlyReading,
      currentlyReadingCount: currentlyReading.length,
      tbr,
      booksRead2026
    }
  };
}

// ===== GENERATE BOOK DATA JS =====
function generateBookDataJS(data) {
  const { booksByRating, stats } = data;
  
  const ratingLabels = {
    '5star': { title: `★★★★★ 5-Star Books (${booksByRating['5star'].length})`, stars: '★★★★★', label: '5-Star Reads' },
    '4.5star': { title: `★★★★¾ 4.5+ Stars (${booksByRating['4.5star'].length})`, stars: '★★★★¾', label: '4.5+ Stars' },
    '4star': { title: `★★★★ 4-Star Books (${booksByRating['4star'].length})`, stars: '★★★★', label: '4-Star Reads' },
    '3.5star': { title: `★★★½ 3.5-Star Books (${booksByRating['3.5star'].length})`, stars: '★★★½', label: '3.5-Star Reads' },
    '3star': { title: `★★★ 3-Star Books (${booksByRating['3star'].length})`, stars: '★★★', label: '3-Star Reads' },
    '2star': { title: `★★ 2-Star Books (${booksByRating['2star'].length})`, stars: '★★', label: '2-Star Reads' },
    '1star': { title: `★ 1-Star Books (${booksByRating['1star'].length})`, stars: '★', label: '1-Star Reads' },
    'dnf': { title: `✗ Did Not Finish (${booksByRating['dnf'].length})`, stars: '✗', label: 'Did Not Finish' }
  };
  
  const bookData = {};
  Object.keys(booksByRating).forEach(key => {
    if (booksByRating[key].length > 0 || key === 'dnf') {
      bookData[key] = {
        title: ratingLabels[key].title,
        stars: ratingLabels[key].stars,
        label: ratingLabels[key].label,
        books: booksByRating[key]
      };
    }
  });
  
  return { bookData, stats };
}

// ===== UPDATE READING.JSON =====
function updateReadingJson(stats, readingJsonPath) {
  let readingData = {};
  
  try {
    readingData = JSON.parse(fs.readFileSync(readingJsonPath, 'utf8'));
  } catch (e) {
    readingData = {
      books_read_2026: 0,
      goal_2026: 30
    };
  }
  
  // Update with new stats
  readingData.total_read = stats.totalRead;
  readingData.currently_reading_count = stats.currentlyReadingCount;
  readingData.currently_reading = stats.currentlyReading.slice(0, 10); // Max 10
  readingData.tbr_count = stats.tbr;
  readingData.books_read_2026 = stats.booksRead2026;
  readingData.last_updated = new Date().toISOString().split('T')[0];
  
  fs.writeFileSync(readingJsonPath, JSON.stringify(readingData, null, 2));
  console.log('✅ Updated reading.json');
}

// ===== UPDATE BOOKS.JSON =====
function updateBooksJson(bookData, booksJsonPath) {
  fs.writeFileSync(booksJsonPath, JSON.stringify(bookData, null, 2));
  console.log('✅ Updated books.json');
}

// ===== MAIN =====
function main() {
  console.log('🔨 Building content...\n');
  
  // Build journal and photography from markdown
  buildJournalJson();
  buildPhotographyJson();
  
  // Process Storygraph CSV if exists
  const dataDir = path.join(__dirname, 'data');
  const csvPath = path.join(dataDir, 'storygraph.csv');
  const readingJsonPath = path.join(dataDir, 'reading.json');
  const booksJsonPath = path.join(dataDir, 'books.json');
  
  if (!fs.existsSync(csvPath)) {
    console.log('ℹ️ No storygraph.csv found, skipping book data update');
    
    // Create default books.json if it doesn't exist
    if (!fs.existsSync(booksJsonPath)) {
      const defaultBooks = {
        '5star': { title: '★★★★★ 5-Star Books (0)', stars: '★★★★★', label: '5-Star Reads', books: [] },
        'dnf': { title: '✗ Did Not Finish (0)', stars: '✗', label: 'Did Not Finish', books: [] }
      };
      fs.writeFileSync(booksJsonPath, JSON.stringify(defaultBooks, null, 2));
    }
  } else {
    console.log('📚 Processing Storygraph CSV...');
    
    try {
      const csvText = fs.readFileSync(csvPath, 'utf8');
      const rows = parseCSV(csvText);
      console.log(`   Found ${rows.length} books`);
      
      const processedData = processStorygraphData(rows);
      const { bookData, stats } = generateBookDataJS(processedData);
      
      console.log(`   📖 Total read: ${stats.totalRead}`);
      console.log(`   📚 Currently reading: ${stats.currentlyReadingCount}`);
      console.log(`   📋 TBR: ${stats.tbr}`);
      console.log(`   🎯 Read in 2026: ${stats.booksRead2026}`);
      
      updateReadingJson(stats, readingJsonPath);
      updateBooksJson(bookData, booksJsonPath);
    } catch (error) {
      console.error('❌ Error processing CSV:', error.message);
    }
  }
  
  console.log('\n✅ Build complete!');
}

main();
