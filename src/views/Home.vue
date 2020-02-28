<template>
  <div style="height: 100%">
    <el-container>
      <el-aside class="aside-container transition_dom" :width="width">
        <el-menu
          router
          :default-active="$route.path"
          class="aside-menu"
          :collapse="isCollapse"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu v-for="(item,index) in routes" :key="index" :index="index+''">
            <template slot="title">
              <i style="color: #409eff;margin-right: 5px;" :class="item.iconCls" />
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="(child,indexj) in item.children" :key="indexj" :index="child.path">
              {{ child.name }}
            </el-menu-item>
          </el-submenu>
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
                separator-class="el-icon-arrow-right"
              >
                <el-breadcrumb-item :to="{ path: '/dashboard/analyse' }">首页</el-breadcrumb-item>
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
            <el-avatar :size="36" style="margin-right: 8px" :src="user.userface" />
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
      user: JSON.parse(window.sessionStorage.getItem('user')),
      active: '1'
    }
  },
  computed: {
    routes() {
      console.log('home routes')
      console.log(this.$store.state.routes)
      return this.$store.state.routes
      // return this.$router.options.routes.filter(item => !item.hidden)
    }
  },
  methods: {
    changeFold() {
      this.isCollapse = !this.isCollapse
      this.isCollapse ? this.isFold = 'hamburger' : this.isFold = 'hamburger-fold'
      this.isCollapse ? this.width = '64px' : this.width = '200px'
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
  .transition_dom {
    transition: all 0.25s linear 0s;
  }
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
    font-size: 20px;
  }
  .breadcrumb{
    margin-left: 10px;
  }
  .el-submenu .el-menu-item{
    background-color: #1f2d3d!important;
  }
</style>
