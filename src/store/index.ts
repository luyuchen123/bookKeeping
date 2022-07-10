import { createStore } from "vuex";

export default createStore({
  state: {
    tokenRefreshFlag: false,
    loginStatus: false,
    loading: false, //是否显示全局loading
    activeTab: "",
    nowType: 0, //新增时，现在的大类别 收入 0， 支出 1
    nowIconId: "", //类别iconId
    nowItemId: "", //某一账单的id
    nowTimeStap: "", //现在的时间 年/月
    income: 0, //总的收入
    pay: 0, //总的支出
    Inwarehouse: 0, //总库存
    profit: 0, //总利润
  },
  getters: {},
  mutations: {
    setLoginStatus(state, payload) {
      state.loginStatus = payload;
    },
    changeLoading(state, payload) {
      state.loading = payload;
    },
    setTabActive(state, payload) {
      state.activeTab = payload;
    },
    setNowType(state, payload) {
      state.nowType = payload.id;
    },
    setTime(state, payload) {
      state.nowTimeStap = payload.time;
    },
    setCount(state, payload) {
      state.income = payload.income;
      state.pay = payload.pay;
      state.profit = payload.profit;
      state.Inwarehouse = payload.Inwarehouse;
    },
    setEditorIconId(state, payload) {
      state.nowIconId = payload.class;
    },
    setEditorItemId(state, payload) {
      state.nowItemId = payload.id;
    },
    setTokenRefreshFlag(state, payload) {
      state.tokenRefreshFlag = payload;
    },
  },
  actions: {},
  modules: {},
});
