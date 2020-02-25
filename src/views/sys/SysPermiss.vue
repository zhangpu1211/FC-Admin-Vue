<template>
  <div>
    <div class="opreate">
      <el-button type="primary" @click="showAddView">添加权限</el-button>
      <el-button type="primary" @click="expandAll">展开全部</el-button>
      <el-button type="primary" @click="collapseAll">关闭全部</el-button>
    </div>
    <div style="margin-top: 15px;">
      <template>
        <el-table
          ref="menusTable"
          v-loading="loading"
          :data="menus"
          stripe
          border
          element-loading-text="正在加载..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          row-key="id"
          :default-expand-all="expand"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            prop="name"
            label="名称"
            width="180"
          />
          <el-table-column
            prop="url"
            label="匹配路径"
            width="220"
          />
          <el-table-column
            prop="path"
            label="访问路径"
            width="220"
          />
          <el-table-column
            prop="component"
            label="组件名称"
            width="180"
          />
          <el-table-column
            prop="iconCls"
            label="图标类名"
            width="180"
          />
          <el-table-column
            prop="sort"
            label="权重"
            width="180"
          />
          <el-table-column
            prop="enabled"
            label="是否启用"
            width="180"
          />
          <el-table-column
            width="200"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button size="mini" round type="primary" @click="showEditView(scope.row)">编辑</el-button>
              <el-button size="mini" round type="danger" @click="handleDelete(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <MenuDetail title="添加权限" :show.sync="isVisible" :data="menuDate" :permiss="arr" @succhandle="succhandle" />
  </div>
</template>

<script>
import SysMenu from '../../models/SysMenu'
import MenuDetail from '../../components/System/MenuDetail'
import SysPermiss from '../../models/SysPermiss'
export default {
  name: 'SysPermiss',
  components: {
    MenuDetail
  },
  data() {
    return {
      menus: [],
      loading: false,
      expand: false,
      isVisible: false,
      menuDate: {}
    }
  },
  computed: {
    arr() {
      const obj = { id: 0, name: '顶级菜单' }
      var arr = []
      arr.push(obj)
      for (const i of this.menus) {
        arr.push(i)
      }
      return arr
    }
  },
  mounted() {
    this.initMenus()
  },
  methods: {
    async initMenus() {
      this.menus = await SysMenu.getSysAllMenus()
    },
    forArr(arr, isExpand) {
      arr.forEach(i => {
        this.$refs.menusTable.toggleRowExpansion(i, isExpand)
        if (i.children) {
          this.forArr(i.children, isExpand)
        }
      })
    },
    expandAll() {
      this.forArr(this.menus, true)
    },
    collapseAll() {
      this.forArr(this.menus, false)
    },
    emptyMenu() {
      const menudata = {
        parentId: 0,
        name: '测试',
        url: '/',
        path: '/home',
        component: 'Home',
        iconCls: '',
        sort: 0
      }
      this.menuDate = menudata
    },
    showAddView() {
      this.emptyMenu()
      this.isVisible = true
    },
    showEditView(data) {
      this.isVisible = true
      Object.assign(this.menuDate, data)
    },
    succhandle(resp) {
      console.log(resp)
      this.emptyMenu()
      this.isVisible = false
      this.initMenus()
      console.log('init')
    },
    async handleDelete(data) {
      console.log(data)
      this.$confirm('此操作将永久删除【' + data.name + '】权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        console.log('1111')
        const resp = await SysPermiss.deletePermiss(data.id)
        if (resp) {
          this.initMenus()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }

}
</script>

<style scoped>

</style>
