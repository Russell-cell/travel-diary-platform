// 引入 mongoose 
const mongoose = require('mongoose')

// 连接数据库，自动新建 ExpressApi 库
mongoose.connect('mongodb://192.168.171.218:27017/Travels')
.then(() => {
  console.log('数据库连接成功');
})
.catch(err => {
  console.error('数据库连接失败:', err);
});

module.exports = mongoose