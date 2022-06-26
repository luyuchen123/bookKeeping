<template>
  <div class="login-container">
    <div class="form-structor">
      <div class="signup" :class="{ 'slide-up': showStatus === 'login' }">
        <h2 class="form-title" id="signup" @click="changeStatus('register')">
          <span v-show="showStatus === 'login'">或</span>注册
        </h2>
        <div class="form-holder">
          <input
            type="text"
            class="input"
            placeholder="用户名"
            v-model="RegisterForm.UserName"
          />
          <input
            type="password"
            class="input"
            placeholder="密码"
            v-model="RegisterForm.Password"
          />
          <!-- <div class="valid">
            <input class="input" placeholder="验证码" />
          </div> -->
        </div>
        <button class="submit-btn" @click="register">注册</button>
      </div>
      <div class="login" :class="{ 'slide-up': showStatus === 'register' }">
        <div class="center">
          <h2 class="form-title" id="login" @click="changeStatus('login')">
            <span v-show="showStatus === 'register'">或</span>登录
          </h2>
          <div class="form-holder">
            <input
              type="email"
              class="input"
              placeholder="用户名"
              v-model="loginForm.UserName"
            />
            <input
              type="password"
              class="input"
              placeholder="密码"
              v-model="loginForm.Password"
            />
          </div>
          <button class="submit-btn" @click="login">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRaw } from "vue";
import service from "@/service/login";
import Storage from "@/util/storage";
import { useStore } from "vuex";
export default defineComponent({
  setup() {
    const store = useStore();
    const showStatus = ref("login"); //当前是注册还是登录
    const changeStatus = (val: string) => {
      showStatus.value = val;
    };
    let loginForm = reactive<Ilogin>({
      UserName: "",
      Password: "",
    });
    const login = (): void => {
      const response: ICallBack = (errStatus: boolean, res: any) => {
        if (!errStatus) {
          Storage.set("token", "Bearer " + res?.LoginResponse?.token);
          store.commit("setLoginStatus", true);
        }
      };
      service.goLogin(toRaw(loginForm), response);
    };

    const RegisterForm = reactive<IRegister>({
      UserName: "",
      Password: "",
    });
    const register = (): void => {
      const response: ICallBack = (errStatus: boolean, res: any) => {
        if (!errStatus) {
          loginForm = Object.assign(toRaw(RegisterForm), toRaw(RegisterForm));
          login();
        }
      };
      service.goRegister(toRaw(RegisterForm), response);
    };
    return {
      showStatus,
      loginForm,
      RegisterForm,
      changeStatus,
      login,
      register,
    };
  },
});
</script>
<style lang="less" scoped>
@FZ: 18px;
.form-structor {
  background-color: #222;
  // border-radius: 15px;
  height: 94.5vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
}
.form-structor::after {
  content: "";
  opacity: 0.8;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-repeat: no-repeat;
  background-position: left bottom;
  // background-size: 500px;
  background-image: url("@/assets/32.jpg");
}
.form-structor .signup {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  width: 65%;
  z-index: 5;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup.slide-up {
  top: 5%;
  -webkit-transform: translate(-50%, 0%);
  -webkit-transition: all 0.3s ease;
  #signup {
    margin-top: 0;
  }
}
.form-structor .signup.slide-up .form-holder,
.form-structor .signup.slide-up .submit-btn {
  opacity: 0;
  visibility: hidden;
}
.form-structor .signup.slide-up .form-title {
  font-size: 1em;
  cursor: pointer;
}
.form-structor .signup.slide-up .form-title span {
  margin-right: 5px;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup .form-title {
  color: #fff;
  font-size: 1.7em;
  text-align: center;
}
.form-structor .signup .form-title span {
  color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup .form-holder {
  border-radius: 15px;
  background-color: #fff;
  overflow: hidden;
  margin-top: 50px;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup .form-holder .input {
  border: 0;
  outline: none;
  box-shadow: none;
  display: block;
  height: 30px;
  line-height: 30px;
  padding: 8px 15px;
  border-bottom: 1px solid #eee;
  width: 100%;
  font-size: @FZ;
}
.form-structor .signup .form-holder .input:last-child {
  border-bottom: 0;
}
.form-structor .signup .form-holder .input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.4);
}
.form-structor .signup .submit-btn {
  background-color: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.7);
  border: 0;
  border-radius: 15px;
  display: block;
  margin: 15px auto;
  padding: 15px 45px;
  width: 100%;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup .submit-btn:hover {
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.8);
}
.form-structor .login {
  position: absolute;
  top: 20%;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 5;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login::before {
  content: "";
  position: absolute;
  left: 50%;
  top: -20px;
  -webkit-transform: translate(-50%, 0);
  background-color: #fff;
  width: 200%;
  height: 250px;
  border-radius: 50%;
  z-index: 4;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center {
  position: absolute;
  top: calc(50% - 10%);
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  width: 65%;
  z-index: 5;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center .form-title {
  color: #000;
  font-size: 1.7em;
  text-align: center;
}
.form-structor .login .center .form-title span {
  color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center .form-holder {
  border-radius: 15px;
  background-color: #fff;
  border: 1px solid #eee;
  overflow: hidden;
  margin-top: 50px;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center .form-holder .input {
  border: 0;
  outline: none;
  box-shadow: none;
  display: block;
  height: 30px;
  line-height: 30px;
  padding: 8px 15px;
  border-bottom: 1px solid #eee;
  width: 100%;
  font-size: @FZ;
}
.form-structor .login .center .form-holder .input:last-child {
  border-bottom: 0;
}
.form-structor .login .center .form-holder .input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.4);
}
.form-structor .login .center .submit-btn {
  background-color: #6b92a4;
  color: rgba(255, 255, 255, 0.7);
  border: 0;
  border-radius: 15px;
  display: block;
  margin: 15px auto;
  padding: 15px 45px;
  width: 100%;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center .submit-btn:hover {
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.8);
}
.form-structor .login.slide-up {
  top: 90%;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login.slide-up .center {
  top: 10%;
  -webkit-transform: translate(-50%, 0%);
  -webkit-transition: all 0.3s ease;
}
.form-structor .login.slide-up .form-holder,
.form-structor .login.slide-up .submit-btn {
  opacity: 0;
  visibility: hidden;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login.slide-up .form-title {
  font-size: 1em;
  margin: 0;
  padding: 0;
  cursor: pointer;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login.slide-up .form-title span {
  margin-right: 5px;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
</style>
