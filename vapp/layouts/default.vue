<template>
  <v-app dark class="app-container">
    <requirements-dialog :value="!showApp" />
    <template v-if="showApp">
      <waffle-viewer-dialog />
      <processing-dialog />
      <confirm-dialog />
      <error-dialog />
      <toolbar />
      <v-main class="page-wrapper">
        <nuxt />
      </v-main>
    </template>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import WaffleViewerDialog from '../components/dialogs/WaffleViewerDialog'
import hmyWallet from '~/wallets/hmy'

import RequirementsDialog from '~/components/dialogs/RequirementsDialog'
import ProcessingDialog from '~/components/dialogs/ProcessingDialog'
import ConfirmDialog from '~/components/dialogs/ConfirmDialog'
import ErrorDialog from '~/components/dialogs/ErrorDialog'
import Toolbar from '~/components/layout/toolbar/Toolbar'

export default {
  name: 'Default',
  components: {
    WaffleViewerDialog,
    ErrorDialog,
    RequirementsDialog,
    ProcessingDialog,
    ConfirmDialog,
    Toolbar
  },
  computed: {
    ...mapGetters('accounts', ['isAccountActive']),
    ...mapGetters(['isDataLoading']),

    isMobile () {
      return this.$vuetify.breakpoint.smAndDown
    },

    showApp () {
      return hmyWallet != null
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

  .page-wrapper {
    width: 100%;
    transition: margin-top .25s;
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
