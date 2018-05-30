<template>
  <div class="VisitPower">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">权限管理-访问授权</p>
        <p class="title-en">ADMIN POWER MANAGE</p>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-col :span="24" class="VisitPower-checkbox" v-for="group in groupData" :key="group.cmd_id">
        <el-checkbox :indeterminate="group.hasChecked" v-model="group.allChecked" @change="CheckAll(group)">{{group.method}}</el-checkbox>
        <div style="margin: 1.5rem 0;"></div>
        <el-checkbox v-model="item.checked" @change="ChangeGroup(group)" v-for="item in group.child" :label="item.method" :key="item.cmd_id">{{item.method}}</el-checkbox>
      </el-col>
      <el-col :span="24" style="margin-top: 4rem">
        <el-col :span="2">
          <el-button type="primary" @click="confirm()">确 定</el-button>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button type="danger"
                     style="background-color: #f56c6c;border-color: #f56c6c;"
                     @click="goBack()">返 回</el-button>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import '@/assets/css/content.css'
import { ADMIN_POWERS_QUERY, ADMIN_POWERS_EDIT } from '../../../lib/api.js'
export default {
  data () {
    return {
      group_id: this.$route.params.group_id,
      groupData: [],
      groupChecked: [],
      cmd_id: []
    }
  },
  created () {
    this.onSubmit()
  },
  methods: {
    onSubmit () {
      let loading = this.vmLoadingFull()
      let param = this.createFormData({
        group_id: parseInt(this.group_id)
      })
      this.$http.post(ADMIN_POWERS_QUERY, param).then(res => {
        loading.close()
        if (res.data.statu === 0) {
          this.$router.push('/login')
          return false
        }
        if (this.vmResponseHandler(res)) {
          res.data.data.forEach(val => {
            if (val.status) {
              this.cmd_id.push(val.cmd_id)
            }
            val.groupChecked = []
            val.hasChecked = true
            val.allChecked = val.status
            val.child.forEach(subVal => {
              if (subVal.status) {
                this.cmd_id.push(subVal.cmd_id)
              }
              subVal.checked = subVal.status
            })
          })
          this.groupData = res.data.data
        }
      }
      ).catch(() => {
        loading.close()
        this.vmMsgError('网络错误！')
      })
    },
    goBack () {
      this.$router.push({name: 'power'})
    },
    confirm () {
      let param = this.createFormData({
        cmd_id: JSON.stringify(this.cmd_id),
        group_id: this.group_id
      })
      this.vmConfirm({
        msg: '确定修改此用户授权？',
        confirmCallback: () => {
          let loading = this.vmLoadingFull()
          this.$http.post(ADMIN_POWERS_EDIT, param).then(res => {
            if (res.data.statu === 0) {
              this.$router.push('/login')
              return false
            }
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('操作成功！')
              this.onSubmit()
            }
          }).catch(() => {
            loading.close()
            this.vmMsgError('网络错误！')
          })
        }
      })
    },
    CheckAll (row) {
      this.cmd_id = []
      if (row.allChecked) {
        this.cmd_id.push(row.cmd_id)
        row.groupChecked.forEach(val => {
          this.cmd_id.push(val.cmd_id)
        })
      }
      row.allChecked = row.groupChecked.length === row.child.length
      row.groupChecked = []
      row.child.forEach(function (val) {
        val.checked = !row.allChecked
        if (val.checked)row.groupChecked.push(val)
      })
      let groupChecked = row.groupChecked.length
      row.allChecked = groupChecked === row.child.length
      row.hasChecked = groupChecked > 0 && groupChecked < row.child.length
    },
    ChangeGroup (row) {
      this.cmd_id = []
      if (row.groupChecked.length) {
        this.cmd_id.push(row.cmd_id)
      }
      row.groupChecked = []
      row.child.forEach(function (val) {
        if (val.checked)row.groupChecked.push(val)
      })
      let groupChecked = row.groupChecked.length
      row.allChecked = groupChecked === row.child.length
      row.hasChecked = groupChecked > 0 && groupChecked < row.child.length
      row.groupChecked.forEach(val => {
        this.cmd_id.push(val.cmd_id)
      })
    }
  }
}
</script>
<style scoped>
  .VisitPower{
    padding: 1.67rem 2.5rem;
    color: #fff;
  }
  .VisitPower-checkbox:first-child{
    margin-top: 0;
  }
  .VisitPower-checkbox{
    margin-top: 2rem;
    color: #808080;
  }
</style>
<style>
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  }
</style>
