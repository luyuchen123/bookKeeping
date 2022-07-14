<template>
  <van-swipe-cell>
    <div class="item-list-show">
      <div
        class="icon"
        :style="
          !re.sellPrice
            ? ''
            : re.sellPrice - re.buyingPrice > 0
            ? 'background: red'
            : 'background: green'
        "
      ></div>
      <!-- <div class="line" v-if="index !== item.stockItems.length - 1"></div> -->
      <div class="buy">
        买入:
        <span @click="handlerEmit('editStock', re)" v-show="!re.sellPrice">{{
          re.buyingPrice
        }}</span>
        <span v-show="re.sellPrice" class="disEdit">{{ re.buyingPrice }}</span>
      </div>
      <div class="sell">
        <div class="sellPrive" v-if="re.sellPrice">
          {{ `卖出: ${re.sellPrice}` }}
        </div>
        <div class="num" v-else>
          <p>库存:</p>
          <van-icon
            class-prefix="iconfont el-icon-book_kucun"
            :badge="re._stockNum"
            @click="handlerEmit('editStock', re)"
          />
        </div>
      </div>
      <div
        class="detail"
        :class="[re.remarks ? '' : 'noRemarks', re.sellPrice ? 'isSell' : '']"
      >
        <div class="time">
          {{ !re.sellPrice ? re.timestap : `数量：${re._stockNum}` }}
        </div>
        <div class="remarks" :title="re.remarks">
          {{ re.remarks }}
        </div>
        <van-icon
          class="button iconfont"
          :class="
            !re.sellPrice
              ? 'el-icon-book_cangpeitubiao_chukuhuanhuochuku'
              : 'el-icon-book_shezhi'
          "
          plain
          hairline
          @click="handlerEmit('editStockItem', [re, !re.sellPrice ? 1 : 2])"
          >{{ !re.sellPrice ? "出库" : "编辑" }}</van-icon
        >
      </div>
    </div>
    <template #right>
      <van-button
        class="delBtn"
        type="danger"
        @click="handlerEmit('deleteStock', re._id)"
        >删除</van-button
      >
    </template>
  </van-swipe-cell>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: ["re"],
  setup(props, { emit }) {
    const handlerEmit = (event: string, args?: any) => {
      emit(event, args);
    };
    return {
      handlerEmit,
    };
  },
});
</script>
<style lang="less" scoped>
@defaultColor: rgb(214, 206, 206);
@red: rgba(239, 67, 55, 0.784);
@green: rgba(19, 142, 0, 0.784);
.item {
  &-list-show {
    position: relative;
    display: grid;
    grid-template-columns: 10px repeat(2, 1fr) 45%;
    grid-column-gap: 5px;
    align-items: center;
    // justify-items: flex-start;
    height: 36px;
    padding: 10px;
    margin: 10px 0;
    font-size: 18px;
    .icon {
      height: 10px;
      width: 10px;
      border-radius: 50%;
      background: @defaultColor;
    }
    .line {
      position: absolute;
      height: 100%;
      border-left: 1px solid @defaultColor;
      top: 50%;
      left: 15px;
      transform: translateY(5px);
    }
    .buy {
      text-align: left;
      span {
        color: rgb(35, 163, 209);
        font-style: oblique;
        text-decoration: underline;
      }
      .disEdit {
        color: #000;
        text-decoration: none;
      }
    }
    .sell {
      .num {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .detail {
      display: grid;
      grid-template-columns: 1fr 50px;
      grid-template-rows: 18px 18px;
      align-items: center;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
      font-size: 16px;
      color: rgb(193, 190, 190);
      .time {
        font-style: oblique;
      }
      .remarks {
        grid-row-start: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .button {
        color: #23a3d1;
        grid-column-start: 2;
        grid-row-start: 1;
        transform: translateY(50%);
      }
    }
    .detail.noRemarks {
      grid-template-rows: 100%;
      .button {
        transform: translateY(0);
      }
    }
    .detail.isSell {
      // grid-template-columns: 100%;
    }
    .delBtn {
      display: none;
    }
  }

  &-list-show.isSell {
    grid-template-columns: 10px repeat(3, 1fr);
  }
  &-list-show.hasDel {
    .detail {
      display: none;
    }
    .delBtn {
      height: 36px;
      display: inline-block;
    }
  }
}
</style>
