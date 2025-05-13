// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    [
      'taro',
      {
        framework: 'react',
        ts: true
      }
    ]
  ],
  plugins: [
    // 移除Flow相关插件，改用类型剥离
    ['@babel/plugin-transform-flow-strip-types', {
      ignoreExtensions: true  // 完全忽略.flow扩展名
    }]
  ]
};
