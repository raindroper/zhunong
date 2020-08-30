<template>
    <div class="page">
        <template v-if="!endFlag">
            <div class="bucket-container">
                <div ref="bucket" id="bucket"
                     :style="{left: bucketLeft + 'px'}"
                     @touchstart="touchstart" @touchmove="touchmove"
                     @touchcancel="touchcancel">
                    <img src="/images/kuang.png" alt="">
                </div>
            </div>
            <div class="fall_wrapper" id="fallWrapper" ref="fallWrapper">
                <fall @remove="remove" :left-range="fallRange" :bucket-position="bucketPosition" :fall="item"
                      @detective="checkPosition"
                      v-for="item in fallList"
                      :key="item.id" />
            </div>
            <div class="total-score_wrapper top_wrapper">
                <img src="/images/fengshu1.png" alt="score">
                <span class="score_text text">{{totalScore}}</span>
            </div>
            <div class="total-time_wrapper top_wrapper">
                <img src="/images/time.png" alt="score">
                <span class="time_text text">{{time}}</span>
            </div>
            <div class="score-item_wrapper" ref="scoreWrapper"></div>
            <div class="audio-control" :class="{'active': musicPlay}" @click="musicControl">
                <img src="/images/music.png" alt="">
            </div>
            <div class="desc" @click="start" v-if="startFlag">
                <img src="/images/youxi.png" alt="">
            </div>
        </template>
        <template v-else>
            <div class="game-result_wrapper" v-if="totalScore < 100">
                <img src="/images/jieguo.png" alt="" class="game-result_title">
                <img src="/images/fengshu.png" alt="" class="game-result_score">
                <img src="/images/zwyc.png" alt="" class="game-result_btn" @click="replay">
                <div class="game-result_text">
                    <p>您获得{{totalScore}}分</p>
                    <p>只有获得100分及以上</p>
                    <p>才可获得海报！</p>
                </div>
            </div>
            <div class="game-poster_wrapper" v-else>
                <img src="/images/海报.jpg" alt="">
            </div>
        </template>
        <template v-if="!startFlag">
            <div class="count_wrapper">
                <transition name="fade">
                    <img v-if="count === 3" class="count_img" :src="`/images/3.png`" alt="">
                </transition>
                <transition name="fade">
                    <img v-if="count === 2" class="count_img" :src="`/images/2.png`" alt="">
                </transition>
                <transition name="fade">
                    <img v-if="count === 1" class="count_img" :src="`/images/1.png`" alt="">
                </transition>
                <transition name="fade">
                    <img v-if="count === 0" class="count_img" :src="`/images/0.png`" alt="">
                </transition>
            </div>
        </template>
        <audio src="/music/music.mp3" loop style="display: none;" ref="music" autoplay></audio>
    </div>
</template>

<script>

import Fall from '../components/Fall';
import audioInfo from '../utils/audioInfo';
import Toast from 'vant/lib/toast';
import 'vant/lib/toast/style';

function request (url) {
  return new Promise(resolve => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    // 这里需要设置xhr response的格式为arraybuffer
    // 否则默认是二进制的文本格式
    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = function () {
      // 请求完成，并且成功
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(xhr.response);
      }
    };
    xhr.send();
  });
}

function play (context, decodeBuffer) {
  // 调用resume恢复播放
  context.resume();
  let source = context.createBufferSource();
  source.loop = true;

  source.buffer = decodeBuffer;
  source.connect(context.destination);
  source.start(0);
}

const scoreMap = {
  '5': '/images/5.png',
  '10': '/images/10.png',
  '15': '/images/15.png',
};

