// Compile .scss files in */styles folders
var glob = require("glob");
var chokidar = require("chokidar");
var fs = require("fs");
var CleanCSS = require("clean-css");

var sass = require("node-sass");

const cssClean = file => {
  // File name EX: cmg-meter-dialogue/cmg-meter.scss
  let arr = file.split("/");
  if (arr.length > 1) {
    let fileNameMin = arr[arr.length - 1].replace(".scss", ".css");
    let fileDir = arr[0];
    // 1. Compile SCSS
    sass.render(
      {
        file: `../${file}`
      },
      function(err, result) {
        if (err) {
          console.log(err);
          return;
        }
        let css = result.css.toString();
        // 2. Minify CSS
        let output = new CleanCSS().minify(css);
        fs.writeFile(`../${fileDir}/css/${fileNameMin}`, output.styles, err => {
          if (err) throw err;
          console.log(`🎨 ${fileNameMin} - updated!`);
        });
      }
    );
  }
};

// Files to clean.
let cssFiles = "assets/sass/main.scss";
// Glob options.
let options = {
  cwd: __dirname + "/..",
  ignore: ["tools/**/*.scss", "_*.scss"]
};

// Chokidar options.
let options2 = {
  cwd: __dirname + "/..",
  ignored: ["tools/**/*.scss"],
  ignoreInitial: true
};

const msg = () => {
  console.log(`👀 Watching for changes to ${cssFiles}`);
};

// Main task.
glob(cssFiles, options, function(er, files) {
  files.forEach(file => {
    cssClean(file);
  });
  msg();
});
const doWatch = process.env.npm_config_WATCH;
if (doWatch) {
  // Watch task.
  chokidar.watch(cssFiles, options2).on("all", (event, path) => {
    cssClean(path);
  });
}
