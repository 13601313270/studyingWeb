const pkg = require('./package.json');
const { exec } = require('child_process');
console.log(pkg.version)
const name = "pack" + (pkg.version.replaceAll('.', '_')) + '.zip';
exec(`cat > dist/manifest.json <<EOF
{
    "version": "${pkg.version}",
    "file": "${name}"
}
EOF`)
