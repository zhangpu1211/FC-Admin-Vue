<template>
  <div class="log-container">
    <div>
      <template>
        <el-table
          ref="menusTable"
          v-loading="loading"
          :data="logs"
          stripe
          border
          element-loading-text="正在加载..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column
            prop="id"
            label="id"
          />
          <el-table-column
            prop="method"
            label="请求接口"
          />
          <el-table-column
            prop="url"
            label="请求URL"
          />
          <el-table-column
            prop="uname"
            label="请求用户"
          />
          <el-table-column
            prop="ip"
            label="请求IP"
          />
          <el-table-column
            prop="status"
            label="请求状态"
          />
          <el-table-column
            prop="executeTime"
            label="请求耗时"
          />
          <el-table-column
            prop="createTime"
            label="请求时间"
            :formatter="setDate"
          />
        </el-table>
      </template>
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
  </div>
</template>

<script>
import SysLog from '@/api/log'
export default {
  name: 'Log',
  data() {
    return {
      loading: false,
      logs: [],
      total: 0,
      listQuery: {
        page: 1,
        size: 10
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      const res = await SysLog.logList(this.listQuery)
      this.logs = res.data
      this.total = res.total
      this.loading = false
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
    }
  }
}
</script>

<style scoped>
.log-container{
  padding: 20px;
}
</style>
