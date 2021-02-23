<template>
  <div class="update-gender">
    <van-picker
      title="选择性别"
      show-toolbar
      :columns="columns"
      :default-index="defaultIndex"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onChange"
    />
  </div>
</template>

<script>
import { updateUserGender } from '@/api/user'
export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      defaultIndex: this.value
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '修改中',
        forbidClick: true
      })
      await updateUserGender({
        gender: this.defaultIndex
      })
      this.$emit('close')
      this.$emit('input', this.defaultIndex)
      this.$toast.success('修改成功')
    },
    onChange (picker, value, index) {
      this.defaultIndex = index
    }
  }
}
</script>

<style>
</style>
