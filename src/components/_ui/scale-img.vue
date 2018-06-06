<template>
  <div class="scale-container">
    <i class="icon el-icon-zoom-in" @click="scaleImg"></i>
    <img ref="imgResource" class="scale-small-pic" :src="path" :alt="alt" title="点击放大查看"/>
  </div>
</template>

<script>
export default {
  props: [
    'path',
    'alt'
  ],
  data () {
    return {
      fontSize: 12
    }
  },
  methods: {
    scaleImg () {
      let imgResource = this.$refs['imgResource']

      // 小图片距离浏览器可视区域的left、top
      let left = imgResource.getBoundingClientRect().left
      let top = imgResource.getBoundingClientRect().top
      // 放大后图片的top、left
      let toLeft = window.innerWidth / 2 - imgResource.naturalWidth / 2
      let toTop = window.innerHeight / 2 - imgResource.naturalHeight / 2
      // 放大过程中将要移动的距离
      let translateX = (toLeft - left) / this.fontSize
      let translateY = (toTop - top) / this.fontSize

      let scaleContainer = document.createElement('div')
      scaleContainer.classList = ['scale-wrapper']

      let img = document.createElement('img')
      img.setAttribute('src', this.path)
      img.style.left = (left / this.fontSize) + 'rem'
      img.style.top = (top / this.fontSize) + 'rem'
      img.style.height = (imgResource.offsetHeight / this.fontSize) + 'rem'
      img.style.width = (imgResource.offsetWidth / this.fontSize) + 'rem'
      img.addEventListener('click', (e) => {
        e.stopPropagation()
      })

      let iconDel = document.createElement('i')
      iconDel.classList = ['el-icon-error icon-del']
      scaleContainer.addEventListener('click', () => {
        img.style.height = (imgResource.offsetHeight / this.fontSize) + 'rem'
        img.style.width = (imgResource.offsetWidth / this.fontSize) + 'rem'
        img.style.transform = `translate(0, 0)`
        let timer = setTimeout(() => {
          document.body.removeChild(scaleContainer)
          clearTimeout(timer)
        }, 550)
      })

      scaleContainer.appendChild(iconDel)
      scaleContainer.appendChild(img)
      document.body.appendChild(scaleContainer)

      if (imgResource.naturalHeight >= document.body.clientHeight) {
        img.style.height = (document.body.clientHeight - 100) / this.fontSize + 'rem'
      } else {
        img.style.height = imgResource.naturalHeight / this.fontSize + 'rem'
      }

      if (imgResource.naturalWidth >= document.body.clientWidth) {
        img.style.width = (document.body.clientWidth - 100) / this.fontSize + 'rem'
      } else {
        img.style.width = imgResource.naturalWidth / this.fontSize + 'rem'
      }
      img.style.transform = `translate(${translateX + 'rem'}, ${translateY + 'rem'})`
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
