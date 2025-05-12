import Taro, { useState } from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import MyDialog from '../../../components/myDialog'

const MyTravelCard = ({ id, photo, title, content, status, location, rejectedReason, fetchTravels }) => {
  // 状态信息匹配逻辑保持不变
  let statusInfo = '';
  if (status === 1) statusInfo = '已通过';
  else if (status === 0) statusInfo = '未通过';
  else if (status === 2) statusInfo = '待审核';
  else if (status === 4) statusInfo = '待发布';

  // 卡片数据对象
  const CardData = { id, photo, title, content, location }

  // 对话框状态控制
  const [visible, setVisible] = useState(false)
  const [rejectVisible, setRejectVisible] = useState(false)

  // 删除功能实现
  const handleDelete = async () => {
    try {
      const token = await getToken()
      await Taro.request({
        url: `${NGROK_URL}/travels/deleteOneTravel`,
        method: 'POST',
        data: { id },
        header: { 'token': token }
      })
      fetchTravels()
      setVisible(false)
    } catch (error) {
      Taro.showToast({ title: '删除失败', icon: 'none' })
    }
  }

  return (
    <View className="travel-card">
      {/* 删除确认对话框 */}
      <MyDialog
        visible={visible}
        onClose={() => setVisible(false)}
        titleText="删除确认"
        dialogText="您确定要删除这篇游记吗？"
        cancelText="取消"
        confirmText="确认"
        handleCancel={() => setVisible(false)}
        handleConfirm={handleDelete}
      />

      {/* 审核未通过对话框 */}
      <MyDialog
        visible={rejectVisible}
        onClose={() => setRejectVisible(false)}
        titleText="未通过审核"
        dialogText={`原因: ${rejectedReason}`}
        cancelText="取消"
        confirmText="重新编辑"
        handleCancel={() => setRejectVisible(false)}
        handleConfirm={() => {
          Taro.navigateTo({ 
            url: '/pages/编辑游记/index',
            params: CardData
          })
          setRejectVisible(false)
        }}
      />

      {/* 内容区域 */}
      <View className="content-container">
        <Image
          src={photo[0].uri}
          mode="aspectFill"
          className="cover-image"
        />
        <View className="text-container">
          <Text className="title" numberOfLines={1}>{title}</Text>
          <Text className="content" numberOfLines={3}>{content}</Text>
        </View>
      </View>

      {/* 底部操作栏 */}
      <View className="action-bar">
        {/* 状态显示区域 */}
        <View className="status-container">
          {status === 0 && (
            <View className="status-wrapper">
              <View className="status-badge reject">
                <Text>{statusInfo}</Text>
              </View>
              <AtIcon 
                value='alert-circle'
                size={20}
                color="#ff4949"
                onClick={() => setRejectVisible(true)}
              />
            </View>
          )}
          {status === 2 && (
  <View 
    className={process.env.TARO_ENV === 'h5' ? 'status-container' : 'status-container-weapp'} 
    style={{ backgroundColor: "rgb(255, 204, 0)" }}
  >
    <Text className="status-text">{statusInfo}</Text>
  </View>
)}

{/* 待发布状态 */}
{status === 4 && (
  <View 
    className={process.env.TARO_ENV === 'h5' ? 'status-container' : 'status-container-weapp'} 
    style={{ backgroundColor: "grey" }}
  >
    <Text className="status-text">{statusInfo}</Text>
  </View>
)}
        </View>

        {/* 操作按钮组 */}
        <View className="button-group">
          <Button className="delete-btn" onClick={() => setVisible(true)}>
            删除
          </Button>
          {status === 1 ? (
            <Button 
              className="detail-btn"
              onClick={() => Taro.navigateTo({ url: `/pages/Detail/index?id=${id}` })}
            >
              详情
            </Button>
          ) : (
            <Button
              className="edit-btn"
              onClick={() => Taro.navigateTo({ 
                url: '/pages/编辑游记/index',
                params: CardData
              })}
            >
              编辑
            </Button>
          )}
        </View>
      </View>
    </View>
  )
}

// SCSS样式（创建travel-card.scss）
`
.travel-card {
  margin: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);

  .content-container {
    padding: 20px;
    display: flex;
    align-items: center;

    .cover-image {
      width: 120px;
      height: 120px;
      border-radius: 8px;
      margin-right: 15px;
    }

    .text-container {
      flex: 1;
      min-width: 0;

      .title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        @include text-ellipsis;
      }

      .content {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
        @include multi-ellipsis(3);
      }
    }
  }

  .action-bar {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #eee;

    .status-container {
      flex: 1;
      
      .status-badge {
        padding: 4px 12px;
        border-radius: 16px;
        display: inline-flex;
        align-items: center;
        
        &.reject { background: #d32f2f; }
        &.pending { background: #ffc107; }
        // 其他状态样式...
      }

      .status-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    }

    .button-group {
      display: flex;
      gap: 12px;

      button {
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        line-height: 1;
        
        &.delete-btn {
          border: 1px solid #d32f2f;
          color: #d32f2f;
        }
        &.detail-btn {
          background: rgb(81,178,127);
          color: white;
        }
        &.edit-btn {
          border: 1px solid #007BFF;
          color: #007BFF;
        }
      }
    }
  }
}
`

export default MyTravelCard