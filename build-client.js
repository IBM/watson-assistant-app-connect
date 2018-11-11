'use strict';

const child_process = require('child_process');

const options = {
  stdio : 'inherit',
  cwd : 'client',
  shell : true
};

child_process.spawn('npm', ['run', 'build'], options);
