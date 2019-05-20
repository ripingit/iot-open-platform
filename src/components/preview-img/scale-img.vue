<template>
  <div class="scale-container">
    <i class="icon el-icon-zoom-in" @click="scaleImg"></i>
    <img ref="imgResource" class="scale-small-pic" :src="path" :alt="alt" title="点击放大查看"/>
  </div>
</template>

<script>
export default {
  props: [
    "path", "alt"
  ],
  data () {
    return { fontSize: 12 }
  },
  methods: {
    scaleImg () {
      // 距离屏幕两边各100像素，因此为200
      const DOUBLE_MARGIN = 200
      // 延时
      const TIMER = 550
      // 一半
      const HALF = 2
      // 元素距离顶部或左边的默认像素值
      const TO_DISTANCE = 100

      const { imgResource } = this.$refs

      // 小图片距离浏览器可视区域的left、top
      const { left } = imgResource.getBoundingClientRect()
      const { top } = imgResource.getBoundingClientRect()
      // 放大后图片的top、left
      const toLeft = window.innerWidth > imgResource.naturalWidth ? window.innerWidth / HALF - imgResource.naturalWidth / HALF : TO_DISTANCE
      const toTop = window.innerHeight > imgResource.naturalHeight ? window.innerHeight / HALF - imgResource.naturalHeight / HALF : TO_DISTANCE
      // 放大过程中将要移动的距离
      const translateX = toLeft - left
      const translateY = toTop - top

      const scaleContainer = document.createElement("div")
      scaleContainer.classList = [ "scale-wrapper" ]

      const img = document.createElement("img")
      img.setAttribute("src", this.path)
      img.style.left = `${left}px`
      img.style.top = `${top}px`
      img.style.height = `${imgResource.offsetHeight}px`
      img.style.width = `${imgResource.offsetWidth}px`
      img.addEventListener("click", e => {
        e.stopPropagation()
      })

      const iconDel = document.createElement("i")
      iconDel.classList = [ "el-icon-error icon-del" ]
      scaleContainer.addEventListener("click", () => {
        img.style.height = `${imgResource.offsetHeight}px`
        img.style.width = `${imgResource.offsetWidth}px`
        img.style.transform = `translate(0, 0)`
        const timer = setTimeout(() => {
          document.body.removeChild(scaleContainer)
          clearTimeout(timer)
        }, TIMER)
      })

      scaleContainer.appendChild(iconDel)
      scaleContainer.appendChild(img)
      document.body.appendChild(scaleContainer)

      if (imgResource.naturalHeight >= document.body.clientHeight - DOUBLE_MARGIN) {
        img.style.height = `${document.body.clientHeight - DOUBLE_MARGIN}px`
      } else {
        img.style.height = `${imgResource.naturalHeight}px`
      }

      if (imgResource.naturalWidth >= document.body.clientWidth - DOUBLE_MARGIN) {
        img.style.width = `${document.body.clientWidth - DOUBLE_MARGIN}px`
      } else {
        img.style.width = `${imgResource.naturalWidth}px`
      }
      img.style.transform = `translate(${`${translateX}px`}, ${`${translateY}px`})`
    }
  }
}
</script>

<style>
.scale-container {
  display: inline-block;
  position: relative;
}
.scale-container .icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  z-index: 10;
  cursor: pointer;
  color: #b9b9b9;
  font-size: 2rem;
  background: rgba(49, 49, 49, 0.6);
  display: none;
}
.scale-container:hover > i.icon {
  display: flex;
}
.scale-container .icon:before {
  margin: 0 auto;
}
.scale-container .scale-small-pic {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
.scale-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  z-index: 99999;
  transition: all .5s cubic-bezier(.23, 1, .46, 1);
}
.scale-wrapper img {
  position: absolute;
  transition: all .5s ease;
}

.scale-wrapper .icon-del {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 4rem;
  color: #777;
  transition: all .5s;
  z-index: 100000;
  cursor: pointer;
}
</style>
