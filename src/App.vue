<template>
  <loading v-show="loading"></loading>
  <router-view />
</template>
<script lang="ts">
import { useStore } from "vuex";
import Loading from "@/components/loading.vue";
import { defineComponent, computed, onBeforeMount } from "vue";
import service from "@/service/login";
export default defineComponent({
  name: "App",
  components: {
    Loading,
  },
  setup() {
    const store = useStore();
    onBeforeMount(() => {
      service.goTest((errStatus) => {
        if (!errStatus) {
          store.commit("setLoginStatus", true);
        }
      });
    });
    return {
      loading: computed(() => store.state.loading),
    };
  },
});
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  p {
    padding: 0;
    margin: 0;
  }
}
</style>

function created() { throw new Error("Function not implemented."); }
