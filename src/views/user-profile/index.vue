<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <input
      type="file"
      hidden
      ref="file"
      accept="image/*"
      @change="onFileChange"
    />
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image width="36" height="36" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      is-link
      :value="user.name"
      @click="isEditNameShow = true"
    ></van-cell>
    <van-cell
      title="性别"
      is-link
      :value="user.gender === 1 ? '女' : '男'"
      @click="isEditGenderShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      is-link
      :value="user.birthday"
      @click="isEditBirthDayShow = true"
    ></van-cell>

    <!-- 修改昵称弹出框 -->
    <van-popup
      v-model="isEditNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 当你传递给子组件的数据既要使用又要修改,例如这里的name
    这种情况下我们可以使用 v-model 简写 -->
      <!--
        :name="user.name"
        @update-name="user.name = $event"
         -->
      <!-- v-model="user.name"
        默认传递一个名字叫 value 的数据 :value="user.name"
        默认监听 input 事件 @input="user.name = $event"
        v-model 的本质还是父子组件通信,它不仅仅是简化了父组件的使用
        子组件接收时也要用value接收 传递时要input
        v-model 只能使用一次
      -->

      <!-- 如果有多个数据需要保持同步，使用 .sync 修饰符
        :gender="user.gender"
        @update-gender="user.gender = $event"

        :gender.sync="user.gender"
         :gender="user.gender"
         @update:gender="user.gender = $event"
         @update:属性名称="user.gender = $event"

      我们一般把最常用的数据设计为 v-model 绑定
      把不常用的数据设计为 .sync
       -->
      <!-- 使用v-if让组件重新渲染 -->
      <UpdateName
        v-if="isEditNameShow"
        v-model="user.name"
        @close="isEditNameShow = false"
      />
    </van-popup>

    <!-- 修改性别弹出框 -->
    <van-popup v-model="isEditGenderShow" position="bottom">
      <UpdateGender
        v-if="isEditGenderShow"
        @close="isEditGenderShow = false"
        v-model="user.gender"
    /></van-popup>

    <!-- 修改生日弹出框 -->
    <van-popup v-model="isEditBirthDayShow" position="bottom">
      <UpdateBirth
        v-if="isEditBirthDayShow"
        v-model="user.birthday"
        @close="isEditBirthDayShow = false"
      />
    </van-popup>

    <!-- 预览头像弹出框 -->
    <van-popup
      class="preview"
      v-model="isEditPhotoShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <UpdatePhoto
        v-if="isEditPhotoShow"
        :file="previewImage"
        @updatePhoto="user.photo = $event"
        @close="isEditPhotoShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirth from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfileIndex',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirth,
    UpdatePhoto
  },
  data () {
    return {
      user: {}, // 用户资料数据对象
      isEditNameShow: false, // 控制修改昵称弹出框的显示与隐藏
      isEditGenderShow: false,
      isEditBirthDayShow: false,
      isEditPhotoShow: false,
      previewImage: null
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    onFileChange () {
      // 在弹出层里面预览图片
      const file = this.$refs.file.files[0]
      this.previewImage = file
      // 展示弹出层
      this.isEditPhotoShow = true
      // 为了解决相同文件不触发 change事件，所有在这里手动的清空 file 的value
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  background-color: #f5f7f9;
}
.preview {
  background-color: #000;
}
</style>
