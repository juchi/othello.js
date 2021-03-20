module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        devtoolModuleFilenameTemplate: 'http://localhost:8080[namespace]/[resource-path]?[loaders]'
    }
}
