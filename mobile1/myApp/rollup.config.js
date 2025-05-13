import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  external: ['react-native', 'react-native-collapsible-tab-view'],
  plugins: {
    commonjs: {
      include: ['node_modules/**']
    },
    resolve: nodeResolve({
      extensions: ['.js', '.ts', '.tsx', '.json']  // 确保正确解析扩展名
    })
  }
};