export default {
  name: 'home',
  components: {
    Fall,
    Toast,
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
      musicPlay: true,
      startFlag: true,
      context: null,
      endFlag: false,

      count: 3,

      bucketEasy: 0.7,
    };
  },
  methods: {
    musicControl () {
      if (this.musicPlay) {
        // this.context.suspend();
        this.$refs.music.pause();
        this.musicPlay = false;
      } else {
        // this.context.resume();
        this.$refs.music.play();
        this.musicPlay = true;
      }
    },
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
      if ((left + width + this.fallWrapperOffset /* 需加上容器的偏移 */) >= (this.bucketLeft + this.bucketWidth * (1 - this.bucketEasy) / 2)
        && left < (this.bucketWidth * (this.bucketEasy / 2) + this.bucketLeft)) {
        this.addScore(left, score);
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
    addScore (left, score) {
      const div = document.createElement('div');
      const img = document.createElement('img');
      div.appendChild(img);
      img.className = 'score-roll_img';
      img.src = scoreMap[score];
      div.style.left = left + 'px';
      div.className = 'score-roll_box';
      this.$refs.scoreWrapper.appendChild(div);
      setTimeout(() => {
        this.$refs.scoreWrapper.removeChild(div);
      }, 3000);
    },
    async playAudio (context, url) {
      console.log('playAudio');
      const audioMedia = await request(url);
      context.decodeAudioData(audioMedia, decode => play(context, decode));
    },
    start () {
      console.dir(this.$refs.music.paused);
      if (this.$refs.music.paused) {
        this.$refs.music.play();
      }
      this.startFlag = false;
      const fallTypeList = [
        { src: '/images/luobo.png', score: 5, time: 1500 },
        { src: '/images/pingguo.png', score: 10, time: 1000 },
        { src: '/images/qiezi.png', score: 15, time: 700 },
      ];

      const startCount = setInterval(() => {
        if (this.count <= -1) {
          let id = 0;
          let fallTimer = null;
          const addFall = () => {
            const timing = Math.random() * 400 + 500;
            const fall = Object.assign({}, fallTypeList.sort(() => Math.random() - 0.5)[0]);
            fall.id = id++;
            this.fallList.push(fall);
            fallTimer = setTimeout(addFall, timing);
          };
          addFall();
          const timer = setInterval(() => {
            if (this.time <= 0) {
              clearInterval(timer);
              clearTimeout(fallTimer);
              this.end();
              return;
            }
            this.time--;
          }, 1000);
          clearInterval(startCount);
          return;
        }
        this.count--;
      }, 1000);

    },
    end () {
      this.fallList = [];
      this.endFlag = true;
      if (this.totalScore >= 100) {
        Toast({
          message: '长按屏幕保存海报',
          duration: 5000,
        });
      }
    },
    replay () {
      this.time = 10;
      this.totalScore = 0;
      this.endFlag = false;
      this.startFlag = true;
      this.count = 3;
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

    console.log('readyState', this.$refs.music.readyState);
    // alert(this.$refs.music.readyState);
  },
  created () {
    // this.context = new (window.AudioContext || window.webkitAudioContext)();
    // const context = this.context;
    // 如果能够自动播放
    // const url = '/music/music.mp3';
    // audioInfo.init(() => this.playAudio(context, url));
    // if (audioInfo.autoplay) {
    //   this.playAudio(context, url);
    // }
    NProgress.done();
    clearInterval(spinTimer);
  },
};
</script>
<style lang="scss">
    @keyframes redImg {
        0% {
            bottom: 180px;
        }
        100% {
            bottom: 100%;
        }
    }

    .score-roll_box {
        position: fixed;
        /* opacity: 0;*/
        z-index: 1000;
        animation: redImg 3s infinite linear;
        -webkit-animation: redImg 3s infinite linear;
        -moz-animation: redImg 3s infinite linear;
        -ms-animation: redImg 3s infinite linear;
        -o-animation: redImg 3s infinite linear;
        img {
            display: block;
            width: 5rem;
            height: 6.5rem;
        }
    }


</style>
<style scoped lang="scss">

    .page {
        width: 100vw;
        height: 100vh;
        background-image: url('/images/bg2.jpg');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        -webkit-overflow-scrolling: touch;
        .bucket-container {
            position: fixed;
            bottom: 20px;
            background-color: blue;
            width: 100vw;

            #bucket {
                /*background-color: red;*/
                position: fixed;
                bottom: 20px;
                height: 200px;
                width: 280px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .fall_wrapper {
            width: 80vw;
            height: 200px;
            position: fixed;
            left: 10vw;
            top: 0;
        }

        .top_wrapper {
            position: fixed;
            top: 100px;
            width: 200px;
            height: 100px;
            img {
                width: 100%;
                height: 100%;
            }
            .text {
                position: absolute;
                bottom: 30px;
                right: 45px;
            }
        }

        .total-score_wrapper {
            left: 440px;
        }
        .total-time_wrapper {
            left: 120px;
            .time_text {
                bottom: 26px;
            }
        }

        @keyframes turn {
            0% {
                -webkit-transform: rotate(0deg);
            }
            25% {
                -webkit-transform: rotate(90deg);
            }
            50% {
                -webkit-transform: rotate(180deg);
            }
            75% {
                -webkit-transform: rotate(270deg);
            }
            100% {
                -webkit-transform: rotate(360deg);
            }
        }
        .audio-control {
            position: fixed;
            z-index: 999999;
            right: 30px;
            top: 30px;
            width: 60px;
            height: 60px;
            img {
                height: 100%;
                width: 100%;
            }
            &.active {
                animation: turn 3s infinite linear;
            }
        }

        .desc {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 999999;
            background-color: rgba(0, 0, 0, 0.5);
            img {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 80%;
                -webkit-transform: translate(-50%, -50%);
                -moz-transform: translate(-50%, -50%);
                -ms-transform: translate(-50%, -50%);
                -o-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
            }
        }

        .game-result_wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
            height: 50vh;
            position: fixed;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            .game-result_title {
                width: 400px;
            }
            .game-result_score {
                width: 550px;
            }
            .game-result_btn {
                width: 300px;
            }
            .game-result_text {
                position: absolute;
                top: 220px;
                left: 50%;
                -webkit-transform: translateX(-50%);
                -moz-transform: translateX(-50%);
                -ms-transform: translateX(-50%);
                -o-transform: translateX(-50%);
                transform: translateX(-50%);
                width: 100%;
                font-size: 40px;
                color: rgb(207, 113, 103);
                line-height: 1.5;
                font-weight: bolder;
            }
        }
        .game-poster_wrapper {
            width: 100%;
            height: 100%;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .count_img {
            position: fixed;
            top: 50%;
            left: 50%;
            height: 400px;
            width: auto;
            transform: translate(-50%, -50%) scale(1);
        }

        .fade-enter-active, .fade-leave-active {
            transition: all .5s;
        }

        .fade-enter, .fade-leave-to {
            opacity: 0;
        }
    }
</style>
