<template>
  <div class="header">
    <van-tabs v-model:active="active" animated class="tabs">
      <van-tab
        v-for="tab in showArr"
        :title="tab.title"
        :key="tab.id"
        :name="tab.id"
      >
      </van-tab>
    </van-tabs>
    <p @click="onClickBack">取消</p>
  </div>
  <router-view></router-view>
</template>
<script lang="ts">
import router from "@/router";
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const tabsMap = new Map([
  [
    "bookKeeping",
    [
      { id: 0, title: "支出" },
      { id: 1, title: "收入" },
    ],
  ],
  ["stockControl", [{ id: 2, title: "入库" }]],
]);
export default defineComponent({
  setup() {
    const store = useStore();
    const onClickBack = () => {
      store.commit("setNowType", { id: "" });
      router.push({
        name: "Index",
        params: {
          addType: String(cacheType),
        },
      });
    };
    interface Itabs {
      id: number;
      title: string;
    }
    const showArr = ref<Itabs[]>([]);
    const active = ref<number>(0);
    // 参数传过来判断
    const { type = 0, _id = "", iconId = "", addType = "" } = useRoute().query;
    const cacheType = addType;
    showArr.value = tabsMap.get(String(addType)) || []; //上方类型
    if (showArr.value.length) {
      active.value = showArr.value[0].id;
    }
    //有类型id，编辑状态
    if (_id) {
      active.value = Number(type);
      store.commit("setEditorIconId", { class: iconId });
      store.commit("setEditorItemId", { id: _id });
    }
    watch(
      () => active.value,
      (val) => {
        store.commit("setNowType", { id: val });
      },
      {
        immediate: true,
      }
    );
    return {
      active,
      showArr,
      onClickBack,
    };
  },
});
</script>
<style lang="less" scoped>
.header {
  height: 5vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .tabs {
    flex-grow: 2;
    max-width: 80vw;
  }
  p {
    font-size: var(--van-tab-font-size);
  }
}
</style>
