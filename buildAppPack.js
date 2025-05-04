const pkg = require('./package.json');
const { exec } = require('child_process');

console.log(pkg.version)
exec('mkdir appPack')
exec('tar -czvf appPack/pack' + (pkg.version.replaceAll('.', '_')) + '.tar.gz dist')