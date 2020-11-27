<template>
  <v-container class="page-container fill-height">
    <v-row class="vh-center fill-height px-8">
      <v-col cols="12" md="8" order="2" order-md="1" class="vh-center fill-height mt-4">
        <waffle-display :width="displayWidth" :expanded="expanded" :waffle="viewedWaffle" />
      </v-col>
      <v-col cols="12" md="4" order="1" order-md="2">
        <v-row class="vh-center waffle-text-border-black viewed-waffle-title">
          {{ viewedWaffle.name }}
          <v-btn class="ml-2" icon @click="setWaffleFavorite(viewedWaffle.id, !viewedWaffle.favorite)">
            <v-icon size="35">
              {{ viewedWaffle.favorite ? 'mdi-star' : 'mdi-star-outline' }}
            </v-icon>
          </v-btn>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import Waffle from '~/database/Waffle'
import WaffleDisplay from '~/components/WaffleDisplay'

export default {
  name: 'Index',
  hideNav: true,
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

    viewedWaffleId () {
      return this.$route.params.id
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
  watch: {
    showDialog () {
      if (this.showDialog && this.viewedWaffleId != null) {
        Waffle.dispatch('setupCachedCalls', [this.viewedWaffleId])
      }
    }
  },
  mounted () {
    if (this.viewedWaffleId != null) {
      Waffle.dispatch('setupCachedCalls', [this.viewedWaffleId])
    }
  },
  methods: {
    setWaffleFavorite (waffleId, value) {
      Waffle.dispatch('setWaffleFavorite', { waffleId, value })
    },

    voteWaffle () {
      Waffle.dispatch('voteWaffle', this.viewedWaffleId)
    },

    toggleExpanded () {
      this.expanded = !this.expanded
    }
  }
}
</script>

<style scoped>
.viewed-waffle-title {
  font-size: 45px;
}
</style>
