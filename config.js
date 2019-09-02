/*
* 默认配置文件
* 也可新建config.custom.js, 会合并覆盖本文件
* */
module.exports = {
  // 入口
  entry: 'src',
  // build导出
  output: 'dist',
  // .css
  css: ['src/**/*.less', 'src/**/*.css'],
  // build cdn地址
  cdn: 'https://cdn.github.com/static/assets',
  // 排除，.wxss通过less生成
  exclude: ['!src/assets/**', '!src/**/*.wxss', '!src/**/*.less'],
  // 需要上传至cdn的静态资源文件
  assets: 'src/assets/**',
  // oss配置信息
  oss: {
    connect: {
      region: 'oss-region',
      accessKeyId: 'accessKeyId',
      accessKeySecret: 'accessKeySecret',
      bucket: 'bucket'
    },
    controls: {
      'headers': {
        'Cache-Control': 'no-cache'
      }
    },
    setting: {
      dir: 'static/assets', // 文件存储oss的对应路径
      noClean: false, // compare with the last cache file to decide if the file deletion is need
      force: true, // ignore cache file and force re-upload all the files
      quiet: true // quiet option for oss deleteMulti operation
    }
  }
}
