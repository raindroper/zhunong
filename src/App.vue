<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
export default {
  mounted () {
    console.log('0830');
    document.body.addEventListener('touchmove', function (e) {
      e.preventDefault(); // 阻止默认的处理方式(阻止下拉滑动的效果)
    }, { passive: false }); // passive 参数不能省略，用来兼容ios和android
  },
};
</script>
<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;
        a {
            font-weight: bold;
            color: #2c3e50;
            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>
