<template>
  <div class="user-chat">
    <!-- 头部 -->
    <van-nav-bar
      title="小智同学"
      left-arrow
      class="app-nav-bar"
      @click-left="$router.back()"
    >
    </van-nav-bar>
    <!-- 消息区域 -->
    <!-- 确保每次发消息都滚动到最底部 -->
    <van-cell-group class="message-list" ref="message-list">
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
      <van-cell title="哈哈哈"></van-cell>
    </van-cell-group>
    <!-- 发送区域 -->
    <van-cell-group class="sen-message-wrap">
      <van-field v-model="message" placeholder="请输入发生内容" />
      <van-button type="primary" size="small">发送</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { setItem, getItem } from '@/utils/storage'
// 建立连接
// const socket = io('http://ttapi.research.itcast.cn/')
// // 成功连接
// socket.on('connect', function () {
//   console.log('连接建立成功')
// })

// 发送消息
// socket.emit('消息类型',消息内容)
// 就是消息
// socket.on('消息类型',function (data) {data消息})

// // 断开连接
// socket.on('disconnect', function () {
//   console.log('断开连接')
// })

export default {
  name: 'UserChat',
  data () {
    return {
      message: '',
      socket: null, // WebSocket 通信对象
      messages: getItem('chat-messages') || [] // 消息列表
    }
  },
  wathch: {
    messages () {
      setItem('chat-messages', this.messages)
      // 数据改变影响视图更新这件事不是立即的，所以要用nextTick
      // 如果你要在操作之后立即操作数据影响的视图DOM，那么最后把代码放到nextTick函数中
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  created () {
    const socket = io('http://ttapi.research.itcast.cn')
    // 成功连接
    socket.on('connect', function () {
      console.log('连接建立成功')
    })
    // 断开连接
    socket.on('disconnect', function () {
      console.log('断开连接')
    })
    // 监听 message 事件，接收服务器端消息
    socket.on('message', (data) => {
      // 把对方发给我的消息存储到数组中
      this.messages.push(data)
    })
  },
  mounted () {
    // 一上来就让滚动条在最上面
    this.scrollToBottom()
  },
  methods: {
    // 请求发送消息
    onSend () {
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      // message是接口要求的
      // 发送与接收消息的事件(event) 均为message
      this.socket.emit('message', data)
      // 把用户发出去的消息存储到数组中
      this.messages.push(data)
      // 清空输入框
      this.message = ''
    },
    scrollToBottom () {
      const list = this.$refs['message-list']
      list.scrollTop = list.scrrollHeight
    }
  }
}
</script>

<style lang="less" scoped>
.user-chat {
  .sen-message-wrap {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    padding: 0 14px;
    align-items: center;
  }
  .message-list {
    position: fixed;
    right: 0;
    left: 0;
    top: 46px;
    bottom: 44px;
    overflow-y: auto;
  }
}
</style>
