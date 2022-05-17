<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: "SourceDoc",
  data() {
    return {
      url: "http://doc.sourcebyte.cn:8082/index.html",
    };
  },
  methods: {
    goto() {
      window.open(this.url);
    },
  },
};
</script>
