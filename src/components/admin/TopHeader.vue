<template>
  <div class="header" :class="{upload: uploadShow}">
    <el-row>
      <el-col class="logo" :md="5" :sm="8" :xs="12">
        <router-link to="/">
          <icon-font icon="icon-admin" fontSize="62"></icon-font>
        </router-link>
        <p>后台管理</p>
      </el-col>

      <el-col class="hello" :md="5" :sm="8">
        <p class="time">{{ currentTime }}</p>
        <p class="inform">{{ timeMessage }}</p>
      </el-col>

      <el-col :md="4" :offset="2" class="search">
        <el-input suffix-icon="el-icon-search"></el-input>
      </el-col>

      <el-col :md="8" :sm="8" :xs="12" class="right">
        <el-dropdown trigger="click" class="notice">
          <el-badge is-dot>{{ userInfo.name }}</el-badge>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><el-badge :value="12">评论</el-badge></el-dropdown-item>
            <el-dropdown-item><el-badge :value="9">阅读</el-badge></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" class="user-infor">
          <img :src="`//${avatar || userInfo.avatar}`" alt="">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changeAvatar">更改头像</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <my-upload field="avatar"
      :width="200"
      :height="200"
      v-model="uploadShow"
      :url="uploadUrl"
      @crop-upload-success="cropUploadSuccess"
      img-format="jpg"></my-upload>
  </div>
</template>

<script>
  import IconFont from '@/components/Iconfont'
  import myUpload from 'vue-image-crop-upload'
  import { dateFormat } from '@/common/js/tool.js'
  import { apiUrl } from '@/serviceAPI.config.js'
  export default {
    name: 'Header',
    props: ['userInfo'],
    data() {
      return {
        avatar: 'cl8023-1255423800.cos.ap-guangzhou.myqcloud.com/avatar/default.jpg',
        uploadUrl: apiUrl.upload,
        uploadShow: false,
        currentTime: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        timeMessage: '欢迎光临'
      }
    },
    mounted() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.currentTime = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
      }, 1000)
    },
    methods:{
      changeAvatar() {
        this.uploadShow = true
      },
      logout() {
        this.$http.post(apiUrl.logout).then((res) => {
          this.$router.push('/login');
        })
      },
      cropUploadSuccess(res) {
        this.avatar = res.message.avatar + '?r=' + Math.random()
      }
    },
    watch: {
      currentTime(newTime) {
        const time = new Date(newTime)
        const hour = time.getHours()
        if (hour >= 0 && hour < 5) {
          this.timeMessage = '夜深了，注意休息😪'
        } else if (hour >= 5 && hour < 9) {
          this.timeMessage = '今天又是充满活力的一天🤓️'
        } else if (hour >= 9 && hour < 12) {
          this.timeMessage = '快乐学习，想想中午吃啥🤔️'
        } else if (hour >= 12 && hour < 18) {
          this.timeMessage = '学习，学习，下班，下班😁'
        } else if (hour >= 18 && hour < 24) {
          this.timeMessage = '刷剧，刷剧，游戏，游戏🤗️'
        }
      }
    },
    components: {
      IconFont,
      myUpload
    }
  }
</script>
<style lang="scss" scoped>
  .header {
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    font-size: 14px;
    background-color:#00cccc;
    box-shadow:2px 0 3px rgba(0,0,0,.5);
    color: #fff;
    padding: 0 40px;
    line-height: 70px;
    height: 70px;
    &.upload {
      position: relative;
      line-height: initial;
    }
  }
  .header p {
    margin: 0;
  }
  .logo {
    display: flex;
  }
  .hello {
    line-height: 35px;
    text-align: center;
    display: none;
  }

  .search {
    display: none;
  }

  .right {
    text-align: right;
  }

  .notice {
    margin-right: 25px;
    color: #fff;
    font-size: 20px;
    line-height: 30px;
    cursor: pointer;
  }

  .user-infor img {
    height: 40px;
    width: 40px;
    position: relative;
    top: 15px;
    border-radius: 50%;
    cursor: pointer;
    background: #f9ff00;
    display: block;
  }

  @media only screen and (min-width: 992px) {
    .search {
      display: block
    }
  }
  @media only screen and (min-width: 768px) {
    .hello {
      display: block
    }
  }
  @media only screen and (max-width: 768px) {
    .logo i {
      font-size: 30px;
      float: left
    }
    .notice {
      /* font-size: 16px; */
      margin-right: 10px;
    }
    .header {
      padding: 0 20px;
    }
  }
</style>
