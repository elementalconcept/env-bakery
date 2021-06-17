const fs = require('fs');

fs.copyFileSync('README.md', 'projects/lib/README.md');
fs.copyFileSync('LICENSE', 'projects/lib/LICENSE');
