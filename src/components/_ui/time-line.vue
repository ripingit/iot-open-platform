<template>
  <div style="overflow:hidden">
    <div class="timeline-container">
      <div v-if="loading" class="loading">
        <i class="el-icon-loading"></i>
      </div>
      <div v-else>
        <el-row class="timeline-row" v-for="(item, index) in data" :key="index">
          <el-col :span="5">
            <p class="date">{{item.upgrade_time}}</p>
            <p class="state" :class="item.is_review === 0 ? 'state-wait-pass'
                        : item.is_review === 1 ? 'state-pass'
                        : item.is_review === 2 ? 'state-no-pass' : ''">{{item.is_review === 0 ? '待审核'
                        : item.is_review === 1 ? '已通过'
                        : item.is_review === 2 ? '已驳回' : ''}}</p>
          </el-col>
          <el-col :span="1">
            <div class="spot">
              <i class="circle"></i>
              <i class="line"></i>
            </div>
          </el-col>
          <el-col :span="18">
            <p class="log">版本：{{item.rom_ver}}</p>
            <p class="log">MD5值：{{item.rom_md5}}</p>
            <p class="log log-pre mt20" v-html="vmEscapeToHTML(item.change_log)"></p>

            <p class="log mt20 mb3"><a :href="item.file_id" target="_blank" class="download">下载测试</a></p>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'data',
    'loading'
  ]
}
</script>

<style scoped>
  .timeline-container {
    min-height: 20rem;
    max-height: 35rem;
    overflow: auto;
    margin-right: -1.3rem;
  }
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

  .timeline-container .loading {
    line-height: 16rem;
    text-align: center;
    font-size: 2rem;
    color: #fff;
  }
  .timeline-container .log-pre {
    white-space: pre;
    line-height: 1.4;
  }
</style>
