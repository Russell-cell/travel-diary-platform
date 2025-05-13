// 上传处理工具 引入配置好的 multerConfig
const singleUploadMiddleware = require('./single-upload-middleware')
const multiUploadMiddleware = require('./multi-upload-middleware')
const fs = require('fs')
const BaseURL = 'http://192.168.171.218:3000' // 本地开发环境
const imgPath_photo = '/public/photos/'
const imgPath_avatar = '/public/avatarUploads/'
const videoPath = '/public/videos/'
const thumbnailPath = '/public/thumbnails/'
const path = require('path')
const { spawn } = require('child_process'); // 确保正确导入
const handlePath = (dir) => {
  return path.join(__dirname, './', dir)
}

// 检查是否安装了ffmpeg
const checkFFMPEG = async () => {
  try {
    const ffmpeg = spawn('ffmpeg', ['-version']);
    return new Promise((resolve) => {
      ffmpeg.on('close', (code) => {
        resolve(code === 0);
      });
    });
  } catch (error) {
    console.error('ffmpeg检查失败:', error);
    return false;
  }
}

// 使用ffmpeg生成视频缩略图
const generateThumbnail = async (videoPath, thumbnailPath, videoFilename) => {
  try {
    const hasFFMPEG = await checkFFMPEG();
    if (!hasFFMPEG) {
      console.error('未安装ffmpeg，无法生成缩略图');
      return null;
    }

    const thumbnailFilename = path.parse(videoFilename).name + '.jpg';
    const outputPath = path.join(thumbnailPath, thumbnailFilename);
    
    return new Promise((resolve, reject) => {
      // 使用ffmpeg获取视频中间帧作为缩略图
      const ffmpeg = spawn('ffmpeg', [
        '-i', videoPath,
        '-ss', '00:00:01', // 从视频的第1秒开始截取
        '-frames:v', '1',
        '-q:v', '2',
        outputPath
      ]);

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(thumbnailFilename);
        } else {
          reject(new Error(`生成缩略图失败，ffmpeg退出码: ${code}`));
        }
      });
    });
  } catch (error) {
    console.error('生成缩略图错误:', error);
    return null;
  }
};

// 获取视频时长和尺寸
const getVideoMetadata = async (videoPath) => {
  try {
    const hasFFMPEG = await checkFFMPEG();
    if (!hasFFMPEG) {
      console.error('未安装ffmpeg，无法获取视频元数据');
      return { duration: 0, width: 0, height: 0 };
    }

    return new Promise((resolve, reject) => {
      const ffprobe = spawn('ffprobe', [
        '-v', 'error',
        '-show_entries', 'format=duration:stream=width,height',
        '-of', 'json',
        videoPath
      ]);

      let data = '';
      ffprobe.stdout.on('data', (chunk) => {
        data += chunk;
      });

      ffprobe.on('close', (code) => {
        if (code === 0) {
          try {
            const metadata = JSON.parse(data);
            const duration = parseFloat(metadata.format.duration || 0);
            const videoStream = metadata.streams.find(s => s.width && s.height) || {};
            
            resolve({
              duration,
              width: videoStream.width || 0,
              height: videoStream.height || 0
            });
          } catch (e) {
            reject(new Error('解析视频元数据失败'));
          }
        } else {
          reject(new Error(`获取视频元数据失败，ffprobe退出码: ${code}`));
        }
      });
    });
  } catch (error) {
    console.error('获取视频元数据错误:', error);
    return { duration: 0, width: 0, height: 0 };
  }
};

// 对图片进行去重删除和重命名
const hanldeImgDelAndRename = (id, filename, dirPath) => {
  fs.readdir(dirPath, (err, files) => { // 查找该路径下的所有图片文件
    for (let i in files) {  // 循环遍历所有文件
      const currentImgName = path.basename(files[i]) // 当前图片的名称，去除了后缀名的名称
      const imgNameArr = currentImgName.split('.')   // 图片的名称数组：[时间戳, id, 后缀]
      if (imgNameArr[1] === id) {  // 先查询该id命名的文件是否存在，有则删除，id就是用户名
        const currentImgPath = dirPath + '/' + currentImgName  // 当前图片路径，删除这个路径下的图片
        fs.unlink(currentImgPath, (err) => { })
      }
      // 应该可以不重命名
      if (currentImgName === filename) { // 根据新存入的文件名(时间戳.jpg)，找到对应文件，然后重命名为: 时间戳.id.jpeg
        const old_path = dirPath + '/' + currentImgName
        const new_path = dirPath + '/' + imgNameArr[0] + '.' + id + path.extname(files[i])
        fs.rename(old_path, new_path, (err) => { }) // 重命名该文件
      }
    }
  })
}

