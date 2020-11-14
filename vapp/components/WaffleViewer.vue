<template>
  <v-dialog
    :value="showDialog"
    fullscreen
    transition="fade-transition"
    class="vh-center"
    persistent
  >
    <v-card v-if="viewedWaffle" class="vh-center pa-3 ma-0" flat>
      <v-container>
        <v-row class="vh-center pa-3">
          <v-col cols="12" md="7" order="2" order-md="1" class="vh-center mt-4">
            <waffle-display :width="displayWidth" :expanded="expanded" :waffle="viewedWaffle" />
          </v-col>
          <v-col cols="12" md="5" order="1" order-md="2">
            <v-row class="waffle-text-border-black viewed-waffle-title">
              {{ viewedWaffle.name }}
            </v-row>
            <v-row class="mb-3">
              {{ viewedWaffle.description }}
            </v-row>
            <v-row class="mb-5">
              $13.50
            </v-row>
            <v-row class="mb-2">
              <v-btn :disabled="!canVote" width="100%" color="primary" @click="voteWaffle">
                Vote {{ isOwnWaffle ? '(Your waffle)' : '' }}
              </v-btn>
            </v-row>
            <v-row v-if="$vuetify.breakpoint.mdAndUp" class="mb-2">
              <v-btn width="100%" @click="toggleExpanded">
                {{ expanded ? 'Collapse' : 'Expand' }}
              </v-btn>
            </v-row>
            <v-row>
              <v-btn width="100%" color="secondary" @click="onClose">
                Close
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card v-else class="vh-center" flat>
      <v-progress-circular indeterminate />
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

import Waffle from '~/database/Waffle'
import WaffleDisplay from '~/components/WaffleDisplay'

export default {
  name: 'WaffleViewer',
  components: {
    WaffleDisplay
  },
  data () {
    return {
      expanded: false
    }
  },
  computed: {
    ...mapGetters('accounts', { activeAccount: 'getActiveAccount' }),

    displayWidth () {
      return this.$vuetify.breakpoint.mdAndUp ? 425 : 300
    },

    showDialog () {
      return this.$nuxt.$route.query.view != null
    },

    viewedWaffleId () {
      return parseInt(this.$nuxt.$route.query.view)
    },
    viewedWaffle () {
      return Waffle.getters('getWafflebyId')(this.viewedWaffleId)
    },

    isOwnWaffle () {
      return this.viewedWaffle.owner === this.activeAccount
    },
    canVote () {
      return !this.isOwnWaffle
    }
  },
  methods: {
    voteWaffle () {
      Waffle.dispatch('voteWaffle', this.viewedWaffleId)
    },

    toggleExpanded () {
      this.expanded = !this.expanded
    },

    onClose () {
      this.expanded = false
      this.$nuxt.$router.push({ query: {} })
    }
  }
}
</script>

<style scoped>
  .viewed-waffle-title {
    font-size: 45px;
  }
</style>
