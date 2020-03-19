<template>
  <div class="main">
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
            prop="resources"
            label="路由地址"
            width="160"
          />
          <el-table-column
            prop="url"
            label="后台匹配路径"
            width="190"
          />
          <el-table-column
            prop="component"
            label="组件名称"
            width="190"
          />
          <el-table-column
            prop="level"
            label="级别"
          />
          <el-table-column
            prop="icon"
            label="图标类名"
            width="160"
          />
          <el-table-column
            prop="sort"
            label="权重"
          />
          <el-table-column
            prop="menu_type"
            label="菜单类型"
            :formatter="formatMenuType"
          />
          <el-table-column
            prop="redirect"
            label="一级菜单跳转地址"
          />
          <el-table-column
            prop="isRoute"
            label="是否是路由菜单"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.isRoute == true ? '是':'否' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="keepAlive"
            label="是否缓存页面"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.isRoute == true ? '是':'否' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="hidden"
            label="是否隐藏路由"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.hidden == true ? '是':'否' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="internalOrExternal"
            label="是否外链"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.internalOrExternal == true ? '是':'否' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            width="160"
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
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="34%"
    >
      <el-form :model="menuData" :rules="rules" label-width="100px" :inline="true">
        <el-form-item label="菜单类型" style="display: block;">
          <el-radio-group v-model="menuData.menuType" size="small" @change="menuTypeChangeHandle">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
            <el-radio-button label="3">其他</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="buttonMenuVisible" label="路由菜单">
          <el-radio-group v-model="menuData.isRoute" size="small">
            <el-radio-button label="false">否</el-radio-button>
            <el-radio-button label="true">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="buttonMenuVisible" label="是否隐藏">
          <el-radio-group v-model="menuData.hidden" size="small">
            <el-radio-button label="false">否</el-radio-button>
            <el-radio-button label="true">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="buttonMenuVisible" label="是否外链">
          <el-radio-group v-model="menuData.internalOrExternal" size="small">
            <el-radio-button label="false">否</el-radio-button>
            <el-radio-button label="true">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="后台路径" prop="url">
          <el-input v-model="menuData.url" />
        </el-form-item>
        <el-form-item label="资源编码" prop="resources">
          <el-input v-model="menuData.resources" />
        </el-form-item>
        <el-form-item label="菜单标题" class="form-item" prop="name">
          <el-input v-model="menuData.name" />
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="menuData.sort" />
        </el-form-item>
        <el-form-item v-if="buttonMenuVisible" label="菜单图标">
          <el-input v-model="menuData.icon" />
        </el-form-item>
        <el-form-item v-if="buttonMenuVisible" label="一级菜单跳转">
          <el-input v-model="menuData.redirect" />
        </el-form-item>
        <el-form-item label="上级菜单">
          <treeselect v-model="menuData.parentId" :options="menusTree" style="width: 484px;" :normalizer="normalizer" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button size="small" @click="cancleHandle">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SysMenu from '@/api/menu'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'Menu',
  components: { Treeselect },
  data() {
    return {
      value: null,
      menus: [],
      menusTree: [],
      loading: false,
      expand: false,
      dialogVisible: false,
      secondMenuVisible: true,
      buttonMenuVisible: true,
      menuData: {
        id: null,
        parentId: '0',
        name: '测试',
        url: '',
        resources: '',
        component: 'layout',
        level: 0,
        sort: 0,
        icon: '',
        menuType: 0,
        redirect: '',
        isRoute: true,
        isLeaf: false,
        keepAlive: true,
        hidden: false,
        internalOrExternal: false
      },
      rules: {
        name: [
          { required: true, message: '请输入菜名称', trigger: 'blur' }
        ],
        resources: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.initMenus()
  },
  methods: {
    async initMenus() {
      const res = await SysMenu.menuList()
      this.menus = res
      const menu = { id: '0', name: '顶级类目', children: [] }
      menu.children = res
      this.menusTree = []
      this.menusTree.push(menu)
      console.log(this.menusTree)
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
    formatMenuType(row, column) {
      if (row.menuType === 0) {
        return '一级菜单'
      } else if (row.menuType === 1) {
        return '二级菜单'
      } else if (row.menuType === 2) {
        return '按钮'
      } else {
        return '其它'
      }
    },
    menuTypeChangeHandle(val) {
      if (this.menuData.menuType === '0' || this.menuData.menuType === '1') {
        this.buttonMenuVisible = true
      } else {
        this.buttonMenuVisible = false
      }
    },
    normalizer(node) {
      return {
        label: node.name
      }
    },
    emptyMenu() {
      this.menuData = {
        id: null,
        parentId: '0',
        name: '测试',
        url: '',
        resources: '',
        component: 'layout',
        level: 0,
        sort: 0,
        icon: '',
        menuType: 0,
        redirect: '',
        isRoute: true,
        isLeaf: false,
        keepAlive: true,
        hidden: false,
        internalOrExternal: false
      }
    },
    showAddView() {
      this.emptyMenu()
      this.dialogVisible = true
    },
    showEditView(data) {
      console.log(data)
      this.emptyMenu()
      this.menuData = Object.assign({}, data)
      this.dialogVisible = true
    },
    handleDelete(data) {
      const id = data.id
      const res = SysMenu.delete(id)
      console.log(res)
      this.initMenus()
    },
    cancleHandle() {
      this.dialogVisible = false
    },
    async confirmHandle() {
      if (this.menuData.id) {
        await SysMenu.update(this.menuData)
      } else {
        await SysMenu.add(this.menuData)
      }
      this.emptyMenu()
      this.dialogVisible = false
      this.initMenus()
      console.log('init')
    }
  }
}
</script>

<style scoped>
.main{
  padding: 20px;
}

</style>
