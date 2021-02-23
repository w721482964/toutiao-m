<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <div class="name-field-wrap">
      <van-field
        v-model="loaclName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
    <!-- <button @click="$emit('update:gender', 0)">点击</button> -->
  </div>
</template>

<script>
import { updateUserName } from '@/api/user'
export default {
  name: 'UpdateName',
  props: {
    value: {
      // props里面的数据除了对象和数组,其他都不能直接修改
      type: String,
      required: true
    }
    // gender: {
    //   type: Number
    // }
  },
  data () {
    return {
      loaclName: this.value
    }
  },
  created () {

  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true // 禁止背景点击
      })
      try {
        // 请求提交更新用户昵称
        await updateUserName({
          name: this.loaclName
        })
        // 更新成功 -> 修改父组件的 name -> 关闭弹出层
        this.$emit('close')
        this.$emit('input', this.loaclName)
        this.$toast.success('修改成功')
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.update-name {
  .name-field-wrap {
    padding: 10px;
  }
}
</style>
