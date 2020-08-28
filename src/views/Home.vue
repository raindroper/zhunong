<template>
  <div class="page">
    <div class="bucket-container">
      <div ref="bucket" id="bucket"
           :style="{left: bucketLeft + 'px'}"
           @touchstart="touchstart" @touchmove="touchmove"
           @touchcancel="touchcancel"></div>
    </div>
    <div class="fall_wrapper" id="fallWrapper" ref="fallWrapper">
      <fall :left-range="fallRange" :bucket-position="bucketPosition" :fall="item" @detective="checkPosition(item.id)"
            v-for="item in fallList"
            :key="item.id"/>
    </div>
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
      bucketPosition: 500,
      clientWidth: 100,
      clientHeight: 100,
      bucketLeft: 0,
      offset: 0,
      bucketWidth: 100,
      fallList: [],
      fallRange: 320
    }
  },
  methods: {
    touchstart (e) {
      this.offset = e.touches[0].clientX - this.bucketLeft
    },
    touchmove (e) {
      const x = e.touches[0].clientX - this.offset
      if (x < 0 || x > this.clientWidth - this.$refs.bucket.clientWidth) {
        return
      }
      this.bucketLeft = x
    },
    touchcancel (e) {
    },
    checkPosition (id) {
      const index = this.fallList.findIndex(item => item.id === id)
      if (index > -1) {
        this.fallList.splice(index, 1)
      }
    }
  },
  mounted () {
    this.clientWidth = document.documentElement.clientWidth
    this.clientHeight = document.documentElement.clientHeight
    this.bucketLeft = (this.clientWidth - this.$refs.bucket.clientWidth) / 2
    console.dir(this.$refs.bucket)
    this.bucketPosition = this.$refs.bucket.offsetTop

    this.fallRange = this.$refs.fallWrapper.clientWidth

    setInterval(() => {
      this.fallList.push({ src: '/images/luobo.png', id: new Date().getTime() })
    }, 1000)
  }
}
</script>

<style scoped lang="scss">

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
      width: 80vw;
      height: 200px;
      position: fixed;
      left: 10vw;
      top: 0;
    }
  }
</style>
