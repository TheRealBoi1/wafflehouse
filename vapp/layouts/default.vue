<template>
  <v-app dark class="app-container">
    <connect-dialog :value="!showApp" />
    <template v-if="showApp">
      <transaction-dialog />
      <waffle-viewer-dialog />
      <toolbar />
      <v-main>
        <nuxt />
      </v-main>
    </template>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

import WaffleViewerDialog from '@/components/WaffleViewerDialog'
import TransactionDialog from '@/components/TransactionDialog'
import ConnectDialog from '@/components/ConnectDialog'
import Toolbar from '~/components/layout/toolbar/Toolbar'

export default {
  name: 'Default',
  components: {
    ConnectDialog,
    WaffleViewerDialog,
    TransactionDialog,
    Toolbar
  },
  computed: {
    ...mapGetters('accounts', ['isAccountActive']),
    ...mapGetters(['isDataLoading']),
    showApp () {
      return this.isAccountActive && !this.isDataLoading
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
