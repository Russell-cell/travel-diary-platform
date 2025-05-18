const express = require('express');
const { Travel } = require('../model/Travel');
const { User } = require('../model/User');
var TravelsRouter = express.Router();
const jwt = require("jsonwebtoken");
const SECRET = 'wufan';
const travelController = require('../controllers/TravelController')


const auth = async (req, res, next) => {
  try {
    const { id } = jwt.verify(req.headers.token, SECRET);  
    req.user = await User.findById(id, { username: 1, avatar: 1, nickname: 1 });
    next();
  } catch (e) {
    return res.send({ message: "token过期了~" });
  }
}

TravelsRouter.get('/getTravels', travelController.getTravels);

TravelsRouter.get('/getDetails', travelController.getDetails);

TravelsRouter.post('/deleteOneTravel', auth, travelController.deleteOneTravel);

TravelsRouter.get('/getMyTravels', auth, travelController.getMyTravels);

TravelsRouter.get('/getCollectedTravels', auth, travelController.getCollectedTravels);

TravelsRouter.get('/getlikedTravels', auth, travelController.getlikedTravels);

TravelsRouter.get('/getDraftTravels', auth, travelController.getDraftTravels);

TravelsRouter.post('/upload', travelController.upload);

TravelsRouter.post('/updateOneTravel', travelController.updateOneTravel);

TravelsRouter.get('/search', travelController.search);

TravelsRouter.post('/collectTravel', auth, travelController.collectTravel);

TravelsRouter.post('/UndoCollectTravel', auth, travelController.UndoCollectTravel);

TravelsRouter.post('/likeTravel', auth, travelController.likeTravel);

TravelsRouter.post('/UndoLikeTravel', auth, travelController.UndoLikeTravel);
 
TravelsRouter.get('/web/getTravels', async (req, res) => {
  try {
    const page = req.query.page - 1;
    const pageSize = req.query.pageSize;
    const beginDate = req.query.beginDate;
    const endDate = req.query.endDate;
    const title = req.query.title;
    const travelState = req.query.travelState;
    let findCon = { travelState: { $nin: [3, 4] } };
    if (title) {
      findCon.title = new RegExp(title, 'i');
    }
    if (beginDate) { //endDate
      findCon.createTime = { $lte: new Date(endDate), $gte: new Date(beginDate) };
    }
    if (travelState) {
      findCon.travelState = { $nin: [3, 4], $eq: travelState };
    }
    // const customOrder = [2, 0, 1];// 2是待审核，0是拒绝，1是通过,3是被删除，4是草稿
    const travels = await Travel.find(findCon, '_id photo title content travelState userInfo createTime rejectedReason')
      .sort({ travelState: -1, _id: -1 })
      .skip(page * pageSize).limit(pageSize)
    res.send({
      message: "获取游记信息成功",
      quantity: await Travel.countDocuments(findCon),
      travels
    })
  } catch (e) {
    console.log(e)
  }
})
 
TravelsRouter.post('/web/passOneTravel', async (req, res) => {
  try {
    await Travel.findOneAndUpdate({ _id: req.body.id }, { travelState: 1 })
    res.send({
      message: "设置游记审核通过成功",
    })
  } catch (e) {
    res.send({
      message: "设置游记审核通过失败",
    })
  }
})

TravelsRouter.post('/web/rejectOneTravel', async (req, res) => {
  try {
    await Travel.findOneAndUpdate({ _id: req.body.id }, { travelState: 0, rejectedReason: req.body.reason })
    res.send({
      message: "设置游记审核不通过成功",
    })
  } catch (e) {
    res.send({
      message: "设置游记审核拒绝失败",
    })
  }
})

TravelsRouter.post('/web/deleteOneTravel', async (req, res) => {
  try {
    await Travel.findOneAndUpdate({ _id: req.body.id }, { travelState: 3 })
    res.send({
      message: "删除游记成功",
    })
  } catch (e) {
    res.send({
      message: "删除游记失败",
    })
  }
})

module.exports = TravelsRouter