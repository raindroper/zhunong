<template>
    <div class="page">
        <div class="bucket-container">
            <div ref="bucket" id="bucket"
                 :style="{left: bucketLeft + 'px'}"
                 @touchstart="touchstart" @touchmove="touchmove"
                 @touchcancel="touchcancel"></div>
        </div>
        <div class="fall_wrapper" id="fallWrapper" ref="fallWrapper">
            <fall @remove="remove" :left-range="fallRange" :bucket-position="bucketPosition" :fall="item"
                  @detective="checkPosition"
                  v-for="item in fallList"
                  :key="item.id" />
        </div>
        <div class="score_wrapper">
            <img src="/images/fengshu1.png" alt="score">
            <span>{{totalScore}}</span>
        </div>
    </div>
</template>

<script>

import Fall from '../components/Fall';

export default {
  name: 'home',
  components: {
    Fall,
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
      fallRange: 320,
      fallWrapperOffset: 40,

      totalScore: 0,

      time: 10,
    };
  },
  methods: {
    touchstart (e) {
      this.offset = e.touches[0].clientX - this.bucketLeft;
    },
    touchmove (e) {
      const x = e.touches[0].clientX - this.offset;
      if (x < 0 || x > this.clientWidth - this.$refs.bucket.clientWidth) {
        return;
      }
      this.bucketLeft = x;
    },
    touchcancel (e) {
    },
    checkPosition (fall) {
      const { id, left, width, score } = fall;
      // 判断是否在bucket范围内
      if ((left + width + this.fallWrapperOffset /* 需加上容器的偏移 */) >= this.bucketLeft && left < (this.bucketWidth + this.bucketLeft)) {
        this.remove(id);
        this.totalScore += score;
      }
    },
    remove (id) {
      const index = this.fallList.findIndex(item => item.id === id);
      if (index > -1) {
        this.fallList.splice(index, 1);
      }
    },

  },
  mounted () {
    this.clientWidth = document.documentElement.clientWidth;
    this.clientHeight = document.documentElement.clientHeight;
    this.bucketLeft = (this.clientWidth - this.$refs.bucket.clientWidth) / 2;
    this.bucketWidth = this.$refs.bucket.clientWidth;
    this.fallWrapperOffset = this.$refs.fallWrapper.offsetLeft;
    this.bucketPosition = this.$refs.bucket.offsetTop;

    this.fallRange = this.$refs.fallWrapper.clientWidth;

    const fallTypeList = [
      { src: '/images/luobo.png', score: 5, time: 1000 },
      { src: '/images/pingguo.png', score: 10, time: 2000 },
      { src: '/images/qiezi.png', score: 15, time: 3000 },
    ];

    let id = 0;
    let fallTimer = null;
    const addFall = () => {
      const timing = Math.random() * 800;
      const fall = Object.assign({}, fallTypeList.sort(() => Math.random() - 0.5)[0]);
      fall.id = id++;
      this.fallList.push(fall);
      fallTimer = setTimeout(addFall, timing);
    };

    addFall();

    const timer = setInterval(() => {
      console.log(this.time);
      if (this.time <= 0) {
        clearInterval(timer);
        clearTimeout(fallTimer);
      }
      this.time--;
    }, 1000);
  },
};
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
