<template>
  <div class="login-container">
    <!-- 头部 -->
    <van-nav-bar title="注册/登录" left-arrow class="app-nav-bar">
    </van-nav-bar>
    <!-- 登录表单 -->
    <!--
      基于 Vant 的表单验证
      1.使用van-form组件包裹所有的表单项 van-field
      2.给van-form绑定submit事件 提示：只有表单验证通过，才会调用submit
      3.使用 Field 的rules属性定义校验规则
     -->
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="formRef"
      @submit="onLogin()"
      @failed="onFailed"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        name="mobile"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        name="code"
        :rules="formRules.code"
      >
        <template #button>
          <van-button
            :loading="isSendSmsLoading"
            v-if="isCountDownShow === true"
            class="sendBtn"
            size="small"
          >
            <van-count-down
              :time="60 * 1000"
              format="ss s"
              @finish="isCountDownShow = false"
          /></van-button>
          <van-button
            :loading="isSendSmsLoading"
            v-else
            class="sendBtn"
            size="small"
            @click.prevent="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" block>登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
// import { Toast } from 'vant'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '17090086870',
        code: '246810'
      },
      // 定义表单验证规则对象
      formRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          {
            pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误', trigger: 'onBlur'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          {
            pattern: /^\d{6}$/, message: '验证码格式错误', trigger: 'onBlur'
          }
        ]
      },
      isCountDownShow: false, // 控制倒计时和发送按钮的显示状态
      isSendSmsLoading: false // 发送验证码按钮的loading状态
    }
  },
  created () { },
  methods: {
    async onLogin () {
      this.$toast.loading({
        message: '登陆中...',
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 展示时长（ms） 值为0时，toast不会消失
      })
      // 1.找到数据接口
      // 2.封装请求方法
      // 3.请求调用登录
      try {
        const { data } = await login(this.user)
        // 4.处理响应结果
        console.log(data)
        this.$toast.success('登录成功')
        // 将后端返回的数据状态（token等数据）放到vuex容器中
        this.$store.commit('setUser', data.data)

        // 登录成功之前，清除缓存
        this.$store.commit('removeCachePage', 'LayoutIndex')

        // 登录成功，调整到原来的页面
        // this.$router.back() // 先用这种方式，但是不太好
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        // console.log(err)
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    },
    onFailed (error) {
      console.log(error)
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: 'top'
        })
      }
    },
    // 发送验证码按钮
    async onSendSms () {
      // 校验手机号码
      try {
        await this.$refs.formRef.validate('mobile')
        // 验证通过，请求发送验证码
        this.isSendSmsLoading = true
        await sendSms(this.user.mobile)
        // 短信发出去了，隐藏发送按钮，显示倒计时
        this.isCountDownShow = true
        // 倒计时结束 -> 隐藏倒计时，显示发送按钮（减少倒计时的 finish 事件处理）
      } catch (err) {
        // try里面任何代码的错误都会进入 catch
        // 不同的错误需要有不同的提示，那就需要判断了
        let message = ''
        if (err && err.response && err.response.status === 429) {
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        this.$toast({
          message: message,
          position: 'top'
        })
      }
      // 无论发送验证码成功还是失败，最后都要关闭发送按钮的loading状态
      this.isSendSmsLoading = false
      // 验证通过->请求发送验证码->用户接收短信->输入验证码->请求登录
      // 请求发送验证码->隐藏发送按钮，显示倒计时
      // 倒计时结束->隐藏倒计时，显示发送按钮
    }
  }
}
</script>

<style lang='less' scoped>
.login-container {
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
  .sendBtn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
  .van-cell {
    align-items: center;
  }
}
</style>
