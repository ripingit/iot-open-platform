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
  methods: {
    scaleImg () {
      let imgResource = this.$refs['imgResource']

      let scaleContainer = document.createElement('div')
      scaleContainer.classList = ['scale-wrapper']

      let img = document.createElement('img')
      img.setAttribute('src', this.path)

      let iconDel = document.createElement('i')
      iconDel.classList = ['el-icon-error icon-del']
      iconDel.addEventListener('click', () => {
        scaleContainer.style.transform = 'scale(0)'
        let timer = setTimeout(() => {
          document.body.removeChild(scaleContainer)
          clearTimeout(timer)
        }, 1000)
      })

      scaleContainer.appendChild(iconDel)
      scaleContainer.appendChild(img)
      document.body.appendChild(scaleContainer)

      if (imgResource.naturalHeight >= document.body.clientHeight) {
        img.style.height = (document.body.clientHeight - 100) + 'px'
      } else {
        img.style.height = imgResource.naturalHeight + 'px'
      }

      if (imgResource.naturalWidth >= document.body.clientWidth) {
        img.style.width = (document.body.clientWidth - 100) + 'px'
      } else {
        img.style.width = imgResource.naturalWidth + 'px'
      }
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
  transition: all .5s cubic-bezier(.46, 1, .23, 1.52);
  width: 0;
  height: 0;
  margin: 0 auto;
}

.scale-wrapper .icon-del {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 4rem;
  color: #313131;
  transition: all .5s;
  z-index: 100000;
  cursor: pointer;
}
.scale-wrapper .icon-del:hover {
  color: #777
}
</style>
