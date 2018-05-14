<template>
  <div class="timeline-container">
    <el-row class="timeline-row">
      <el-col :span="5">
        <p class="date">2018-03-18</p>
        <p class="state state-wait-pass">待审核</p>
      </el-col>
      <el-col :span="1">
        <div class="spot">
          <i class="circle"></i>
          <i class="line"></i>
        </div>
      </el-col>
      <el-col :span="18">
        <p class="log">v2.0.06.11</p>
        <p class="log">MD5值：156489465165145646</p>
        <p class="log mt20">1.支持iOS12，iSuit同步。</p>
        <p class="log">2.支持全景查看以及8倍放大。</p>

        <p class="log mt20 mb3"><a href="" class="download">下载测试</a></p>
      </el-col>
    </el-row>

    <el-row class="timeline-row">
      <el-col :span="5">
        <p class="date">2018-03-18</p>
        <p class="state state-pass">已上线</p>
      </el-col>
      <el-col :span="1">
        <div class="spot">
          <i class="circle"></i>
          <i class="line"></i>
        </div>
      </el-col>
      <el-col :span="18">
        <p class="log">v2.0.06.11</p>
        <p class="log">MD5值：156489465165145646</p>
        <p class="log mt20">1.支持iOS12，iSuit同步。</p>
        <p class="log">2.支持全景查看以及8倍放大。</p>

        <p class="log mt20 mb3"><a href="" class="download">下载测试</a></p>
      </el-col>
    </el-row>

    <el-row class="timeline-row">
      <el-col :span="5">
        <p class="date">2018-03-18</p>
        <p class="state state-no-pass">审核失败</p>
      </el-col>
      <el-col :span="1">
        <div class="spot">
          <i class="circle"></i>
          <i class="line"></i>
        </div>
      </el-col>
      <el-col :span="18">
        <p class="log">v2.0.06.11</p>
        <p class="log">MD5值：156489465165145646</p>
        <p class="log mt20">1.支持iOS12，iSuit同步。</p>
        <p class="log">2.支持全景查看以及8倍放大。</p>

        <p class="log mt20 mb3"><a href="" class="download">下载测试</a></p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: [
    'data'
  ],
  data () {
    return {
      list: this.data
    }
  },
  created () {
    console.log(this.list)
  }
}
</script>

<style scoped>
  .timeline-container .date,
  .timeline-container .state {
    text-align: center;
  }

  .timeline-row {
    display: flex;
  }

  .timeline-container .log {
    text-align: left;
    color: #ffffff;
    padding-left: 2rem;
  }
  .timeline-container .mt20 {
    margin-top: 1.25rem;
  }

  .timeline-container .download {
    color: #38a0f8;
  }
  .timeline-container .mb3 {
    margin-bottom: 3.9rem;
  }

  .timeline-container .date {
    color: #fefefe;
  }
  .timeline-container .state-pass {
    color: #2acba7;
  }
  .timeline-container .state-no-pass {
    color: #ff5d66;
  }
  .timeline-container .state-wait-pass {
    color: #b3b3b3;
  }

  .timeline-container .spot {
    text-align: center;
    height: 100%;
    position: relative;
    top: 0.5rem;
  }
  .timeline-container .circle {
    position: absolute;
    width: 0.92rem;
    height: 0.92rem;
    margin-left: -0.46rem;
    border-radius: 50%;
    border: solid 1px #ffffff;
    display: inline-block;
    background: #36393E;
  }
  .timeline-container .line {
    height: 100%;
    width: 0;
    display: inline-block;
    border: solid 1px #808080;
  }
</style>
