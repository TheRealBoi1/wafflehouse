<template>
  <v-card class="vh-center fill-both" color="transparent" flat>
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
</template>

<script>
export default {
  layout: 'empty',
  methods: {
    async connectWallet () {
      await this.$store.dispatch('initiateWeb3')
      await this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
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
