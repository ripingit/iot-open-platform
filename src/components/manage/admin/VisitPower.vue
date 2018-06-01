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
        <el-checkbox class="VisitPower-checkbox-1" :indeterminate="group.hasChecked" v-model="group.allChecked" @change="CheckAll(group)">{{group.label}}</el-checkbox>
        <div style="margin: 1.5rem 0;"></div>
        <el-checkbox v-model="item.checked" @change="ChangeGroup(group)" v-for="item in group.child" :label="item.label" :key="item.id">{{item.label}}</el-checkbox>
      </el-col>
      <el-col :span="24" style="margin-top: 4rem">
        <el-col :span="2">
          <el-button
            type="primary"
            v-if="vmHasAuth(PermissionsLib.EDIT_USER_GROUP_AUTH, resData.res)"
            @click="confirm()">确 定</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="danger"
                     style="background-color: #f56c6c;border-color: #f56c6c;margin-left: 1rem"
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
      resData: [],
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
          this.resData = res.data
          let treeData = []
          res.data.data.forEach(val => {
            let node = {
              hasChecked: val.status,
              allChecked: true,
              label: val.method,
              id: val.cmd_id,
              child: [],
              childChecked: []
            }
            val.child.forEach(subVal => {
              node.child.push({
                checked: subVal.status,
                label: subVal.method,
                id: subVal.cmd_id
              })
              if (subVal.status) {
                node.childChecked.push(subVal)
              } else {
                node.allChecked = false
              }
            })
            treeData.push(node)
          })
          this.groupData = treeData
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
      this.cmd_id = []
      this.groupData.forEach(val => {
        if (val.hasChecked || val.allChecked) {
          this.cmd_id.push(val.id)
        }
        val.child.forEach(subVal => {
          if (subVal.checked) {
            this.cmd_id.push(subVal.id)
          }
        })
      })
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
      row.allChecked = row.childChecked.length === row.child.length
      row.childChecked = []
      row.child.forEach(function (val) {
        val.checked = !row.allChecked
        if (val.checked)row.childChecked.push(val)
      })
      let childChecked = row.childChecked.length
      row.allChecked = childChecked === row.child.length
      row.hasChecked = childChecked > 0 && childChecked < row.child.length
    },
    ChangeGroup (row) {
      row.childChecked = []
      row.child.forEach(function (val) {
        if (val.checked)row.childChecked.push(val)
      })
      let childChecked = row.childChecked.length
      row.allChecked = childChecked === row.child.length
      row.hasChecked = childChecked > 0 && childChecked < row.child.length
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
    padding-bottom: 1rem;
    border-bottom: 1px solid #808080;
  }
</style>
<style>
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  }
</style>
