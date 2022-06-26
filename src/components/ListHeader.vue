<template>
  <div class="header-container">
    <div class="header-container-left" v-if="showTime">
      <p class="year">{{ showYear }}</p>
      <div class="month" @click="changeTime">
        <p>{{ showMonth }}</p>
        <van-icon name="arrow-down" size="24" />
      </div>
    </div>
    <div class="line" v-if="showTime"></div>
    <div class="header-container-right" :style="showTime ? '' : 'width: 100%;'">
      <div v-for="(item, index) in categorys" :key="index" class="item">
        <div class="item-name">{{ item.lable }}</div>
        <div class="item-value">{{ parseInt(item.value) }}</div>
      </div>
    </div>
  </div>
  <van-popup
    v-model:show="timeChangeFlag"
    position="bottom"
    :style="{ height: '30%' }"
  >
    <van-datetime-picker
      v-model="currentDate"
      round
      type="year-month"
      title="选择年月"
      :formatter="formatter"
      @confirm="setTime"
      @cancel="timeChangeFlag = false"
    />
  </van-popup>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import eventBus from "@/util/eventBus";
const categorysMap = new Map([
  [
    "bookKeeping",
    [
      { label: "收入", value: "income" },
      { label: "支出", value: "pay" },
    ],
  ],
  [
    "stockControl",
    [
      { label: "盈利", value: "profit" },
      { label: "库存", value: "Inwarehouse" },
    ],
  ],
]);
export default defineComponent({
  props: ["active"],
  setup(props, { emit }) {
    const store = useStore();
    //初始化时间
    const year = ref(new Date().getFullYear());
    const month = ref(new Date().getMonth());
    const initTime = () => {
      year.value = new Date().getFullYear();
      month.value = new Date().getMonth();
    };
    //一些展示数据
    const showYear = computed(() => `${year.value}年`);
    const showMonth = computed(
      () => `${month.value < 10 ? "0" : ""}${month.value + 1}月`
    );
    const currentDate = computed(() => new Date(year.value, month.value));
    const formatter = (type: string, val: number) => {
      if (type === "year") {
        return `${val}年`;
      }
      if (type === "month") {
        return `${val}月`;
      }
      return val;
    };
    const showTime = computed(() => {
      return props.active === "bookKeeping";
    });
    //修改时间
    const timeChangeFlag = ref(false);
    const changeTime = (): void => {
      timeChangeFlag.value = !timeChangeFlag.value;
    };
    const setTime = (value: Date) => {
      year.value = value.getFullYear();
      month.value = value.getMonth();
      timeChangeFlag.value = false;
    };
    //时间修改时触发搜索
    watch(
      () => currentDate.value,
      (val) => {
        store.commit("setTime", {
          time: `${year.value}/${month.value < 10 ? "0" : ""}${
            Number(month.value) + 1
          }`,
        });
        eventBus.emit("time-change");
      },
      {
        immediate: true,
      }
    );

    //该月、该类型的总和。根据list数据获取，存vuex中
    const categorys = computed(() => {
      return (
        categorysMap.get(props.active)?.map((item) => {
          return { lable: item.label, value: store.state[item.value] };
        }) || []
      );
    });

    watch(
      () => props.active,
      () => {
        initTime();
      },
      {
        immediate: true,
      }
    );

    return {
      showYear,
      showMonth,
      showTime,
      timeChangeFlag,
      changeTime,
      currentDate,
      formatter,
      setTime,
      categorys,
    };
  },
});
</script>
<style lang="less" scoped>
.header-container {
  height: 10vh;
  width: 95vw;
  // background: rgba(2, 123, 13, 0.3);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 6px 10px;
  // border-radius: 10px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3),
    0px 0px 20px rgba(0, 0, 0, 0.1) inset;
  &-left {
    width: 28vw;
    .year {
      font-size: 20px;
    }
    .month {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .line {
    height: 100%;
    width: 1px;
    border-right: 1px dashed rgb(210, 204, 205);
  }
  &-right {
    width: calc(100% - 28vw);
    height: 100%;
    display: flex;
    .item {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &-name {
        font-size: 20px;
      }
      &-value {
        font-size: 48px;
        font-weight: 500;
      }
    }
  }
}
</style>
