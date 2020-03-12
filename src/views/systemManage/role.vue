<template>
  <div
    class="role-container"
  >
    <div class="rool-tool">
      <el-input v-model="role.name" size="small" placeholder="请输入角色英文名">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input
        v-model="role.nameZh"
        size="small"
        placeholder="请输入角色中文名"
        @keydown.enter.native="doAddOrUpdateRole"
      />
      <el-button type="primary" size="small" icon="el-icon-plus" @click="doAddOrUpdateRole">添加角色</el-button>
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
            class="role-menu"
          >
            <h3 style="border-bottom: 1px solid #EBEEF5;">菜单分配</h3>
            <div style="margin: 20px 0">
              <el-button size="mini" @click="resetChecked">清空</el-button>
              <el-button size="mini" @click="cancelUpdateMenu">取消修改</el-button>
              <el-button size="mini" type="primary" @click="doUpdateMenus">确认修改</el-button>
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
        <el-form ref="form" :model="updateRole" label-width="80px">
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
        <el-button size="small" type="primary" @click="doAddOrUpdateRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SysMenu from '@/api/menu'
import SysRole from '../../api/role'
export default {
  name: 'Role',
  data() {
    return {
      role: {
        name: null,
        nameZh: null,
        id: null
      },
      updateRole: {
        name: null,
        nameZh: null,
        id: null
      },
      roles: [],
      dialogVisible: false,
      allmenus: [],
      activeName: -1,
      selectedMenus: [],
      rid: 0,
      defaultProps: {
        children: 'children',
        label: 'name'
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
      const resp = await SysRole.roleList()
      this.roles = resp
    },
    async initMenus() {
      this.allmenus = await SysMenu.menuList()
    },
    resetForm() {
      this.role = {
        id: null,
        name: null,
        nameZh: null
      }
      this.updateRole = {
        id: null,
        name: null,
        nameZh: null
      }
    },
    async doAddOrUpdateRole() {
      if (this.updateRole.id) {
        await SysRole.updateRole(this.updateRole)
      } else {
        if (this.role.name && this.role.nameZh) {
          await SysRole.addRole(this.role)
        } else {
          this.$message.error('数据不可以为空')
        }
      }
      this.dialogVisible = false
      this.resetForm()
      this.initRoles()
    },
    async getMenuIds(data) {
      this.selectedMenus = []
      const rid = data.id
      this.rid = rid
      const mids = await SysRole.getOwnMenus(rid)
      this.selectedMenus = mids
      this.$refs.tree.setCheckedKeys(mids)
    },
    showEditView(data) {
      console.log(data)
      this.resetForm()
      this.updateRole = Object.assign({}, data)
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

    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    cancelUpdateMenu() {
      this.$refs.tree.setCheckedKeys(this.selectedMenus)
    },
    async doUpdateMenus() {
      const selectedKeys = this.$refs.tree.getCheckedKeys()
      let url = '?rid=' + this.rid
      selectedKeys.forEach(key => {
        url += '&mids=' + key
      })
      const resp = await SysRole.updateOwnMenus(url)
      if (resp) {
        console.log(resp)
      }
      this.resetChecked()
    }
  }
}
</script>

<style scoped  lang="scss">
  .role-container{
    padding: 20px;
  }
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
