<template>
  <div class="page">
    <div class="bucket-container">
      <div ref="bucket" id="bucket"
           :style="{left: bucketLeft + 'px'}"
           @touchstart="touchstart" @touchmove="touchmove"
           @touchcancel="touchcancel"></div>
    </div>
    <div class="fall_wrapper" id="fallWrapper" ref="fallWrapper"></div>
  </div>
</template>

<script>

import Fall from '../components/Fall'

export default {
  name: 'home',
  components: {
    Fall
  },
  data () {
    return {
      clientWidth: 100,
      clientHeight: 100,
      bucketLeft: 0,
      offset: 0,
      bucketWidth: 100
    }
  },
  methods: {
    addBox (left, src) {
      const div = document.createElement('div')
      const img = document.createElement('img')
      div.appendChild(img)
      img.className = 'roll'
      img.src = src
      div.style.left = left + 'px'
      // div.style.height = 80 + 'px'
      div.className = 'redBox'
      document.getElementById('fallWrapper').appendChild(div)
      setTimeout(function () {
        document.getElementById('fallWrapper').removeChild(div)
      }, 3000)
    },
    touchstart (e) {
      this.offset = e.touches[0].clientX - this.bucketLeft
    },
    touchmove (e) {
      // console.dir(this.$refs.fallWrapper)
      const x = e.touches[0].clientX - this.offset
      if (x < 0 || x > this.clientWidth - this.$refs.bucket.clientWidth) {
        return
      }
      this.bucketLeft = x
    },
    touchcancel (e) {
    },
  },
  mounted () {
    this.clientWidth = document.documentElement.clientWidth
    this.clientHeight = document.documentElement.clientHeight
    this.bucketLeft = (this.clientWidth - this.$refs.bucket.clientWidth) / 2

    setInterval(() => {
      const left = Math.random() * document.documentElement.clientWidth
      const src = '/images/luobo.png'
      this.addBox(left, src)
    }, 1500)
  }
}
</script>

<style scoped lang="scss">

  @keyframes redImg {
    0% {
      top: 0;
    }
    100% {
      top: 100%;
    }
  }

  .page {
    width: 100vw;
    height: 100vh;
    background-image: url('/images/bg2.jpg');
    background-size: 100%;

    .bucket-container {
      position: fixed;
      bottom: 20px;
      background-color: blue;
      width: 100vw;

      #bucket {
        background-color: red;
        position: fixed;
        bottom: 20px;
        height: 100px;
        width: 100px;
      }
    }

    .fall_wrapper {
      width: 94vw;
      height: 200px;
      position: fixed;
      left: 3vw;
      top: 0;
    }

    /deep/ .redBox {
      position: absolute;
      /* opacity: 0;*/
      z-index: 10000;
      animation: redImg 3s infinite linear;
      /*-webkit-animation: redImg 3s infinite linear;*/
      /*-moz-animation: redImg 3s infinite linear;*/
      /*-ms-animation: redImg 3s infinite linear;*/
      /*-o-animation: redImg 3s infinite linear;*/
    }

    /deep/ .redBox {
      position: fixed;
    }

    /deep/ .redBox img {
      display: block;
      width: 60px;
      height: 80px;
    }
  }
</style>
