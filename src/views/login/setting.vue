<template>
  <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" />
  <van-form ref="form">
    <van-cell-group inset>
      <h2>基本设置</h2>
      <van-field
        v-model="detail.UserName"
        name="UserName"
        label="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        @focus="changePassWord"
        v-model="detail.Password"
        type="password"
        name="Password"
        label="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-model="detail.Phone"
        type="tel"
        label="手机号"
        name="Phone"
        :rules="[{ validator, message: '请输入11位手机号' }]"
      />
      <van-field
        v-if="validShow"
        v-model="sms"
        center
        clearable
        label="短信验证码"
        :rules="[{ required: true, message: '请填写验证码' }]"
      >
        <template #button>
          <van-button size="small" type="primary">发送验证码</van-button>
        </template>
      </van-field>
      <h2>个性设置</h2>
      <van-field name="switch" label="库存管理">
        <template #input>
          <van-switch v-model="detail.isOpenStock" size="20" />
        </template>
      </van-field>
      <van-field name="uploader" label="头像上传">
        <template #input>
          <van-uploader v-model="detail.headPortraitImage" :max-count="1" />
        </template>
      </van-field>
      <van-field name="uploader1" label="背景图片上传">
        <template #input>
          <van-uploader v-model="detail.backgroundImage" :max-count="1" />
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px">
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        @click="editUserDetail"
      >
        提交
      </van-button>
    </div>
  </van-form>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, ref, watch, toRaw } from "vue";
import Storage from "@/util/storage";
import service from "@/service/login";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Notify } from "vant";
export default defineComponent({
  setup() {
    const form = ref();
    const validator = (val: string) => !val || /(^1\d{10}$)/.test(val);
    let detail = reactive({
      UserName: "",
      Phone: "",
      Password: "******",
      isOpenStock: true,
      backgroundImage: [],
      headPortraitImage: [],
    });

    const sms = ref(""); //验证码
    const validShow = ref(false);
    let cacheObj: any = {};
    watch(
      () => detail.Phone,
      () => {
        if (
          ((cacheObj.Phone && cacheObj.Phone !== detail.Phone) ||
            !cacheObj.Phone) &&
          validator(detail.Phone || "")
        ) {
          validShow.value = true;
        } else if (!validator(detail.Phone || "")) {
          validShow.value = false;
        }
      }
    );

    const changePassWord = () => {
      if (detail.Password === "******") {
        detail.Password = "";
      }
    };

    onMounted(() => {
      service.getUserDetail((errStatus, res: { userResponse: IUserDetail }) => {
        if (!errStatus) {
          const {
            UserName,
            Phone,
            backgroundImage,
            headPortraitImage,
            isOpenStock,
          } = res.userResponse;
          detail.UserName = UserName;
          detail.Phone = Phone;
          detail.isOpenStock = isOpenStock;
          backgroundImage &&
            backgroundImage !== "none" &&
            (detail.backgroundImage as Object[]).push({
              url: `/ISAPI/BookKeeping/image?imagePath=${backgroundImage}&token=${Storage.get(
                "token"
              )}`,
            });
          headPortraitImage &&
            headPortraitImage !== "none" &&
            (detail.headPortraitImage as Object[]).push({
              url: `/ISAPI/BookKeeping/image?imagePath=${headPortraitImage}&token=${Storage.get(
                "token"
              )}`,
            });

          cacheObj = JSON.parse(JSON.stringify(detail));
        }
      });
    });

    const editUserDetail = async () => {
      if (await form.value?.validate()) {
        return;
      }
      const formdata = new FormData();
      const changeParams: any = { ...toRaw(detail) };
      if (changeParams.UserName === cacheObj.UserName) {
        delete changeParams.UserName;
      }
      //密码未修改
      if (changeParams.Password === "******") {
        delete changeParams.Password;
      }
      //电话号码是否修改
      if (changeParams.Phone && validator(changeParams.Phone || "")) {
        changeParams.sms = sms.value;
      } else {
        delete changeParams.Phone;
      }
      //本来没背景图片， 或背景图片发生改变时重新上传背景图片
      if (
        (changeParams.backgroundImage.length &&
          !cacheObj.backgroundImage.length) ||
        (changeParams.backgroundImage.length &&
          cacheObj.backgroundImage.length &&
          changeParams.backgroundImage[0].url !==
            cacheObj.backgroundImage[0].url)
      ) {
        const file = changeParams.backgroundImage[0];
        formdata.append("backgroundImage", file.file, file.file.name);
        delete changeParams.backgroundImage;
      } else {
        delete changeParams.backgroundImage;
      }

      if (
        (changeParams.headPortraitImage.length &&
          !cacheObj.headPortraitImage.length) ||
        (changeParams.headPortraitImage.length &&
          cacheObj.headPortraitImage.length &&
          changeParams.headPortraitImage[0].url !==
            cacheObj.headPortraitImage[0].url)
      ) {
        const file = changeParams.headPortraitImage[0];
        formdata.append("headPortraitImage", file.file, file.file.name);
        delete changeParams.headPortraitImage;
      } else {
        delete changeParams.headPortraitImage;
      }

      Object.keys(changeParams).forEach((item) => {
        formdata.append(item, changeParams[item]);
      });
      service.setUserDetail(formdata, (errStatus, res) => {
        if (!errStatus) {
          Notify({ type: "success", message: "修改成功" });
        }
      });
    };

    const router = useRouter();
    const store = useStore();
    const onClickLeft = () => {
      router.push("/");
      store.commit("setTabActive", "mine");
    };
    return {
      form,
      validator,
      detail,
      validShow,
      sms,
      onClickLeft,
      changePassWord,
      editUserDetail,
    };
  },
});
</script>
<style lang="less" scoped>
h2 {
  margin: 0;
  padding: 32px 16px 16px;
  color: rgba(69, 90, 100, 0.6);
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
}
/deep/ .van-cell {
  height: 2rem;
  display: flex;
  align-items: center;
}
</style>
