## 技术栈
- `Node.js`
- `express`
- `multer`
- `mongoose`
- `jsonwebtoken`
- `bcrypt`

## 项目启动

前提：电脑上需要安装`mongodb`数据库。

1. 进入项目目录`cd server`
2. 安装依赖`npm install`
3. 启动项目`npm run start`

## API 接口文档

### 用户相关接口

#### 用户登录
- **URL**: `/users/login`
- **方法**: POST
- **请求参数**:
  ```json
  {
    "username": "用户名",
    "password": "密码"
  }
  ```
- **响应**:
  ```json
  {
    "message": "登录成功",
    "user": {
      "_id": "用户ID",
      "username": "用户名",
      "nickname": "昵称",
      "avatar": "头像URL"
    }
  }
  ```
- **说明**: 登录成功后会在响应头中返回 Authorization 字段，包含 JWT token

#### 用户注册
- **URL**: `/users/register`
- **方法**: POST
- **请求参数**: 
  ```json
  {
    "username": "用户名",
    "nickname": "昵称",
    "password": "密码"
  }
  ```
- **文件上传**: 需要上传头像图片，字段名为 `file`
- **响应**: `"注册成功"` 或错误信息

#### 获取用户信息
- **URL**: `/users/getUserInfo`
- **方法**: GET
- **请求头**: 需要包含 token 字段
- **响应**: 
  ```json
  {
    "_id": "用户ID",
    "username": "用户名",
    "nickname": "昵称",
    "avatar": "头像URL",
    "collectTravels": ["收藏的游记ID"],
    "likeTravels": ["点赞的游记ID"],
    "gender": "性别",
    "introduction": "个人简介"
  }
  ```

#### 更新用户信息
- **URL**: `/users/update`
- **方法**: POST
- **请求参数**:
  ```json
  {
    "id": "用户ID",
    "nickname": "昵称",
    "introduction": "个人简介",
    "gender": "性别",
    "avatar": "头像URL"
  }
  ```
- **文件上传**: 可选上传新头像，字段名为 `file`
- **响应**: `{ "message": "更新成功" }` 或 `{ "message": "更新失败" }`

### 游记相关接口

#### 移动端接口

##### 获取游记列表
- **URL**: `/travels/getTravels`
- **方法**: GET
- **请求参数**: 
  - `page`: 页码（从1开始）
  - `pageSize`: 每页数量
- **响应**:
  ```json
  {
    "message": "获取游记信息成功",
    "travels": [
      {
        "_id": "游记ID",
        "photo": ["图片URL"],
        "title": "标题",
        "userInfo": {
          "nickname": "用户昵称",
          "avatar": "用户头像"
        },
        "collectedCount": "收藏数",
        "likedCount": "点赞数"
      }
    ]
  }
  ```

##### 获取游记详情
- **URL**: `/travels/getDetails`
- **方法**: GET
- **请求参数**: `id`: 游记ID
- **响应**:
  ```json
  {
    "message": "获取游记详情成功",
    "travelDetail": {
      "_id": "游记ID",
      "title": "标题",
      "content": "内容",
      "photo": ["图片URL"],
      "userInfo": {
        "nickname": "用户昵称",
        "avatar": "用户头像"
      },
      "location": {
        "country": "国家",
        "province": "省份",
        "city": "城市"
      },
      "createTime": "创建时间",
      "collectedCount": "收藏数",
      "likedCount": "点赞数"
    }
  }
  ```

##### 上传游记
- **URL**: `/travels/upload`
- **方法**: POST
- **请求参数**:
  ```json
  {
    "id": "用户ID",
    "nickname": "用户昵称",
    "avatar": "用户头像",
    "title": "游记标题",
    "content": "游记内容",
    "travelState": "游记状态",
    "country": "国家",
    "province": "省份",
    "city": "城市",
    "collectedCount": "收藏数",
    "likedCount": "点赞数"
  }
  ```
- **文件上传**: 需要上传图片，字段名为 `file`，支持多图上传
- **响应**: `{ "message": "上传成功" }` 或 `"上传失败"`

##### 更新游记
- **URL**: `/travels/updateOneTravel`
- **方法**: POST
- **请求参数**:
  ```json
  {
    "id": "游记ID",
    "title": "游记标题",
    "content": "游记内容",
    "location": "JSON字符串",
    "photo": "JSON字符串"
  }
  ```
- **文件上传**: 可选上传新图片，字段名为 `file`
- **响应**: `{ "message": "更新成功" }` 或错误信息

##### 删除游记
- **URL**: `/travels/deleteOneTravel`
- **方法**: POST
- **请求头**: 需要包含 token 字段
- **请求参数**: `{ "id": "游记ID" }`
- **响应**: `{ "message": "删除成功" }` 或 `{ "message": "删除失败" }`

##### 获取我的游记
- **URL**: `/travels/getMyTravels`
- **方法**: GET
- **请求头**: 需要包含 token 字段
- **响应**:
  ```json
  {
    "message": "获取我的游记成功",
    "MyTravels": [
      {
        "_id": "游记ID",
        "photo": ["图片URL"],
        "title": "标题",
        "content": "内容",
        "travelState": "状态",
        "location": {
          "country": "国家",
          "province": "省份",
          "city": "城市"
        },
        "rejectedReason": "拒绝原因"
      }
    ]
  }
  ```

