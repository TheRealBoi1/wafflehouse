<template>
  <v-app dark class="app-container">
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('accounts', ['isAccountActive'])
  },
  watch: {
    isAccountActive (value) {
      if (value) {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.app-container {
  background: url(../static/background.png) repeat;
  border-radius: 5px;
  overflow: hidden;
  animation: ScrollBackground 10s linear infinite;
  font-family: Roboto, serif;
}

.content-container {
  max-width: 1250px;
}

@keyframes ScrollBackground {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 250px -250px;
  }
}
</style>
