/*--- Gulp 4  ----------*/
const { src, dest , watch, series, parallel } = require('gulp');
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const sass = require('gulp-sass')(require('sass'));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const notify = require("gulp-notify");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;

// files
const files = {
    cssPath: "src/**/*.scss",
    jsPath: "src/**/*.js",
};


// CSS
function styles() {
    return src(files.cssPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer, cssnano]))
        .pipe(sourcemaps.write("."))
        .pipe(dest("dist"))
        .pipe(notify("Done!"));
}

// JS
function scripts() {
    return src([files.jsPath])
        .pipe(
            babel({
                presets: ["@babel/preset-env"],
            })
        )
        .pipe(concat("app.js"))
        .pipe(uglify())
        .pipe(dest("dist"))
        .pipe(notify("Done!"));
}


// Images
function images() {
    return src('img/*.{jpg,gif,png}')
        .pipe(dest('dist/img/'));
}


// BrowserSync & Watch

function tasks() {
    watch(
        [files.cssPath, files.jsPath],

        series(parallel(styles, scripts, images))
    ).on("change", reload);

    browserSync.init({
        server: {
            baseDir: './'
        },
        notify: false,
        //  proxy: "yourlocal.dev"
        // open: false,
        // online: false, // Work Offline Without Internet Connection
        // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
    })
}

// Exports
exports.default = series(
    parallel(
        styles,
        scripts,
        images
    ),
    tasks
);
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;