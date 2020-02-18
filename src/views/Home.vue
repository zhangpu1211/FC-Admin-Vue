<template>
  <div style="height: 100%">
    <el-container>
      <el-aside class="aside-container" :width="width">
        <el-menu
          router
          unique-opened
          class="aside-menu"
          :collapse="isCollapse"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#ffd04b"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu v-for="(item,index) in routes" :key="index" :index="index+''">
            <template slot="title">
              <i style="color: #409eff;margin-right: 5px;" class="el-icon-menu" />
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="(child,indexj) in item.children" :key="indexj" :index="child.path">
              {{ child.name }}
            </el-menu-item>
          </el-submenu>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location" />
              <span>导航一</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu" />
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document" />
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting" />
            <span slot="title">导航四</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="home-header">
          <div class="home-header-left">
            <span class="svg-container" @click="changeFold">
              <icon-svg :icon-class="isFold" />
            </span>
            <div class="breadcrumb">
              <el-breadcrumb
                v-if="this.$router.currentRoute.path !== '/home'"
                separator-class="el-icon-arrow-right"
              >
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
          <div class="home-header-right">
            <el-button
              icon="el-icon-bell"
              type="text"
              size="normal"
              style="margin-right: 8px;color: #000000"
              @click="goChat"
            />
            <el-avatar :size="36" style="margin-right: 8px" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
            <el-dropdown class="userInfo" @command="commandHandler">
              <span class="el-dropdown-link">
                {{ user.name }}
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                <el-dropdown-item command="setting">设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      isCollapse: false,
      width: '200px',
      isFold: 'hamburger-fold',
      user: {
        name: '111',
        userface: '111'
      }
    }
  },
  computed: {
    routes() {
      return this.$router.options.routes.filter(item => !item.hidden)
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    changeFold() {
      this.isCollapse = !this.isCollapse
      this.isCollapse ? this.isFold = 'hamburger' : this.isFold = 'hamburger-fold'
      this.isCollapse ? this.width = 'auto' : this.width = '200px'
    },
    goChat() {
      this.$router.push('/chat')
    },
    commandHandler(cmd) {
      if (cmd == 'logout') {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            window.sessionStorage.removeItem('user')
            this.$router.replace('/')
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      }
    }
  }
}
</script>

<style lang="scss">
  .el-container {
    height: 100%;
  }

  .aside-menu {
    border: none;
    height: 100%;
  }

  .home-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 15px;
    box-sizing: border-box;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    .home-header-left,.home-header-right{
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .svg-container {
    font-size: 28px;
  }
  .breadcrumb{
    margin-left: 10px;
  }
</style>
