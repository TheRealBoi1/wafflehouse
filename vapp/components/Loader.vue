<template>
  <v-overlay v-show="loading">
    <v-progress-circular indeterminate />
  </v-overlay>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>
