<template>
  <div class="">
    <div id="redzone">
    </div>
  </div>
</template>

<script>

export default {
  name: 'hongbao',
  data () {
    return {}
  },
  computed: {},
  methods: {
    addBao: function (left, height, src) {
      var div = document.createElement('div')
      var img = document.createElement('img')
      div.appendChild(img)
      img.className = 'roll'
      img.src = src
      div.style.left = left + 'px'
      div.style.height = height + 'px'
      div.className = 'redBox'
      document.getElementById('redzone').appendChild(div)
      setTimeout(function () {
        document.getElementById('redzone').removeChild(div)
        //  console.log(window.innerHeight);
      }, 3000)
    },

  },
  mounted () {
    let vueObject = this
    setInterval(function () {
      var left = Math.random() * document.body.scrollWidth
      var height = Math.random() * document.body.scrollHeight
      var src = '/images/luobo.png'
      vueObject.addBao(left, height, src)
    }, 500)
  }
}
</script>
<style>
  @keyframes redImg {
    0% {
      top: 0;
    }
    100% {
      top: 100%;
    }
  }

  .redBox {
    position: absolute;
    /* opacity: 0;*/
    z-index: 10000;
    animation: redImg 3s infinite linear;
    -webkit-animation: redImg 3s infinite linear;
    -moz-animation: redImg 3s infinite linear;
    -ms-animation: redImg 3s infinite linear;
    -o-animation: redImg 3s infinite linear;
  }

  .redBox {
    position: fixed;
  }

  .redBox img {
    display: block;
    width: 5rem;
    height: 6.5rem;
  }
</style>