##### 获取草稿箱游记
- **URL**: `/travels/getDraftTravels`
- **方法**: GET
- **请求头**: 需要包含 token 字段
- **响应**: 与获取我的游记类似

##### 获取收藏的游记
- **URL**: `/travels/getCollectedTravels`
- **方法**: GET
- **请求头**: 需要包含 token 字段
- **响应**:
  ```json
  {
    "message": "获取成功",
    "result": [
      {
        "_id": "游记ID",
        "photo": ["图片URL"],
        "title": "标题",
        "content": "内容",
        "userInfo": {
          "nickname": "用户昵称",
          "avatar": "用户头像"
        }
      }
    ]
  }
  ```

##### 获取点赞的游记
- **URL**: `/travels/getlikedTravels`
- **方法**: GET
- **请求头**: 需要包含 token 字段
- **响应**: 与获取收藏的游记类似

##### 搜索游记
- **URL**: `/travels/search`
- **方法**: GET
- **请求参数**: `query`: 搜索关键词
- **响应**:
  ```json
  {
    "code": 200,
    "msg": "查询成功",
    "data": [
      {
        "_id": "游记ID",
        "title": "标题",
        "content": "内容",
        "photo": ["图片URL"],
        "userInfo": {
          "nickname": "用户昵称",
          "avatar": "用户头像"
        },
        "location": {
          "country": "国家",
          "province": "省份",
          "city": "城市"
        }
      }
    ]
  }
  ```

##### 收藏游记
- **URL**: `/travels/collectTravel`
- **方法**: POST
- **请求头**: 需要包含 token 字段
- **请求参数**: `{ "travelId": "游记ID" }`
- **响应**: `{ "message": "收藏成功" }` 或 `{ "message": "收藏失败" }`

##### 取消收藏
- **URL**: `/travels/UndoCollectTravel`
- **方法**: POST
- **请求头**: 需要包含 token 字段
- **请求参数**: `{ "travelId": "游记ID" }`
- **响应**: `{ "message": "取消收藏成功" }` 或 `{ "message": "取消收藏失败" }`

##### 点赞游记
- **URL**: `/travels/likeTravel`
- **方法**: POST
- **请求头**: 需要包含 token 字段
- **请求参数**: `{ "travelId": "游记ID" }`
- **响应**: `{ "message": "点赞成功" }` 或 `{ "message": "点赞失败" }`

##### 取消点赞
- **URL**: `/travels/UndoLikeTravel`
- **方法**: POST
- **请求头**: 需要包含 token 字段
- **请求参数**: `{ "travelId": "游记ID" }`
- **响应**: `{ "message": "取消点赞成功" }` 或 `{ "message": "取消点赞失败" }`

#### 网页端接口（管理员）

##### 获取游记列表
- **URL**: `/travels/web/getTravels`
- **方法**: GET
- **请求参数**: 
  - `page`: 页码
  - `pageSize`: 每页数量
  - `beginDate`: 开始日期（可选）
  - `endDate`: 结束日期（可选）
  - `title`: 标题关键词（可选）
  - `travelState`: 游记状态（可选）
- **响应**:
  ```json
  {
    "message": "获取游记信息成功",
    "quantity": "总数量",
    "travels": [
      {
        "_id": "游记ID",
        "photo": ["图片URL"],
        "title": "标题",
        "content": "内容",
        "travelState": "状态",
        "userInfo": {
          "nickname": "用户昵称",
          "avatar": "用户头像"
        },
        "createTime": "创建时间",
        "rejectedReason": "拒绝原因"
      }
    ]
  }
  ```

##### 审核通过游记
- **URL**: `/travels/web/passOneTravel`
- **方法**: POST
- **请求参数**: `{ "id": "游记ID" }`
- **响应**: `{ "message": "设置游记审核通过成功" }` 或 `{ "message": "设置游记审核通过失败" }`

##### 审核拒绝游记
- **URL**: `/travels/web/rejectOneTravel`
- **方法**: POST
- **请求参数**: 
  ```json
  {
    "id": "游记ID",
    "reason": "拒绝原因"
  }
  ```
- **响应**: `{ "message": "设置游记审核不通过成功" }` 或 `{ "message": "设置游记审核拒绝失败" }`

##### 删除游记
- **URL**: `/travels/web/deleteOneTravel`
- **方法**: POST
- **请求参数**: `{ "id": "游记ID" }`
- **响应**: `{ "message": "删除游记成功" }` 或 `{ "message": "删除游记失败" }`

## 游记状态说明

- `0`: 审核拒绝
- `1`: 审核通过
- `2`: 待审核
- `3`: 已删除
- `4`: 草稿

## 文件上传说明

- 头像上传：支持 jpg/png/gif 格式，大小限制为 2MB
- 游记图片上传：支持 jpg/png/gif 格式，无大小限制，最多支持20张图片