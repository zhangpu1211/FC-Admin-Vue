<template>
  <div>
    <el-dialog :title="dtitle" :visible.sync="visible" :show="show" width="30%" @close="handleClose">
      <div>
        <el-form ref="form" :model="data" :rules="rules" label-width="80px">
          <el-form-item label="上级权限">
            <ElTreeSelect
              :value="data.parentId"
              :options="permiss"
              :clearable="isClearable"
              :accordion="isAccordion"
              @getValue="getValue($event)"
            />
          </el-form-item>
          <el-form-item label="权限名称">
            <el-input v-model="data.name" />
          </el-form-item>
          <el-form-item label="匹配路径">
            <el-input v-model="data.url" />
          </el-form-item>
          <el-form-item label="访问路径">
            <el-input v-model="data.path" />
          </el-form-item>
          <el-form-item label="组件名称">
            <el-input v-model="data.component" />
          </el-form-item>
          <el-form-item label="图标类名">
            <el-input v-model="data.iconCls" />
          </el-form-item>
          <el-form-item label="权重">
            <el-input v-model="data.sort" placeholder="权重越大越靠前" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:show', false)">取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ElTreeSelect from './treeSelect'
import SysPermiss from '../../models/SysPermiss'
export default {
  name: 'MenuDetail',
  components: {
    ElTreeSelect
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: String,
    permiss: Array,
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      dtitle: this.title,
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选））
      rules: {
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入匹配路径', trigger: 'blur' }],
        path: [{ required: true, message: '请输入访问路径', trigger: 'blur' }],
        component: [{ required: true, message: '请输入组件名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    show(val) {
      this.visible = this.show
    }
  },
  methods: {
    handleChange(value) {
      console.log(value)
    },
    async addMenu() {
      if (this.data.id) {
        console.log(this.data.id)
        this.$refs.form.validate(async(valid) => {
          if (valid) {
            const resp = await SysPermiss.updatePermiss(this.data)
            this.$emit('succhandle', resp)
          } else {
            this.$message({
              showClose: true,
              message: '请检查输入',
              type: 'error'
            })
            return false
          }
        })
      } else {
        this.$refs.form.validate(async(valid) => {
          if (valid) {
            const resp = await SysPermiss.addPermiss(this.data)
            this.$emit('succhandle', resp)
          } else {
            this.$message({
              showClose: true,
              message: '请检查输入',
              type: 'error'
            })
            return false
          }
        })
      }
    },
    handleNodeClick(data) {
      console.log(data)
    },
    // 取值
    getValue(value) {
      this.valueId = value
      this.form.parentId = value
    },
    handleClose() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style scoped>

</style>
