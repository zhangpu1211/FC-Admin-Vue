<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name(用户权限等级):{{ name }}</div>
    <div class="dashboard-text">roles(按钮级别权限):{{ roles }}</div>
    <h2>关于路由</h2>
    <div class="dashboard-text">
      权限标签{{ name }} 的路由为 {{ showRouter }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ]),
    showRouter() {
      console.log('全部路由信息', this.$store.getters.routerList)
      if (this.$store.getters.routerList.length > 0) {
        return this.$store.getters.routerList.reduce((arr, item) => {
          return arr.concat(item.path)
        }, [])
      }
      return ''
    }
  },
  methods: {
    toggleUser() {
      if (this.name === 'Normal Editor') {
        this.$store.dispatch('user/login', { username: 'admin', password: '' }).then(() => {
          location.reload()
        }).catch(() => {
          this.$message('接口出现了一些问题....')
        })
      } else if (this.name === 'Super Admin') {
        this.$store.dispatch('user/login', { username: 'editor', password: '' }).then(() => {
          location.reload()
        }).catch(() => {
          this.$message('接口出现了一些问题....')
        })
      }
    },
    basePermit(e) {
      return this.$store.getters.roles.includes(e)
    },
    toggleShow() {
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  position: absolute;
  &-container {
    margin: 30px;
    .toggle {
      position: absolute;
      right: 30px;
      top: 30px;
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
