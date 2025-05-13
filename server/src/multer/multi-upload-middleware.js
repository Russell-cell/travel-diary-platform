// 多文件上传中间件
// 1.引入依赖
const multer = require('multer');
const path = require('path') 

// 2. 封装处理路径函数
const handlePath = (dir) => {
  return path.join(__dirname, './', dir)
}

// 创建视频存储目录
const fs = require('fs');
const videoDir = handlePath('../../public/videos');
const photoDir = handlePath('../../public/photos');
const thumbDir = handlePath('../../public/thumbnails');

// 确保目录存在
[videoDir, photoDir, thumbDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`目录创建成功: ${dir}`);
  }
});

// 3. 设置 multer 的配置对象
const storage = multer.diskStorage({
  // 3.1 存储路径
  destination: function(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype==='image/gif') {
      cb(null, photoDir)
    } else if (file.mimetype.startsWith('video/')) {
      // 视频文件
      cb(null, videoDir);
    } else {
      cb({ error: '不支持的文件类型！仅支持图片(jpg/png/gif)和视频(mp4/mov/avi)' })
    }
  },
  //  3.2 存储名称
  filename: function (req, file, cb) {
    // 将图片名称分割伪数组，用于截取图片的后缀
    const fileFormat = file.originalname.split('.')
    // 自定义图片名称
    cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})

// 4. 为 multer 添加配置
const multiUploadMiddleware = multer({
  storage: storage,
  // limits: { fileSize: 2097152 } // 2M，图片大小限制
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB，视频文件大小限制
  fileFilter: function(req, file, cb) {
    // 允许的文件类型
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    
    if ([...allowedImageTypes, ...allowedVideoTypes].includes(file.mimetype)) {
      cb(null, true); // 接受文件
    } else {
      cb(new Error('不支持的文件类型！仅支持jpg/png/gif格式的图片和mp4/mov/avi/webm格式的视频'), false);
    }
  }
})

module.exports = multiUploadMiddleware