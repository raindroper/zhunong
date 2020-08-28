<template>
    <div class="fall-item-container" :style="{ top: top + 'px', left: left + 'px' }" ref="fallItem">
        <img :src="fall.src" alt="">
    </div>
</template>

<script>
export default {
  name: 'Fall',
  props: {
    fall: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    bucketPosition: {
      type: Number,
      required: true,
    },
    leftRange: {
      type: Number,
      required: true,
    },
  },
  data () {
    return {
      top: 0,
      unitTime: 20, // 刷新率 多久更新位置
      left: 0,
    };
  },
  mounted () {
    const fallHeight = this.$refs.fallItem.clientHeight;
    this.top = -fallHeight;
    this.left = Math.random() * this.leftRange;

    const windowHeight = document.documentElement.clientHeight;
    const step = windowHeight / (this.fall.time / this.unitTime);
    const interval = setInterval(() => {
      if (this.fall && Object.keys(this.fall)) {
        if (this.top + this.$refs.fallItem.clientHeight >= this.bucketPosition && this.top + this.$refs.fallItem.clientHeight <= this.bucketPosition + step * 2) {
          const width = this.$refs.fallItem.clientWidth;
          this.$emit('detective', { id: this.fall.id, left: this.left, width, score: this.fall.score });
        }
        if (this.top >= windowHeight) {
          clearInterval(interval);
          this.$emit('remove', this.fall.id);
        }
        this.top += step;
      } else {
        clearInterval(interval);
      }
    }, this.unitTime);
    this.$once('hook:beforeDestroy', () => {
      clearInterval(interval);
    });
  },
};
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
