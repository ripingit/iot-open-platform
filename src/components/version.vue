<template>
  <div class="version">{{ version }}</div>
</template>

<script>
import { Version } from "@/lib/const.js"
export default {
  data () {
    return { version: Version }
  }
}
</script>
<style scope>
.version {
  position: absolute;
  bottom: 3rem;
  color: #fff;
  text-align: center;
  width: 100%;
  font-size: 14px;
}
</style>
