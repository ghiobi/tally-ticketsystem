const { CSSPlugin, FuseBox, QuantumPlugin, SassPlugin, WebIndexPlugin } = require('fuse-box')
const { context, src, task } = require('fuse-box/sparky')

const OUTPUT_DIR = 'public'

/* eslint-disable */
context(
  class {
    config () {
      return FuseBox.init({
        homeDir: 'resources/assets',
        target: 'browser@es5',
        sourceMaps: !this.isProduction,
        output: `${OUTPUT_DIR}/$name.js`,
        plugins:[
          this.isProduction && QuantumPlugin({
            treeshake: true,
            uglify: true
          }),
          [SassPlugin(), CSSPlugin()],
          WebIndexPlugin({
            template: 'resources/assets/index.html',
            target: '../resources/views/layouts/index.edge',
          })
        ],
        useTypescriptCompiler: true
      })
    }
  },
)

task("bundle:dev", (context) => {
  context.isProduction = false
  const fuse = context.config()

  fuse.dev()
  fuse
    .bundle('app')
    .watch()
    .hmr()
    .instructions(' > index.js')

  fuse.run()
})

task("bundle:prod", (context) => {
  context.isProduction = true
  const fuse = context.config()

  fuse
    .bundle('app')
    .instructions(' > index.js')

  fuse.run()
})

task("clean", async () => {
  await src("./public")
    .clean("public/")
    .exec();
});

task("default", ["clean", "bundle:dev"])
task("prod", ["clean", "bundle:prod"])
