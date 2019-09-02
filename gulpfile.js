const gulp = require('gulp')
const path = require('path')
const less = require('gulp-less')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const gutil = require('gulp-util')
const plumber = require('gulp-plumber')
const del = require('del')
const oss = require('gulp-oss-sync')

// 获取用户配置
const config = require('./config.js')

// 日志输出
function log() {
  const args = Array.prototype.slice.call(arguments)
  gutil.log.apply(null, args)
}

function watch() {
  const watcher = gulp.watch(['src/**/*.less', '!src/style/**/*.less'], { ignored: /[/\\]\./ })
  return watcher.on('all', lessToWxss)
}

// less to wxss
function lessToWxss(event, file) {
  log(`${gutil.colors.yellow(file)} ${event}, running task...`)
  const filePath = path.dirname(file)
  // console.log(filePath)

  // base 不复制当前文件的目录结构，让文件生成在当前目录中
  gulp.src(file, { allowEmpty: true, base: filePath })
    .pipe(plumber())
    .pipe(less())
    .pipe(replace(/(-?\d+(\.\d+)?)px/gi, (m, num) => {
      return 2 * num + 'rpx' // 替换1px为2rpx， 0.5px为1rpx
    }))
    // 引用assets目录下的资源文件路径替换为cdn线上路径
    .pipe(replace(/(\.+\/){1,}assets/g, () => {
      return config.cdn
    }))
    .pipe(rename({ extname: '.wxss' })) // 修改文件类型
    .pipe(gulp.dest(filePath))
}

// dev 监听文件变化
gulp.task('dev', gulp.series(
  watch
))

// build css
function buildCss() {
  gulp.src(config.css, { allowEmpty: true, base: config.entry })
    .pipe(plumber())
    .pipe(less())
    .pipe(replace(/(-?\d+(\.\d+)?)px/gi, (m, num) => {
      return 2 * num + 'rpx' // 替换1px为2rpx， 0.5px为1rpx
    }))
    // 引用assets目录下的资源文件路径替换为cdn线上路径
    .pipe(replace(/(\.+\/){1,}assets/g, () => {
      return config.cdn
    }))
    .pipe(rename({ extname: '.wxss' })) // 修改文件类型
    .pipe(gulp.dest(config.output))
}
// 复制其它文件
function copyFiles(file) {
  return gulp.src(file, { allowEmpty: true, base: config.entry })
    // 引用assets目录下的资源文件路径替换为cdn线上路径
    .pipe(replace(/(\.+\/){1,}assets/g, () => {
      return config.cdn
    }))
    .pipe(gulp.dest(config.output))
}

// build发布
async function build() {
  await del(config.output)
  await buildCss()
  await copyFiles(['src/**/*', ...config.exclude])
}

// build
gulp.task('build', gulp.series(
  uploadOSS,
  build
))

// 上传oss
function uploadOSS() {
  return gulp.src(config.assets)
    .pipe(oss(config.oss))
}
gulp.task('upload:oss', uploadOSS)
