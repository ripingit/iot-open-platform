<template>
  <div class="main">
    <div class="layout">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
  @media (min-width: 1366px) { /**大于笔记本屏幕 */
    .main{
      overflow: hidden;
      height: 100%;
      background:#292c31;
    }
    .layout {
      margin-right: -1.7rem;
      height: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      width: auto;
    }
  }
  @media (max-width: 1366px) { /**小于笔记本屏幕 */
    .main {
      padding-bottom: 4000px;
      margin-bottom: -4000px;
      background:#292c31;
      height: 100%;
      overflow: auto;
    }
  }
</style>
