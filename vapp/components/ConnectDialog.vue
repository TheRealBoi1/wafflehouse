<template>
  <v-dialog
    :value="value"
    fullscreen
    transition="fade-transition"
    class="vh-center"
    persistent
    no-click-animation
  >
    <v-card class="vh-center fill-both dialog-container" color="transparent" flat>
      <v-col>
        <v-row class="vh-center waffle-text-border-black connect-wallet-label">
          Connect your wallet to continue
        </v-row>
        <v-row class="vh-center ma-5">
          <v-btn
            width="80vw"
            max-width="450px"
            height="100px"
            :class="{'mobile': $vuetify.breakpoint.smAndDown}"
            class="waffle-text connect-wallet-button"
            @click="connectWallet"
          >
            Connect Wallet
          </v-btn>
        </v-row>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  layout: 'ConnectWallet',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    connectWallet () {
      this.$store.dispatch('initiateWeb3')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
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

.connect-wallet-label {
  font-size: 45px;
}

.connect-wallet-button {
  padding: 20px;
  font-size: 40px;
  border-radius: 50px;
  text-shadow: -2px 0 #000000, 0 2px #000000, 2px 0 #000000, 0 -2px #000000;
  border: 3px white solid;
  background: radial-gradient(50% 50% at 50% 50%, #4BADC2 0%, #003553 100%);
}

.connect-wallet-button.mobile {
  font-size: 20px !important;
}
</style>
