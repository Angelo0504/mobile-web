<template>
  <div class="dashboard-editor-container">
    <el-alert
      title="信息服务"
      type="info"
      description="我们传播开源的理念，推广开源项目。欢迎有信息需要分发的朋友添加微信咨询（187-2098-9281）"
      style="line-height: 2"
    >
    </el-alert>
    <panel-group />

    <el-row style="background: #fff; padding: 32px 16px 0">
      <line-chart :height="lineHeight" />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";

export default {
  name: "Index",
  components: {
    PanelGroup,
    LineChart,
  },
  data() {
    return {
      // 350头部，40提示框
      lineHeight: document.documentElement.clientHeight - 350 - 70 + "px", //实时屏幕高度
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: #fff;
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
