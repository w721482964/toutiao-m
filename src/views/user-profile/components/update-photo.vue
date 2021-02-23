<template>
  <div class="update-photo">
    <img class="image" :src="image" alt="" ref="image" />
    <van-nav-bar
      left-text="取消"
      right-text="确定"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  props: {
    file: {
      required: true
    }
  },
  data () {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null // 裁切器实例
    }
  },
  created () {

  },
  mounted () {
    // 获取需要裁切的图片DOM
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      // autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
    console.log(this.cropper)
  },
  methods: {
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file)
        })
      })
    },

    async onConfirm () {
      this.$toast.loading({
        message: '修改中',
        forbidClick: true,
        duration: 0 // 展示时间，0表示持续展示
      })
      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)
      // 如果要求 Contetn-Type 是 multipart/form-data，则一定要提交 FormData数据对象，专门用户文件上传的，不能提交{}
      // const fd = new FormData()
      // // fd.append('photo', 文件对象)
      // fd.append('photo', this.file)
      await updateUserPhoto(fd)
      this.$emit('updatePhoto', window.URL.createObjectURL(file))
      this.$emit('close')
      this.$toast.success('修改成功')
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  /deep/.van-nav-bar__text {
    color: #fff;
  }
}
.image {
  display: block;
  max-width: 100%;
}
.update-photo {
  margin-top: 200px;
}
</style>
