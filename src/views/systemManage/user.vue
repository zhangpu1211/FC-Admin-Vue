<template>
  <div class="app-container">
    <div>
      <el-input v-model="listQuery.username" size="small" placeholder="请输入用户名" style="width:200px" clearable />
      <el-button type="primary" size="small" icon="el-icon-search" @click="getSysUser">查询</el-button>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddView">添加</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
        v-loading="loading"
        :data="sysUser"
        stripe
        border
        element-loading-text="正在加载..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="username"
          label="用户名"
          align="left"
        />
        <el-table-column
          prop="nickName"
          label="昵称"
          align="left"
        />
        <el-table-column
          prop="avatar"
          label="头像"
          align="center"
        >
          <template slot-scope="scope">
            <img v-if="scope.row.avatar" :src="'http://localhost:8081'+scope.row.avatar" class="avatar">
          </template>
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          align="left"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.sex==0 ? '男':'女' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话号码"
          align="left"
        />
        <el-table-column
          prop="rname"
          label="关联角色"
          align="left"
          width="180"
        >
          <template slot-scope="scope">
            <div class="tag-group" v-if="scope.row.roles != null">
              <el-tag v-for="(item,index) in scope.row.roles" :key="index" style="margin:2px;">{{item.nameZh}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="flag"
          label="是否禁用"
          align="left"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.flag==true ? '未禁用':'禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="openId"
          label="第三方标识"
          align="left"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.openId==null ? '无': scope.row.openId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          :formatter="setDate"
          align="left"
        />
        <el-table-column
          prop="email"
          label="邮箱"
          align="left"
          width="160"
        />
        <el-table-column
          fixed="right"
          width="280"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showRoleView(scope.row)">分配角色</el-button>
            <el-button v-permission="['sys:user:edit']" size="small" @click="showEditView(scope.row)">编辑</el-button>
            <el-button v-permission="['sys:user:delete']" size="small" type="danger" @click="deleteSysUser(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:15px;display: flex;justify-content: flex-end">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @current-change="currentChange"
          @size-change="sizeChange"
        />
      </div>
    </div>
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogVisible" width="40%" @close="handleDialogClose">
      <el-form ref="dataForm" :model="form" :rules="rules" label-width="100px" class="">
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="昵称:" prop="nickName">
          <el-input v-model="form.nickName" />
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-select v-model="form.sex" class="filter-item" placeholder="请选择" style="width: 280px;">
            <el-option
              v-for="item in sexList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码:" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="头像:" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8081/file/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="headers"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.avatar" :src="avatarUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="状态:" prop="flag">
          <el-switch
            v-model="form.flag"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="submitForm"> 确定 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="showRoleDialog"
      width="30%"
    >
      <el-select v-model="selectedRoles" multiple placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.nameZh"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button @click="cancleUserRole">取 消</el-button>
      <el-button type="primary" @click="giveUserRole">确 定</el-button>
    </el-dialog>
  </div>

</template>

<script>
import SysUser from '@/api/user'
import { getToken } from '@/utils/auth'
import SysRole from '../../api/role'
export default {
  name: 'User',
  data() {
    return {
      size: 'small',
      dialogVisible: false,
      sysUser: [],
      loading: false,
      listQuery: {
        page: 1,
        size: 10,
        username: undefined
      },
      total: 0,
      form: {
        id: undefined, // 主键ID
        username: undefined, // 用户名
        password: undefined, // 登录密码
        nickName: undefined, // 昵称
        sex: '0', // 性别  0:男 1:女
        phone: undefined, // 手机号码
        email: undefined, // 邮箱
        avatar: undefined, // 头像
        flag: true // 状态
      },
      sexList: [{ key: '0', label: '男' }, { key: '1', label: '女' }],
      dialogStatus: '',
      titleMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, pattern: /^(\w){6,16}$/, message: '请设置6-16位字母、数字组合' }
        ],
        nickName: [
          { required: true, message: '请输入你昵称', trigger: 'blur' }
        ],
        flag: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      },
      showRoleDialog: false,
      roles: [],
      selectedRoles: [],
      userRole: null
    }
  },
  computed: {
    headers() {
      return {
        'Authorization': 'Bearer' + getToken() // 直接从本地获取token就行
      }
    },
    avatarUrl() {
      return 'http://localhost:8081' + this.form.avatar
    }
  },
  mounted() {
    this.initData()
    this.initRoles()
  },
  methods: {
    async initRoles() {
      const resp = await SysRole.roleList()
      this.roles = resp
    },
    async initData() {
      this.loading = true
      let url = '/system/user/list/?page=' + this.listQuery.page + '&size=' + this.listQuery.size
      if (this.listQuery.username) {
        url += '&username=' + this.listQuery.username
      }
      const res = await SysUser.userList(url)
      this.loading = false
      this.sysUser = res.data
      this.total = res.total
    },
    showAddView() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogVisible = true
    },
    getSysUser() {
      console.log(this.listQuery)
      this.initData()
    },
    showEditView(data) {
      this.resetForm()
      this.form = Object.assign({}, data)
      this.dialogStatus = 'update'
      this.dialogVisible = true
      console.log(data)
    },
    submitForm() {
      if (this.form.id) {
        const res = SysUser.update(this.form)
        console.log(res)
        this.dialogVisible = false
        this.initData()
      } else {
        const res = SysUser.add(this.form)
        console.log(res)
        this.dialogVisible = false
        this.initData()
      }
    },
    deleteSysUser(data) {
      const id = data.id
      console.log(id)
      const res = SysUser.delete(id)
      console.log(res)
      this.initData()
    },
    sizeChange(currentSize) {
      this.listQuery.size = currentSize
      this.initData()
    },
    currentChange(currentPage) {
      this.listQuery.page = currentPage
      this.initData()
    },
    setDate(row, column) {
      var newdate = row[column.property]
      if (newdate === undefined) {
        return ''
      }
      return this.$moment(newdate).format('YYYY-MM-DD')
    },
    resetForm() {
      this.form = {
        id: undefined, // 主键ID
        username: undefined, // 用户名
        password: undefined, // 登录密码
        nickName: undefined, // 昵称
        sex: '0', // 性别  0:男 1:女
        phone: undefined, // 手机号码
        email: undefined, // 邮箱
        avatar: undefined, // 头像
        flag: true // 状态
      }
    },
    // 监听dialog关闭时的处理事件
    handleDialogClose() {
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate() // 清除整个表单的校验
      }
    },
    handleAvatarSuccess(res, file) {
      console.log(file)
      this.form.avatar = res.obj
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    showRoleView(row) {
      this.userRole = row
      if (row.roles) {
        const ids = row.roles.map(role => role.id)
        this.selectedRoles = ids
      }
      this.showRoleDialog = true
    },
    giveUserRole() {
      console.log(this.userRole.id, this.selectedRoles)
      console.log('111')
      SysUser.updateUserRole(this.userRole.id, this.selectedRoles)
      this.resetUserRole()
      this.initData()
    },
    cancleUserRole() {
      this.resetUserRole()
    },
    resetUserRole() {
      this.selectedRoles = []
      this.showRoleDialog = false
      this.userRole = []
    }
  }
}
</script>

<style scoped>
  .avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader >>> .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .avatar {
    width: 60px;
    height: 60px;
    display: block;
  }
</style>
