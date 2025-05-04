const pkg = require('./package.json');
const { exec } = require('child_process');

console.log(pkg.version)
exec('mkdir appPack')
const name = "pack" + (pkg.version.replaceAll('.', '_')) + '.tar.gz';
exec(`cat > appPack/manifest.json <<EOF
{
    "version": "${pkg.version}",
    "file": "${name}"
}
EOF`)
exec('tar -czvf appPack/' + name + ' dist')