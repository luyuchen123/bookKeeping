<template>
  <div class="cal">
    <p class="calNum">{{ calNum }}</p>
    <van-search v-model="mark" placeholder="点击填写备注" />
    <div class="keyboard">
      <van-number-keyboard
        class="number"
        :show="true"
        extra-key="."
        @input="onInput"
        @delete="onDelete"
      />
      <div class="opt">
        <div class="item">
          <div class="button date" @click="calendarShow = true">
            {{ dateName }}
          </div>
        </div>
        <div class="item"><div class="button" @click="calOpt('+')">+</div></div>
        <div class="item"><div class="button" @click="calOpt('-')">-</div></div>
        <div class="item">
          <div class="button" @click="handleConfirm">{{ confirmTxt }}</div>
        </div>
      </div>
    </div>
    <van-calendar
      v-model:show="calendarShow"
      @confirm="onConfirm"
      :min-date="minDate"
    />
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
export default defineComponent({
  props: ["editParams"],
  setup(props, { emit }) {
    //编辑时的值
    onMounted(() => {
      if (props.editParams) {
        mark.value = props.editParams.remarks;
        num.value = props.editParams.amount;
        date.value = formatDate(props.editParams.timestap);
      }
    });

    const mark = ref<string>(""); //备注
    const calendarShow = ref<boolean>(false);
    //时间相关
    const formatDate = (date: Date) =>
      `${String(date.getFullYear())}/${
        Number(date.getMonth()) + 1 < 10 ? "0" : ""
      }${date.getMonth() + 1}/${
        Number(date.getDate()) < 10 ? "0" : ""
      }${date.getDate()}`;
    const date = ref<string>(formatDate(new Date()));
    const dateName = computed(() => {
      console.log(date.value, formatDate(new Date()));
      return date.value === formatDate(new Date()) ? "今天" : date.value;
    });
    const onConfirm = (value: Date) => {
      calendarShow.value = false;
      date.value = formatDate(value);
    };
    //计算相关
    // const valid = (): boolean => {
    //   // if (!num1.value) {
    //   //   return false;
    //   // }
    //   return true;
    // };
    const optStr = ref<string>(""); //记录 + -
    const num = ref<string>(""); // 加数 、被减数
    const num1 = ref<string>(""); // 被加数 、 减数
    const calNum = computed(() => {
      const val = num.value + optStr.value + num1.value;
      return val ? val : 0;
    });
    const onInput = (e: string) => {
      const reg = /\.+$/g;

      const validhasPoint = reg.test(num.value);
      const inputPoint = e === ".";
      const optArr = ["+", "-"];
      //  有小数点的情况不增加小数点 为空时不允许有符号
      if (
        (validhasPoint && inputPoint) ||
        (num.value === "" && optArr.includes(e))
      ) {
        return;
      }
      if (optArr.includes(e)) {
        optStr.value = e;
        return;
      }

      if (!optStr.value) {
        if (num.value === "" && inputPoint) {
          num.value = "0";
        }
        num.value = num.value + e;
      } else {
        if (num1.value === "" && inputPoint) {
          num1.value = "0";
        }
        num1.value = num1.value + e;
      }
    };
    const onDelete = () => {
      if (optStr.value) {
        if (num1.value) {
          num1.value = num1.value.slice(0, num1.value.length - 1);
        } else {
          optStr.value = "";
        }
      } else {
        const temNum = String(num.value);
        num.value = temNum.slice(0, temNum.length - 1);
        num.value === "-" && (num.value = "");
      }
    };
    const calOpt = (value: string) => {
      if (num.value === "") {
        return;
      }
      //有计算的先得出结果
      if (optStr.value) {
        handleConfirm();
      }
      optStr.value = value;
    };
    const handleConfirm = () => {
      const reg = /\.$/;
      //计算相关表达式
      if (optStr.value) {
        let value: number = 0;
        //避免.为后缀
        if (reg.test(num.value)) {
          num.value = num.value.slice(0, num.value.length - 1);
        }
        if (reg.test(num1.value)) {
          num1.value = num1.value.slice(0, num1.value.length - 1);
        }

        if (optStr.value === "+") {
          value = Number(num.value) + Number(num1.value);
        }
        if (optStr.value === "-") {
          value = Number(num.value) - Number(num1.value);
        }

        num.value = String(
          value === Number.parseInt(String(value)) ? value : value.toFixed(2)
        );
        num1.value = "";
        optStr.value = "";
        return;
      }
      reg.test(num.value) &&
        (num.value = num.value.slice(0, num.value.indexOf(".")));
      //发请求
      const params: Ical = {
        amount: Number(calNum.value),
        timestap: date.value,
        remarks: mark.value,
      };
      emit("add-bookkeeping", params);
    };
    const confirmTxt = computed(() => (optStr.value ? "=" : "确定"));
    return {
      calNum,
      mark,
      calendarShow,
      dateName,
      minDate: new Date(2010, 0, 1),
      onConfirm,
      calOpt,
      confirmTxt,
      onInput,
      onDelete,
      handleConfirm,
    };
  },
});
</script>
<style lang="less" scoped>
@background: #f2f3f5;
@radius-lg: 0.16667rem;
.cal {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background-color: @background;
  p {
    font-size: 48px;
    height: 40px;
    line-height: 40px;
  }
  .calNum {
    margin: 0 20px !important;
    // height: 30%;
    font-weight: 500;
    text-align: right;
  }
  /deep/ .van-search {
    height: 45px;
    background-color: @background;
  }
  .keyboard {
    display: flex;
    justify-content: flex-end;
    align-content: center;
    /deep/ .van-number-keyboard {
      width: 75%;
      padding-bottom: 0;
    }
    .opt {
      width: 25%;
      display: flex;
      flex-direction: column;
      position: fixed;
      bottom: 0;
      // padding: 0 0.125rem 0.125rem 0;
      overflow: hidden;
      .item {
        flex: 1;
        padding: 0 0.125rem 0.125rem 0;
        font-size: 0.583rem;
        .button {
          height: 1rem;
          background: #fff;
          border-radius: @radius-lg;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .button.date {
          font-size: 0.4rem;
        }
      }
    }
  }
}
</style>