// 封装上传单图片的接口
function uploadAvatar(req, res) {
  return new Promise((resolve, reject) => {
    singleUploadMiddleware.single('file')(req, res, function (err) {  // 单文件
      if (err) {
        console.log("图片上传出错了");
        reject(err) // 传递的图片格式错误或者超出文件限制大小，就会reject出去
      } else {
        console.log("图片上传成功");
        
        // 检查是否有文件上传
        if (!req.file) {
          console.log("没有上传头像文件，将使用默认头像");
          // 返回默认头像URL
          resolve({
            id: req.body.username,
            img_url: BaseURL + imgPath_avatar + "default_avatar.png"
          });
          return;
        }
        
        // 有文件上传的情况，继续原来的处理逻辑
        // hanldeImgDelAndRename(req.body.username, req.file.filename, handlePath('../../public/avatarUploads')); // 对图片进行去重删除和重命名
        const img = req.file.filename.split('.') // 拼接成完整的服务器静态资源图片路径
        resolve({
          id: req.body.username,
          // 重新返回符合规定的图片链接地址. img[0]是文件名，img[1]是后缀名,req.body.username是用户名
          img_url: BaseURL + imgPath_avatar + img[0] + '.' + img[1]
        })
      }
    })
  })
}
// 封装上传单图片的接口
function updateAvatar(req, res) {
  let returnData = "";
  return new Promise((resolve, reject) => {
    singleUploadMiddleware.single('file')(req, res, function (err) {  // 单文件
      if (err) {
        console.log("图片上传出错了");
        reject(err) // 传递的图片格式错误或者超出文件限制大小，就会reject出去
      } else {
        console.log("图片上传成功");
        // hanldeImgDelAndRename(req.body.username, req.file.filename, handlePath('../../public/avatarUploads')); // 对图片进行去重删除和重命名
        if (!!req.file) {
          const img = req.file.filename.split('.') // 拼接成完整的服务器静态资源图片路径
          returnData = BaseURL + imgPath_avatar + img[0] + '.' + img[1]
        }
        resolve(returnData)
      }
    }
    )
  })
}

// 封装上传多文件的接口
async function uploadMultiPhoto(req, res) {
  let photosData = [];
  let videosData = [];
  
  return new Promise((resolve, reject) => {
    multiUploadMiddleware.array('file', 20)(req, res, async function (err) {  // 最多20个文件
      if (err) {
        console.error("文件上传出错:", err);
        reject(err);
      } else {
        console.log("文件上传成功，开始处理...");
        
        // 安全检查：确保req.files存在且为数组
        if (!req.files || !Array.isArray(req.files)) {
          console.log("没有文件被上传或文件格式错误");
          resolve({ photos: photosData, videos: videosData }); // 返回空数组
          return;
        }
        
        // 跟踪上传的视频数量
        let videoCount = 0;
        
        // 处理上传的文件
        for (let i = 0; i < req.files.length; i++) {
          try {
            const file = req.files[i];
            const fileExt = path.extname(file.originalname).toLowerCase();
            const fileName = file.filename;
            const fileNameWithoutExt = path.parse(fileName).name;
            
            // 判断是图片还是视频
            if (file.mimetype.startsWith('image/')) {
              // 处理图片
              let width = 0;
              let height = 0;
              
              // 从请求体中获取图片尺寸信息
              if (req.body[file.originalname]) {
                try {
                  let dimensionInfo = req.body[file.originalname].split('/');
                  width = parseInt(dimensionInfo[0]) || 0;
                  height = parseInt(dimensionInfo[1]) || 0;
                } catch (e) {
                  console.error('解析图片尺寸错误:', e);
                }
              }
              
              photosData.push({
                uri: BaseURL + imgPath_photo + fileName,
                width: width,
                height: height
              });
              
            } else if (file.mimetype.startsWith('video/')) {
              // 检查是否已有视频
              videoCount++;
              if (videoCount > 1) {
                console.log('只允许上传一个视频，忽略额外的视频');
                // 删除多余的视频文件
                try {
                  fs.unlinkSync(path.join(handlePath('../../public/videos'), fileName));
                } catch (err) {
                  console.error('删除多余视频文件失败:', err);
                }
                continue;
              }
              
              console.log(`处理视频: ${fileName}`);
              
              // 视频文件完整路径
              const videoFilePath = path.join(handlePath('../../public/videos'), fileName);
              
              try {
                // 获取视频元数据
                const metadata = await getVideoMetadata(videoFilePath);
                console.log('视频元数据:', metadata);
                
                // 生成缩略图
                const thumbnailDir = handlePath('../../public/thumbnails');
                const thumbnailName = await generateThumbnail(videoFilePath, thumbnailDir, fileName);
                const thumbnailUrl = thumbnailName ? BaseURL + thumbnailPath + thumbnailName : null;
                
                // 从请求体中获取视频尺寸信息
                let width = metadata.width;
                let height = metadata.height;
                
                if (req.body[file.originalname]) {
                  try {
                    let dimensionInfo = req.body[file.originalname].split('/');
                    if (dimensionInfo.length >= 2) {
                      width = parseInt(dimensionInfo[0]) || width;
                      height = parseInt(dimensionInfo[1]) || height;
                    }
                  } catch (e) {
                    console.error('解析视频尺寸错误:', e);
                  }
                }
                
                videosData.push({
                  uri: BaseURL + videoPath + fileName,
                  thumbnail: thumbnailUrl,
                  duration: metadata.duration,
                  width: width,
                  height: height
                });
                console.log('添加视频数据:', videosData);
              } catch (error) {
                console.error(`处理视频${fileName}失败:`, error);
                // 即使错误，也添加基本的视频信息
                videosData.push({
                  uri: BaseURL + videoPath + fileName,
                  thumbnail: null,
                  duration: 0,
                  width: 0,
                  height: 0
                });
              }
            }
          } catch (error) {
            console.error(`处理文件${i}时出错:`, error);
            // 继续处理下一个文件而不是完全失败
          }
        }
        
        console.log(`成功上传了 ${photosData.length} 张图片和 ${videosData.length} 个视频`);
        resolve({ photos: photosData, videos: videosData });
      }
    });
  });
}

module.exports = { uploadAvatar, uploadMultiPhoto, updateAvatar }