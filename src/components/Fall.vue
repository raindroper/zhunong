<template>
  <div class="fall-item-container" :style="{ top: top + 'px', left: left + 'px' }" ref="fallItem">
    <img :src="src" alt="">
  </div>
</template>

<script>
export default {
  name: 'Fall',
  props: {
    fall: {
      type: Object,
      required: true,
      default: () => ({})
    },
    bucketPosition: {
      type: Number,
      required: true
    },
    leftRange: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      src: '/images/luobo.png',
      time: 3000, // 走完所需时间
      top: 0,
      unitTime: 20, // 刷新率 多久更新位置
      left: 0
    }
  },
  mounted () {
    this.top = -this.$refs.fallItem.clientHeight
    this.left = Math.random() * this.leftRange

    const windowHeight = document.documentElement.clientHeight
    const step = windowHeight / (this.time / this.unitTime)
    const interval = setInterval(() => {
      if (this.fall && Object.keys(this.fall)) {
        if (this.top + this.$refs.fallItem.clientHeight >= this.bucketPosition) {
          this.$emit('detective')
        }
        if (this.top >= windowHeight) {
          clearInterval(interval)
        }
        this.top += step
      } else {
        clearInterval(interval)
      }
    }, this.unitTime)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(interval)
    })
  }
}
</script>

<style scoped lang="scss">
  .fall-item-container {
    top: 0;
    width: 80px;
    height: 80px;
    position: absolute;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
