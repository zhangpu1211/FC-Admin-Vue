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
        <el-col :span="12">
          <div class="role-table">
            <template>
              <el-table
                :data="roles"
                border
                style="width: 100%">
                <el-table-column
                  prop="id"
                  label="ID"
                  width="60">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="角色英文名">
                </el-table-column>
                <el-table-column
                  prop="nameZh"
                  label="角色中文名">
                </el-table-column>
              </el-table>
            </template>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="role-menu">
            这里是资源树
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import SysRole from '../../models/SysRole'
export default {
  name: 'RoleMana',
  data() {
    return {
      role: {
        name: '',
        nameZh: ''
      },
      allmenus: [],
      activeName: -1,
      selectedMenus: [],
      roles: [],
      globalLoading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.initRoles()
  },
  methods: {
    async initRoles() {
      this.globalLoading = true
      const resp = await SysRole.getRoles()
      this.roles = resp
      this.globalLoading = false
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
    }
  }
}
</script>

<style scoped>
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
  }
</style>
