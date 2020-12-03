const fs = require('fs')

fs.copyFileSync('./src/config/config.json', './build/config/config.json');
