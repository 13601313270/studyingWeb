const pkg = require('./package.json');
const { exec } = require('child_process');
const semver = require('semver');
const https = require('https');
const getOldManifest = new Promise(resolve => {
  https.get("https://studying1v1-code.oss-cn-beijing.aliyuncs.com/appPackProd/manifest.json", res => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      resolve(data);
    });
  })
})
function build() {
  console.log(pkg.version)
  exec('mkdir appPack')
  const name = "pack" + (pkg.version.replaceAll('.', '_')) + '.zip';
  exec(`cat > appPack/manifest.json <<EOF
{
    "version": "${pkg.version}",
    "file": "${name}"
}
EOF`)
  exec('zip -r appPack/' + name + ' dist')
}
getOldManifest.then(res => {
  console.log('======')
  console.log(res)
  console.log(pkg.version)

  const prodVersion = JSON.parse(res).version;
  console.log(prodVersion)

  if (semver.gt(pkg.version, prodVersion)) {
    console.log('版本验证通过')
    build();
  } else {
    console.log('版本验证不通过，版本号需要高于线上版本' + prodVersion)
    throw new Error('版本验证不通过，版本号需要高于线上版本' + prodVersion);
  }
})
