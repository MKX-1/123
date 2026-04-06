const path = require('path')
const { build } = require('esbuild')



const args = require('minimist')(process.argv.slice(2))
// 解析命令行参数
// --target 或 -t 指定要构建的包名，默认是 reactivity
// --format 或 -f 指定输出格式，默认是 global

const target = args._[0] || 'reactivity'
const format = args.f || 'global'

const pkg = require(path.resolve(__dirname, `../packages/${target}/package.json`))

const outputFormat = format.startsWith('global')? 'iife' : format === 'cjs'? 'cjs' : 'esm'

const outfile = path.resolve(__dirname,`../packages/${target}/dist/${target}.${format}.js`)

build({
    entryPoints: [path.resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    format: outputFormat,
    bundle: true,
    sourcemap: true,
    globalName: pkg.buildOptions?.name,
    platform: format === 'cjs' ? 'node' : 'browser',
}).then(() => {
    console.log(`[${target}] watch start`)
})