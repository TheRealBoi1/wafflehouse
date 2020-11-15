<template>
  <v-dialog
    :value="showDialog"
    transition="fade-transition"
    class="vh-center"
    :overlay-opacity="0.8"
    persistent
    no-click-animation
  >
    <v-card class="vh-center" height="80vh" color="#000000DD" flat>
      <template v-if="transactionLabel">
        <v-col class="waffle-text dialog-title">
          {{ transactionLabel }}{{ dotDisplay }}
        </v-col>
      </template>
      <template class="vh-center" v-else-if="errorLabel">
        <v-col>
          <v-row class="vh-center waffle-text-border dialog-title mb-5">
            Uh oh!
          </v-row>
          <v-row class="vh-center mb-5">
            {{ errorLabel }}
          </v-row>
          <v-row class="vh-center">
            <v-btn outlined @click="clearError">
              Back
            </v-btn>
          </v-row>
        </v-col>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Waffle from '~/database/Waffle'

export default {
  name: 'WaffleViewerDialog',
  data () {
    return {
      dotCount: 0
    }
  },
  computed: {
    ...mapGetters('transactions', {
      transactionLabel: 'getTransactionLabel',
      errorLabel: 'getTransactionError'
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
