const {
  CSSPlugin,
  FuseBox,
  QuantumPlugin,
  SassPlugin,
  WebIndexPlugin,
  VueComponentPlugin
} = require('fuse-box')
const { context, src, task } = require('fuse-box/sparky')

const OUTPUT_DIR = 'public'

const SCSS_PLUGINS = [
  SassPlugin({
    importer: true
  }),
  CSSPlugin()
]

/* eslint-disable */
context(
  class {
    config() {
      return FuseBox.init({
        homeDir: 'resources/assets',
        target: 'browser@es5',
        sourceMaps: !this.isProduction,
        output: `${OUTPUT_DIR}/$name.js`,
        plugins: [
          this.isProduction &&
            QuantumPlugin({
              treeshake: true,
              uglify: true,
              css: true
            }),
          SCSS_PLUGINS,
          WebIndexPlugin({
            template: 'resources/assets/index.html',
            target: '../resources/views/layouts/index.edge'
          }),
          VueComponentPlugin({
            style: SCSS_PLUGINS
          })
        ],
        useTypescriptCompiler: true,
        allowSyntheticDefaultImports: true
      })
    }
  }
)

task('bundle:dev', (context) => {
  context.isProduction = false
  const fuse = context.config()

  fuse.dev()
  fuse.bundle('vendor').instructions('~ index.js')
  fuse
    .bundle('app')
    .watch()
    .hmr()
    .instructions('> index.js')

  fuse.run()
})

task('bundle:prod', (context) => {
  context.isProduction = true
  const fuse = context.config()

  fuse.bundle('app').instructions(' > index.js')

  fuse.run()
})

task('clean', async () => {
  await src('./public')
    .clean('public/')
    .exec()
})

task('default', ['clean', 'bundle:dev'])
task('prod', ['clean', 'bundle:prod'])
