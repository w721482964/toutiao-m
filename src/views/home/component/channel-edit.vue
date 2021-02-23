<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="title">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        size="mini"
        round
        plain
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        :class="['grid-item', index === active ? 'active-light' : '']"
        v-for="(value, index) in userChannel"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        :key="index"
        :text="value.name"
        @click="onUserChannelClick(value, index)"
      />
    </van-grid>

    <van-cell center :border="false">
      <div slot="title" class="title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { setItem } from '@/utils/storage'
import { mapState } from 'vuex'
export default {
  name: 'ChannelEdit',
  props: {
    userChannel: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道列表
      isEdit: false
    }
  },
  created () {
    this.loadingAllChannels()
  },
  computed: {
    ...mapState(['user']),
    // 推荐的频道列表
    // 计算属性会观察内部依赖数据的变化而重新求值
    recommendChannels () {
      /**
       * 思路：所有频道 - 我的频道 = 剩下的推荐频道
       * filter方法：过滤数据，根据方法返回的布尔值 true 来收集数据
       * filter方法查找满足添加的所有元素
       */
      return this.allChannels.filter(channel => {
        // 判断channel时否属于用户频道
        // find方法查找满足条件的单个元素
        return !this.userChannel.find(userchannel => {
          // 找到满足该条件的元素
          return userchannel.id === channel.id
        })
      })
    }
  },
  methods: {
    async loadingAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAdd (channel) {
      this.userChannel.push(channel)
      // 数据持久化
      if (this.user) {
        // 登录了，数据存储到线上
        const res = await addUserChannel({
          channels: [
            {
              id: channel.id,
              seq: this.userChannel.length
            }
          ]
        })
        console.log(res)
      } else {
        // 没有登录，数据存储到本地
        setItem('user-channels', this.userChannel)
      }
    },
    onUserChannelClick (channel, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态 删除频道
        this.deleteChannel(channel, index)
      } else {
        // 非编辑状态 切换频道
        this.switchChannel(index)
      }
    },
    // 删除频道
    async deleteChannel (channel, index) {
      this.userChannel.splice(index, 1)
      if (index <= this.active) {
        this.$emit('updataactive', this.active - 1)
      }
      // 数据持久化
      if (this.user) {
        // 登录了，持久化到线上
        const res = await deleteUserChannel(channel.id)
        console.log(res)
      } else {
        // 没有登录，持久化到本地
        setItem('user-channels', this.userChannel)
      }
    },
    // 切换频道
    switchChannel (index) {
      console.log(index)
      this.$emit('updataactive', index)
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding-top: 54px;
  .title {
    font-size: 16px;
    color: #333;
  }
  .edit-btn {
    width: 53px;
    height: 24px;
  }
  .grid-item {
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222222;
        margin-top: 0;
      }
    }
    /deep/ .van-icon-clear {
      position: absolute;
      top: -5px;
      right: -5px;
      font-size: 16px;
      color: #333;
    }
  }
  /deep/ .active-light {
    .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>
