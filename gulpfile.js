/* jshint node:true */
'use strict';
// generated on 2015-02-09 using generator-gulp-webapp 0.2.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var minimist = require('minimist');
var options = minimist(process.argv.slice(2));
console.log(options)

gulp.task('styles', function () {
  return gulp.src('app/static/css/*')
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest('.tmp/static/css'));
});

gulp.task('jshint', function () {
 // return gulp.src('app/static/js/**/*.js')
//    .pipe($.jshint())
//    .pipe($.jshint.reporter('jshint-stylish'))
//    .pipe($.jshint.reporter('fail'));
});

gulp.task('ejs', function(){
	return gulp.src('app/templates/*/*')
			.pipe($.ejs())
			.pipe(gulp.dest('.tmp'))
})

gulp.task('html', ['styles', 'ejs'], function () {
  var assets = $.useref.assets({searchPath: '{.tmp/static,app/static}'});
	var revreplace = require('gulp-rev-replace')
  return gulp.src(['.tmp/*/*.html'])
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
	  .pipe($.if(options.rev === true, $.rev())) //Static asset revisioning by appending content hash to filenames unicorn.css → unicorn-098f6bcd.css
	  .pipe(assets.restore())
	  .pipe($.useref())
	  .pipe(revreplace())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('changedir', ['html', 'images', 'fonts', 'extras'], function () {
	gulp.src('static/**/*')
			.pipe(gulp.dest('dist/static'));
});

gulp.task('cleandir', ['changedir'], function () {
	require('del')('static');
});

gulp.task('dir', ['changedir', 'cleandir']);

gulp.task('images', function () {
  return gulp.src(['app/upload/**/*', 'app/static/images/**/*'], {base: 'app'})
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat('app/static/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('connect', function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('.tmp'))
    .use(serveStatic('app'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', serveStatic('bower_components'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'watch'], function () {
  require('opn')('http://localhost:9000');
});

gulp.task('plugins', function () {
	return gulp.src(['app/static/plugin/**/*'], {
		base: 'app'
	}).pipe(gulp.dest('dist'));
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/*.html')
    .pipe(wiredep())
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect'], function () {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/static/css/**/*.css', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build', ['jshint', 'html', 'plugins', 'dir', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
