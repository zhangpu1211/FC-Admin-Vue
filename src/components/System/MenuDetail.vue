<template>
  <div>
    <el-dialog :title="dtitle" :visible.sync="visible" :show="show" width="30%" @close="$emit('update:show', false)">
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="上级权限">
            <ElTreeSelect
              :value="valueId"
              :options="permiss"
              :clearable="isClearable"
              :accordion="isAccordion"
              @getValue="getValue($event)"
            />
          </el-form-item>
          <el-form-item label="权限名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="匹配路径">
            <el-input v-model="form.url" />
          </el-form-item>
          <el-form-item label="访问路径">
            <el-input v-model="form.path" />
          </el-form-item>
          <el-form-item label="组件名称">
            <el-input v-model="form.component" />
          </el-form-item>
          <el-form-item label="图标类名">
            <el-input v-model="form.iconCls" />
          </el-form-item>
          <el-form-item label="权重">
            <el-input v-model="form.sort" placeholder="权重越大越靠前" />
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
    menu: Array,
    permiss: Array,
    menuUpdate: Object
  },
  data() {
    return {
      popVisible: true,
      visible: this.show,
      dtitle: this.title,
      options: this.permiss,
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 0, // 初始ID（可选）
      value: '',
      rules: {
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入匹配路径', trigger: 'blur' }],
        path: [{ required: true, message: '请输入访问路径', trigger: 'blur' }],
        component: [{ required: true, message: '请输入组件名称', trigger: 'blur' }]
      },
      form: {}
    }
  },
  watch: {
    show(val) {
      this.visible = this.show
    },
    menuUpdate() {
      Object.assign(this.form, this.menuUpdate())
      console.log('form:' + this.form)
    }
  },
  methods: {
    handleChange(value) {
      console.log(value)
    },
    addMenu() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const resp = await SysPermiss.addPermiss(this.form)
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
    },
    handleNodeClick(data) {
      console.log(data)
    },
    // 取值
    getValue(value) {
      this.valueId = value
      this.form.parentId = this.valueId
      console.log(this.valueId)
    }
  }
}
</script>

<style scoped>

</style>
