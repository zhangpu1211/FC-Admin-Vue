<template>
  <div
    v-loading="globalLoading"
    element-loading-text="正在添加..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="rool-tool">
      <el-input v-model="role.name" size="small" placeholder="请输入角色英文名">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input
        v-model="role.nameZh"
        size="small"
        placeholder="请输入角色中文名"
        @keydown.enter.native="doAddRole"
      />
      <el-button type="primary" size="small" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
    </div>
    <div class="role-main">
      <el-row :gutter="60">
        <el-col :span="16">
          <div class="role-table">
            <h3>角色列表</h3>
            <template>
              <el-table
                :data="roles"
                border
                style="width: 100%"
              >
                <el-table-column
                  prop="id"
                  label="ID"
                  width="60"
                />
                <el-table-column
                  prop="name"
                  label="角色英文名"
                />
                <el-table-column
                  prop="nameZh"
                  label="角色中文名"
                />
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="getMenuIds(scope.row)">分配权限</el-button>
                    <el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </el-col>
        <el-col :span="8">
          <div
            v-loading="loading"
            class="role-menu"
            element-loading-text="正在添加..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <h3 style="border-bottom: 1px solid #EBEEF5;">菜单分配</h3>
            <div style="margin: 20px 0">
              <el-button size="mini" @click="resetChecked">清空</el-button>
              <el-button size="mini" @click="cancelUpdateMenu">取消修改</el-button>
              <el-button size="mini" @click="doUpdateMenus" type="primary">确认修改</el-button>
            </div>
            <div>
              <el-tree
                :key="rid"
                ref="tree"
                :data="allmenus"
                show-checkbox
                node-key="id"
                :props="defaultProps"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="修改角色"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div>
        <el-form ref="form" :model="updateRole" :rules="rules" label-width="80px">
          <el-form-item label="英文名称">
            <el-input v-model="updateRole.name" />
          </el-form-item>
          <el-form-item label="中文名称">
            <el-input v-model="updateRole.nameZh" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doUpdateRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SysMenu from '../../models/SysMenu'
import SysRole from '../../models/SysRole'
export default {
  name: 'RoleMana',
  data() {
    return {
      role: {
        name: '',
        nameZh: ''
      },
      updateRole: {
        name: '',
        nameZh: ''
      },
      allmenus: [],
      activeName: -1,
      selectedMenus: [],
      roles: [],
      globalLoading: false,
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rid: 0,
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
        nameZh: [{ required: true, message: '请输入中文名称', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.globalLoading = true
    this.initRoles()
    this.initMenus()
    this.globalLoading = false
  },
  methods: {
    async initRoles() {
      const resp = await SysRole.getRoles()
      this.roles = resp
    },
    async initMenus() {
      this.allmenus = await SysMenu.getSysAllMenus()
    },
    async doAddRole() {
      if (this.role.name && this.role.nameZh) {
        this.globalLoading = true
        var resp = await SysRole.addRole(this.role)
        this.globalLoading = false
        if (resp) {
          this.role.name = ''
          this.role.nameZh = ''
          this.initRoles()
        }
      } else {
        this.$message.error('数据不可以为空')
      }
    },
    async getMenuIds(data) {
      this.selectedMenus = []
      const rid = data.id
      this.rid = rid
      const mids = await SysRole.getMenuIdsByRid(rid)
      this.selectedMenus = mids
      this.$refs.tree.setCheckedKeys(mids)
    },
    showEditView(data) {
      console.log(data)
      Object.assign(this.updateRole, data)
      this.dialogVisible = true
      this.initRoles()
    },
    async deleteHandler(data) {
      this.$confirm('此操作将永久删除【' + data.name + '】角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const resp = await SysRole.deleteRole(data.id)
        if (resp) {
          this.initRoles()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async doUpdateRole() {
      const resp = await SysRole.updateRole(this.updateRole)
      if (resp) {
        this.initRoles()
        this.updateRole.name = ''
        this.updateRole.nameZh = ''
        this.dialogVisible = false
      }
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    cancelUpdateMenu() {
      this.$refs.tree.setCheckedKeys(this.selectedMenus)
    },
    async doUpdateMenus() {
      const selectedKeys = this.$refs.tree.getCheckedKeys(true)
      let url = '?rid=' + this.rid
      selectedKeys.forEach(key => {
        url += '&mids=' + key
      })
      const resp = await SysMenu.doUpdateMenus(url)
      if (resp) {
        console.log(resp)
      }
      this.resetChecked()
    }
  }
}
</script>

<style  lang="scss">
  .rool-tool {
    display: flex;
    justify-content: flex-start;
  }

  .rool-tool .el-input {
    width: 300px;
    margin-right: 6px;
  }

  .role-main {
    margin-top: 10px;
    h3{
      display: flex;
      margin: 0;
      height: 50px;
      align-items: center;
    }
  }
  .role-menu{
    height: 100%;
    display: flex;
    flex-direction: column;

  }
</style>
