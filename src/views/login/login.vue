<template>
  <img :src="backgroundImage" class="background" />
  <div class="container">
    <div class="card">
      <div class="section">
        <i
          class="notif fas iconfont el-icon-book_shezhi"
          @click="jumpSetting"
        ></i>
        <i class="message fas iconfont el-icon-book_tuichu"></i>
        <div class="pic">
          <img
            :src="
              detail.headPortraitImage === 'none'
                ? require('@/assets/touxiang.svg')
                : detail.headPortraitImage
            "
            alt="加载错误！"
          />
        </div>
        <div class="name">{{ detail.UserName }}</div>
        <div class="tag" v-show="detail.Phone">
          {{ `Phone: ${detail.Phone}` }}
        </div>
      </div>

      <div class="bottom-section">
        <!-- <div class="social-media">
          <a href="#"><i class="fab fas fa-envelope"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
        </div> -->
        <template v-for="(item, index) in detail.countItems" :key="index">
          <div>
            {{ Math.round(item.value) }}
            <span>{{ item.label }}</span>
          </div>
          <div
            class="border"
            v-show="index !== detail.countItems.length - 1"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import service from "@/service/login";
import { useRoute, useRouter } from "vue-router";
import Storage from "@/util/storage";
export default defineComponent({
  setup() {
    let detail = reactive({
      UserName: "",
      Phone: "",
      backgroundImage: "none",
      headPortraitImage: "none",
      countItems: [],
    });

    onMounted(() => {
      service.getUserDetail((errStatus, res) => {
        if (!errStatus) {
          detail = Object.assign(detail, res.userResponse);
          if (res?.userResponse?.backgroundImage !== "none") {
            detail.backgroundImage = `/ISAPI/BookKeeping/image?imagePath=${
              res.userResponse.backgroundImage
            }&token=${Storage.get("token")}`;
          }
          if (res?.userResponse?.headPortraitImage !== "none") {
            detail.headPortraitImage = `/ISAPI/BookKeeping/image?imagePath=${
              res.userResponse.headPortraitImage
            }&token=${Storage.get("token")}`;
          }
        }
      });
    });

    const backgroundImage = computed(() => {
      return detail.backgroundImage === "none"
        ? require("@/assets/defImg.jpg")
        : detail.backgroundImage;
    });
    //跳转到配置界面
    const router = useRouter();
    const jumpSetting = () => {
      router.push({ path: "/setting" });
    };
    return {
      detail,
      backgroundImage,
      jumpSetting,
    };
  },
});
</script>
<style lang="less" scoped>
@import url("https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/font-awesome/5.15.2/css/all.min.css");
.container {
  font-family: sans-serif;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 95vh;
  z-index: 2;
  // background: url("@/assets/defImg.jpg");
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  height: 95vh;
  width: 100vw;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.card {
  position: relative;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 0 10px #146ec273;
}

.section {
  padding: 60px 40px;
  background: #74b9ffaa;
}

.message,
.notif {
  position: absolute;
  top: 40px;
  font-size: 24px;
  cursor: pointer;
  color: #fff;
}

.message {
  right: 40px;
}

.notif {
  left: 40px;
}

.pic {
  position: relative;
  width: 150px;
  height: 150px;
  margin: auto auto 20px auto;
  padding: 4px;
  border: 2px solid #6a89cc;
  border-radius: 50%;
}

.pic img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.pic::before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  border: 1px solid #3c6382;
  left: 0;
  top: 0;
  box-sizing: border-box;
  border-radius: 50%;
  animation: animate 1.5s linear infinite;
}

@keyframes animate {
  to {
    transform: scale(1.5);
    opacity: 0;
  }
}

.name {
  color: #f1f1f1;
  font-size: 28px;
  letter-spacing: 2px;
  text-transform: inherit;
}

.tag {
  font-size: 18px;
  color: #222;
}

.bottom-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
  padding: 60px 40px;
  font-size: 28px;
  text-transform: inherit;
}

.border {
  width: 1px;
  height: 20px;
  background: #bbb;
  margin: 0 30px;
}

.bottom-section span {
  font-size: 14px;
  display: block;
}

.social-media {
  position: absolute;
  width: 100%;
  top: -30px;
  left: 0;
  z-index: 1;
}

.social-media i {
  position: relative;
  width: 60px;
  height: 60px;
  background: #2980b9;
  border-radius: 50%;
  color: #f1f1f1;
  font-size: 24px;
  line-height: 60px !important;
  margin: 0 10px;
}

.social-media i::after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  border: 1px solid #e74c3c;
  left: 0;
  top: 0;
  box-sizing: border-box;
  border-radius: 50%;
  z-index: -1;
  transform: scale(0.9);
  transition: 0.4s linear;
}

.social-media i:hover::after {
  transform: scale(1.5);
  opacity: 0;
}
</style>
