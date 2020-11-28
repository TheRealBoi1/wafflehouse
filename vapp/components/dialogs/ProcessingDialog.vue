<template>
  <v-dialog
    :value="showDialog"
    transition="fade-transition"
    class="vh-center"
    :overlay-opacity="0.95"
    persistent
    no-click-animation
  >
    <v-container class="page-container">
      <v-card class="vh-center" height="80vh" color="#000000DD" flat>
        <v-col class="waffle-text dialog-title">
          {{ transactionLabel }}{{ dotDisplay }}
        </v-col>
      </v-card>
    </v-container>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Waffle from '~/database/Waffle'

export default {
  name: 'ProcessingDialog',
  data () {
    return {
      dotCount: 0
    }
  },
  computed: {
    ...mapGetters('transactions', {
      transactionLabel: 'getTransactionLabel'
    }),

    dotDisplay () {
      return '.'.repeat(this.dotCount)
    },

    showDialog () {
      return this.transactionLabel || this.errorLabel
    }
  },
  mounted () {
    this.mountDotInterval()
  },
  methods: {
    ...mapActions('transactions', ['clearError']),

    setWaffleFavorite (waffleId, value) {
      Waffle.dispatch('setWaffleFavorite', { waffleId, value })
    },

    mountDotInterval () {
      setInterval(() => {
        this.dotCount++
        if (this.dotCount > 3) {
          this.dotCount = 0
        }
      }, 500)
    }
  }
}
</script>

<style scoped>
.dialog-title {
  font-size: 45px;
}
</style>
