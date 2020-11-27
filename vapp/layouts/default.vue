<template>
  <v-app dark class="app-container">
    <connect-dialog :value="!showApp" />
    <template v-if="showApp">
      <processing-dialog />
      <confirm-dialog />
      <error-dialog />
      <toolbar :hide="hideNav" />
      <v-main class="page-wrapper" :class="{'collapsed': hideNav}">
        <nuxt />
      </v-main>
    </template>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

import ConnectDialog from '~/components/dialogs/ConnectDialog'
import ProcessingDialog from '~/components/dialogs/ProcessingDialog'
import ConfirmDialog from '~/components/dialogs/ConfirmDialog'
import ErrorDialog from '~/components/dialogs/ErrorDialog'
import Toolbar from '~/components/layout/toolbar/Toolbar'

export default {
  name: 'Default',
  components: {
    ErrorDialog,
    ConnectDialog,
    ProcessingDialog,
    ConfirmDialog,
    Toolbar
  },
  computed: {
    ...mapGetters('accounts', ['isAccountActive']),
    ...mapGetters(['isDataLoading']),

    hideNav () {
      return this.$route.matched.map((r) => {
        return (r.components.default.component ? r.components.default.options.hideNav : r.components.default.component.options.hideNav)
      })[0]
    },
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

  .page-wrapper {
    width: 100%;
    margin-top: 200px;
    transition: margin-top .25s;
  }

  .page-wrapper.collapsed {
    margin-top: 0px;
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
