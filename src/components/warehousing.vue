<template>
  <div class="container">
    <van-form label-align="center" ref="form">
      <van-cell-group inset>
        <div style="position: relative">
          <van-field
            v-show="isExwarehouse === 0 || isExwarehouse === 2"
            v-model.number="buyingPrice"
            label="买入价格"
            placeholder="请输入"
            name="buyingPrice"
            :rules="[{ pattern, message: '只允许输入数字' }]"
          />

          <van-field
            v-show="isExwarehouse"
            v-model.number="sellPrice"
            label="卖出价格"
            placeholder="请输入"
            name="sellPrice"
            :rules="[
              { pattern, message: '只允许输入数字' },
              { validator, message: '卖出价格需要大于0' },
            ]"
          />

          <van-button
            type="default"
            class="button"
            v-show="num > 1"
            @click="hanglerNum"
            >÷</van-button
          >
        </div>

        <van-field name="stepper" label="数量">
          <template #input>
            <van-stepper v-model="num" />
          </template>
        </van-field>

        <van-field
          v-show="isExwarehouse === 0 || isExwarehouse === 2"
          v-model="timestap"
          is-link
          readonly
          name="calendar"
          label="买入日期"
          placeholder="点击选择日期"
          @click="
            showCalendar = true;
            timeType = 1;
          "
        />

        <van-field
          v-show="isExwarehouse"
          v-model="sellTimestap"
          is-link
          readonly
          name="calendar"
          label="卖出日期"
          placeholder="点击选择日期"
          @click="
            showCalendar = true;
            timeType = 0;
          "
        />
        <van-calendar
          v-model:show="showCalendar"
          :min-date="minDate"
          :default-date="
            new Date(timeType ? timestap : sellTimestap ? sellTimestap : '')
          "
          @confirm="onConfirm"
        />

        <van-field
          v-model="remarks"
          label="备注"
          name="remarks"
          v-show="isExwarehouse === 0 || isExwarehouse === 2"
        />
      </van-cell-group>

      <div style="margin: 16px">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          @click="toWareHousing"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { ref } from "vue";
export default defineComponent({
  props: {
    editParams: {
      type: Object,
    },
    isExwarehouse: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const form = ref();
    const isExwarehouse = computed(() => props?.isExwarehouse); //0 ===》 入库  1==》 出库   2==》 编辑库存信息
    const format = (date: Date): string => {
      return `${date.getFullYear()}/${date.getMonth() + 1 < 10 ? "0" : ""}${
        date.getMonth() + 1
      }/${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;
    };

    const buyingPrice = ref("");
    const sellPrice = ref("");
    const num = ref(1);
    const remarks = ref("");
    const timestap = ref(format(new Date()));
    const sellTimestap = ref(format(new Date()));
    const pattern = /\d/;
    const validator = (val: number) => val > 0;

    onMounted(() => {
      if (isExwarehouse.value !== 1 && props.editParams) {
        const {
          buyingPrice: a,
          num: b,
          remarks: c,
          timestap: d,
          sellPrice: e,
          sellTimestap: f,
        } = props.editParams;
        buyingPrice.value = a;
        num.value = b;
        remarks.value = c;
        timestap.value = d;
        sellPrice.value = e;
        sellTimestap.value = f;
      }
    });

    const timeType = ref(0); //0 ==》 卖出时间  1==》 买入时间
    const showCalendar = ref(false);
    const onConfirm = (date: Date) => {
      if (timeType.value === 0) {
        sellTimestap.value = format(date);
      } else {
        timestap.value = format(date);
      }

      showCalendar.value = false;
    };
    const toWareHousing = async (): Promise<void> => {
      try {
        const validName = isExwarehouse.value ? "sellPrice" : "buyingPrice";
        await form.value.validate(validName);
        //出库
        if (isExwarehouse.value === 1) {
          emit("wareHousing", {
            sellPrice: sellPrice.value,
            sellNum: num.value,
            sellTimestap: sellTimestap.value,
          });
        } else if (isExwarehouse.value === 2) {
          emit("wareHousing", {
            buyingPrice: buyingPrice.value,
            sellPrice: sellPrice.value,
            _stockNum: num.value,
            remarks: remarks.value,
            timestap: timestap.value,
            sellTimestap: sellTimestap.value,
            isEditStockItem: true,
          });
        } else {
          //编辑
          emit("wareHousing", {
            buyingPrice: buyingPrice.value,
            _stockNum: num.value,
            remarks: remarks.value,
            timestap: timestap.value,
          });
        }
      } catch (error) {}
    };

    const hanglerNum = () => {
      if (isExwarehouse.value) {
        sellPrice.value = (Number(sellPrice.value) / num.value).toFixed(2);
      } else {
        buyingPrice.value = (Number(buyingPrice.value) / num.value).toFixed(2);
      }
    };
    return {
      form,
      isExwarehouse,
      buyingPrice,
      sellPrice,
      num,
      remarks,
      pattern,
      timestap,
      sellTimestap,
      showCalendar,
      minDate: new Date(2010, 0, 1),
      timeType,
      validator,
      toWareHousing,
      onConfirm,
      hanglerNum,
    };
  },
});
</script>
<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  /deep/ .van-form {
    height: 100%;
    display: grid;
    grid-template-rows: 75% 25%;
    .van-cell-group {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    .van-button {
      width: 50%;
      transform: translateX(50%);
    }
  }
  .button {
    height: 24px;
    width: 24px !important;
    position: absolute;
    right: 24px;
    top: 12px;
  }
  // background: red;
}
</style>
