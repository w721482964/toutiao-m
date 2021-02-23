<template>
  <div class="update-birth">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserBirth } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirth',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '修改中',
        forbidClick: true
      })
      // const date = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${this.currentDate.getDate()}`
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')
      await updateUserBirth({
        birthday: date
      })
      this.$emit('input', date)
      this.$emit('close')
      this.$toast.success('修改成功')
    }
  }
}
</script>

<style>
</style>
