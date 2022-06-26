
<template>
  <div class="loading">
    <van-loading class="loadingVant" vertical type="spinner"
      >加载中...</van-loading
    >
  </div>
</template>
 
<script lang="ts">
import {
  defineComponent,
  toRefs,
  computed,
  ref,
  reactive,
  onMounted,
} from "vue";

export default defineComponent({
  name: "",
  components: {},
  setup() {
    const reactiveData = reactive({});

    onMounted(() => {});

    return {
      ...toRefs(reactiveData),
    };
  },
});
</script>
<style scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 121;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  text-align: center;
}
</style>