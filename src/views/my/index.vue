<template>
  <div class="my-container">
    <van-cell-group v-if="user" class="my-info">
      <van-cell :border="false" class="base-info" center>
        <van-image
          class="avatar"
          slot="icon"
          width="50"
          height="50"
          round
          fit="cover"
          :src="currentUser.photo"
        />
        <div class="name" slot="title">{{ currentUser.name }}</div>
        <van-button class="updata-btn" size="small" round>编辑资料</van-button>
      </van-cell>
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">123</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">123</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">123</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">123</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <!-- 未登录 -->
    <div v-else class="not-login">
      <div @click="$router.push('/login')">
        <div class="mobile">
          <img src="./shouji.png" alt="" />
        </div>
        <div class="text">登录 / 注册</div>
      </div>
    </div>

    <van-grid class="nav-grid mb-4" clickable :column-num="2">
      <van-grid-item class="nav-grid-item" icon="star-o" text="收藏" />
      <van-grid-item class="nav-grid-item" icon="clock-o" text="历史" />
    </van-grid>
    <van-cell title="消息通知" is-link to="" />
    <van-cell class="mb-4" title="小智同学" is-link to="" />
    <van-cell
      v-if="user"
      title="退出登录"
      class="logout-cell"
      @click="onLogout"
    ></van-cell>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'
export default {
  name: 'MyIndex',
  data () {
    return {
      // 当前登录用户信息
      currentUser: {}
    }
  },
  created () {
    this.loadCurrentUser()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 退出登录点击事件
    onLogout () {
      // 提示用户确认退出
      this.$dialog.confirm({
        title: '退出提示',
        message: '确定退出登录吗？'
      })
        .then(() => {
          // on confirm
          // 清除用户登录状态
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
        })
    },
    // 获取用户个人信息
    async loadCurrentUser () {
      const { data } = await getCurrentUser()
      console.log(data)
      this.currentUser = data.data
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .my-info {
    background: url(banner.png) no-repeat;
    background-size: cover;
    .base-info {
      background-color: unset;
      height: 115px;
      box-sizing: border-box;
      padding-top: 38px;
      margin-bottom: 11px;
    }
    .avatar {
      width: 66px;
      height: 66px;
      border: 1px solid #fff;
      box-sizing: border-box;
      margin-right: 11px;
    }
    .name {
      color: #fff;
      font-size: 15px;
    }
    .updata-btn {
      height: 16px;
      font-size: 10px;
      color: #666;
    }
    .data-info {
      text-align: center;
      .data-info-item {
        height: 65px;
        color: #fff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }
    /deep/.van-grid-item__content {
      background-color: unset;
    }
  }
  /deep/.nav-grid {
    .nav-grid-item {
      height: 70px;
      .van-grid-item__text {
        font-size: 14px;
      }
      /deep/ .van-icon-star-o {
        font-size: 22px;
        color: #eb5253;
      }
      /deep/.van-icon-clock-o {
        font-size: 22px;
        color: #ff9d1d;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
  .not-login {
    height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url(banner.png) no-repeat;
    background-size: cover;
    .mobile {
      width: 66px;
      height: 66px;
      box-sizing: border-box;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text {
      font-size: 14px;
      color: #fff;
      margin-top: 6px;
    }
  }
}
</style>
