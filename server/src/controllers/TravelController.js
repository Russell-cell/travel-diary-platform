const { uploadMultiPhoto } = require('../multer/upload');
const { Travel } = require('../model/Travel');
const { User } = require('../model/User');

class TravelController {
  // 游记信息图片+标题+内容+地点 上传
  async upload(req, res) {
    try {
      const uploadRes = await uploadMultiPhoto(req, res);
      
      // 验证必填项
      if (!req.body.title || !req.body.title.trim()) {
        return res.status(400).send({ message: "请填写标题" });
      }
      
      if (!req.body.content || !req.body.content.trim()) {
        return res.status(400).send({ message: "请填写游记内容" });
      }
      
      // 确保至少有一张图片
      if (!uploadRes.photos || uploadRes.photos.length === 0) {
        return res.status(400).send({ message: "请至少上传一张图片" });
      }
      
      let travel = await Travel.create({
        userId: req.body.id,
        nickname: req.body.nickname,  
        userInfo: { 
          nickname: req.body.nickname, 
          avatar: req.body.avatar 
        },
        title: req.body.title,
        content: req.body.content,
        travelState: req.body.travelState,
        photo: uploadRes.photos || [],
        videos: uploadRes.videos || [], // 添加视频数组
        location: {
          country: req.body.country || "",
          province: req.body.province || "",
          city: req.body.city || ""
        },
        collectedCount: req.body.collectedCount || 0,
        likedCount: req.body.likedCount || 0,
      });
      
      await travel.save();
      res.send({ message: "上传成功", travelId: travel._id });
    } catch (error) {
      console.error("游记上传失败:", error);
      res.status(500).send({ 
        message: "上传失败", 
        error: error.message
      });
    }
  }
  // mobile---分页获取获取所有游记信息(用于首页展示) 
  async getTravels(req, res) {
    try {
      const page = req.query.page - 1;
      const pageSize = req.query.pageSize;
      console.log(req.query.page)
      // 这里之后再加个筛选条件，只返回审核通过后的游记
      // const travels = await Travel.find({travelState: 1}, '_id photo title userInfo').skip(page * pageSize).limit(pageSize)
      const travels = await Travel.find({ travelState: { $eq: 1 } }, '_id photo title userInfo collectedCount likedCount').sort({ '_id': -1 }).skip(page * pageSize).limit(pageSize)
      res.send({
        message: "获取游记信息成功",
        travels
      })
    } catch (e) {
      res.send(e)
    }
  }
  // mobile---由游记的id获取获取游记信息的详情(用于首页的详情页)  
  async getDetails(req, res) {
    try {
      const travelDetail = await Travel.findById(req.query.id).exec();
      res.send({
        message: "获取游记详情成功",
        travelDetail
      })
    } catch (e) {
      res.send(e)
    }
  }
  // mobile--- 由游记id逻辑删除某条游记(需要带上用户的token)，用户只能删除自己的游记，即travelState改为3
  async deleteOneTravel(req, res) {
    try {
      await Travel.findOneAndUpdate({ _id: req.body.id }, { travelState: 3 })
      res.send({
        message: "删除成功",
      })
    } catch (e) {
      res.send({
        message: "删除失败",
      })
    }
  }
  // mobile--- 由用户的token获取获取用户发布的游记(用于我的游记), travelState为3和4的不返回
  async getMyTravels(req, res) {
    try {
      const MyTravels = await Travel.find({ userId: req.user._id, travelState: { $nin: [3, 4] } }, '_id photo title content travelState location rejectedReason videos').sort({ travelState: -1, _id: -1 }).exec();
      if (MyTravels) {
        res.send({
          message: "获取我的游记成功",
          MyTravels
        })
      } else {
        res.send({
          message: "未获取到游记",
        })
      }
    } catch (e) {
      res.send(e)
    }
  }
  async updateOneTravel(req, res) {
    try {
      const uploadRes = await uploadMultiPhoto(req, res);
      console.log("更新上传结果:", uploadRes);
      // 验证必填项
      if (!req.body.title || !req.body.title.trim()) {
        return res.status(400).send({ message: "请填写标题" });
      }
      
      if (!req.body.content || !req.body.content.trim()) {
        return res.status(400).send({ message: "请填写游记内容" });
      }
      
      // 解析现有照片数据
      const newPhotoArray = JSON.parse(req.body.photo || '{"photodata":[]}');
      
      // 解析现有视频数据
      const newVideoArray = JSON.parse(req.body.videos || '{"videodata":[]}');
      
      // 确保合并后至少有一张图片
      const combinedPhotos = [...newPhotoArray.photodata, ...(uploadRes.photos || [])];
      if (combinedPhotos.length === 0) {
        return res.status(400).send({ message: "请至少上传一张图片" });
      }
      
      // 合并旧有和新上传的视频，限制只保留一个
      const combinedVideos = [
        ...(newVideoArray.videodata || []),
        ...(uploadRes.videos || [])
      ].slice(0, 1); // 只保留第一个视频
      
      await Travel.findOneAndUpdate({ _id: req.body.id }, {
        $set: {
          title: req.body.title,
          content: req.body.content,
          location: JSON.parse(req.body.location || '{"country":"","province":"","city":""}'),
          photo: [...newPhotoArray.photodata, ...(uploadRes.photos || [])],
          videos: combinedVideos, // 确保使用正确的字段名 videos
          travelState: 2, // 游记状态改为待审核
          rejectedReason: "", // 清空拒绝原因
          updateTime: new Date()
        }
      });
      
      res.send({ message: "更新成功" });
    } catch (error) {
      console.error("游记更新失败:", error);
      res.status(500).send({ message: "更新失败", error: error.message });
    }
  }
  async getCollectedTravels(req, res) {
    const result = [];
    const userInfo = await User.findById(req.user._id, 'collectTravels').exec()
    if (userInfo.collectTravels) {
      for (let i = 0; i < userInfo.collectTravels.length; i++) {
        result.unshift(await Travel.findById(userInfo.collectTravels[i], '_id photo title content userInfo'))
      }
      res.send({
        message: "获取成功",
        result: result
      })
    } else {
      res.send({
        message: "没有收藏的游记"
      })
    }
  }
  async getlikedTravels(req, res) {
    const result = [];
    const userInfo = await User.findById(req.user._id, 'likeTravels').exec()
    if (userInfo.likeTravels) {
      for (let i = 0; i < userInfo.likeTravels.length; i++) {
        result.unshift(await Travel.findById(userInfo.likeTravels[i], '_id photo title content userInfo'))
      }
      res.send({
        message: "获取成功",
        result: result
      })
    } else {
      res.send({
        message: "没有点赞的游记"
      })
    }
  }
  async getDraftTravels(req, res) {
    try {
      const MyTravels = await Travel.find({ userId: req.user._id, travelState: { $eq: 4 } }, '_id photo title content travelState location videos').sort({ travelState: -1, _id: -1 }).exec();
      if (MyTravels) {
        res.send({
          message: "获取我的游记成功",
          MyTravels
        })
      } else {
        res.send({
          message: "未获取到游记",
        })
      }
    } catch (e) {
      res.send(e)
    }
  }
  async search(req, res) {
    const myQuery = new RegExp(req.query.query, 'i');
    await Travel.find({
      $or: [
        { "title": myQuery },
        { "userInfo.nickname": myQuery },
        { "location.country": myQuery },
        { "location.province": myQuery },
        { "location.city": myQuery }
      ],
      travelState: { $eq: 1 }
    }).then((data) => {
      res.send({
        code: 200,
        msg: '查询成功',
        data
      })
    }).catch((e) => {
      console.log(e)
      res.send({
        code: 500,
        msg: '查询失败'
      })
    })
  }
  async collectTravel(req, res) {
    try {
      await User.findOneAndUpdate({ _id: req.user._id }, { $push: { collectTravels: req.body.travelId } });
      await Travel.findOneAndUpdate({ _id: req.body.travelId }, { $inc: { collectedCount: 1 } })
      res.send({ message: "收藏成功" })
    } catch (e) {
      res.send({ message: "收藏失败" })
    }
  }
  async UndoCollectTravel(req, res) {
    try {
      await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { collectTravels: req.body.travelId } });
      await Travel.findOneAndUpdate({ _id: req.body.travelId }, { $inc: { collectedCount: -1 } })
      res.send({ message: "取消收藏成功" })
    } catch (e) {
      res.send({ message: "取消收藏失败" })
    }
  }
  async likeTravel(req, res) {
    try {
      await User.findOneAndUpdate({ _id: req.user._id }, { $push: { likeTravels: req.body.travelId } });
      await Travel.findOneAndUpdate({ _id: req.body.travelId }, { $inc: { likedCount: 1 } });
      res.send({ message: "点赞成功" })
    } catch (e) {
      res.send({ message: "点赞失败" })
    }
  }
  async UndoLikeTravel(req, res) {
    try {
      await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { likeTravels: req.body.travelId } });
      await Travel.findOneAndUpdate({ _id: req.body.travelId }, { $inc: { likedCount: -1 } })
      res.send({ message: "取消点赞成功" })
    } catch (e) {
      res.send({ message: "取消点赞失败" })
    }
  }
}

module.exports = new TravelController()