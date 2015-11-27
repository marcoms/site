"use strict";

const gulp = require("gulp");

const metalsmith = require("metalsmith");
const metalLayouts = require("metalsmith-layouts");
const metalPostcss = require("metalsmith-postcss");
const metalHtmlMin = require("metalsmith-html-minifier");
const metalCleanCss = require("metalsmith-clean-css");

const postcssImport = require("postcss-import");
const postcssSimpleVars = require("postcss-simple-vars");
const postcssSize = require("postcss-size");
const autoprefixer = require("autoprefixer");

const METALSMITH_DIR = __dirname + "/_metalsmith";

gulp.task("default", ["build"]);

gulp.task("build", () => {
	metalsmith(METALSMITH_DIR)
	.use(metalLayouts({
		engine: "handlebars",
		default: "layout.hbs",
		directory: "layouts",
		partials: "partials",
		pattern: ["*.html"],
	}))

	.use(metalPostcss([
		postcssImport({
			path: `${METALSMITH_DIR}/src/css`,
		}),

		postcssSimpleVars(),
		postcssSize(),
		autoprefixer,
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
