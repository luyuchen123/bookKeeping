<template>
  <list :getList="listFn" />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import list from "@/components/List.vue";
import service from "@/service/bookKeeping";
import { useStore } from "vuex";
export default defineComponent({
  name: "bookKeeping",
  components: { list },
  setup() {
    const store = useStore();
    const listFn = (
      pageIndex: number,
      pageSize: number,
      searchValue: string
    ) => {
      return new Promise((resolve) => {
        const callback: ICallBack = (errStatus, res) => {
          if (!errStatus) {
            if (Array.isArray(res?.bookKeepingResponse.list)) {
              resolve(res?.bookKeepingResponse ?? {});
            }
          } else {
            resolve({ finished: true });
          }
        };
        service.getList(
          {
            pageIndex,
            pageSize,
            searchValue,
            timeStap: store.state.nowTimeStap,
          },
          callback
        );
      });
    };
    return {
      listFn,
    };
  },
});
</script>
<style lang="less" scoped></style>
