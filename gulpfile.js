"use strict";

const gulp = require("gulp");

const metalsmith = require("metalsmith");
const metalLayouts = require("metalsmith-layouts");
const metalPostcss = require("metalsmith-postcss");
const metalHtmlMin = require("metalsmith-html-minifier");
const metalCleanCss = require("metalsmith-clean-css");

const cssImport = require("postcss-import");
const cssSimpleVars = require("postcss-simple-vars");
const cssSize = require("postcss-size");
const cssEasings = require("postcss-easings");
const cssPrefixer = require("autoprefixer");

const METALSMITH_DIR = __dirname + "/metalsmith";

gulp.task("default", ["build"]);

gulp.task("build", () => {
	metalsmith(METALSMITH_DIR)
	.ignore("**/img/**/.git")
	.use(metalLayouts({
		engine: "handlebars",
		default: "base.hbs",
		directory: "layouts",
		partials: "partials",
		pattern: ["*.html"],
	}))

	.use(metalPostcss([
		cssImport({
			path: `${METALSMITH_DIR}/src/css`,
		}),

		cssSimpleVars(),
		cssSize(),
		cssEasings(),
		cssPrefixer({browsers: ["last 3 versions"]}),
	]))

	.use(metalHtmlMin({
		keepClosingSlash: true,
	}))

	.use(metalCleanCss())

	.clean(false)
	.destination("..")
	.build((error, files) => {
		if (error) {
			console.log(`error: ${error}`);
			process.exit(1);
		}

		const filesList = Object.keys(files);
		console.log(`built ${filesList.length} files`, filesList);
	});
});

gulp.task("watch", ["build"], () => {
	gulp.watch("metalsmith/**/*", ["build"]);
});
