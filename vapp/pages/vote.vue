<template>
  <v-container class="page-container fill-both">
    <template v-if="canVote">
      <v-col>
        <v-row>
          <v-col cols="12" md="8">
            You can vote for a maximum of three waffles here. You cannot vote for your own!
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="filter"
              :items="filterData"
              height="50"
              class="select-container"
              background-color="#444444"
              solo
              single-line
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(waffle, index) in displayedWaffles" :key="index" cols="12" md="4">
            <v-card width="100%" class="waffle-container">
              <v-col>
                <v-row class="waffle-text-border-black waffle-title vh-center">
                  {{ waffle.name }}
                  <v-btn icon @click="setWaffleFavorite(waffle.id, !waffle.favorite)">
                    <v-icon>
                      {{ waffle.favorite ? 'mdi-star' : 'mdi-star-outline' }}
                    </v-icon>
                  </v-btn>
                </v-row>
                <v-row class="waffle-text-border-black waffle-price vh-center">
                  $3.50
                </v-row>
                <v-row>
                  <v-card width="100%" height="300" class="vh-center" color="transparent" flat>
                    <waffle-display :width="250" :waffle="waffle" viewable />
                  </v-card>
                </v-row>
              </v-col>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </template>
    <template v-else>
      <div class="fill-both vh-center">
        <div>
          <v-col class="text-center">
            <v-row class="vh-center">
              <h1 class="waffle-text-border">
                Voting Not Allowed!
              </h1>
            </v-row>
            <v-row class="vh-center">
              You must publish at least one waffle before you are allowed to vote on other people's waffles!
            </v-row>
          </v-col>
        </div>
      </div>
    </template>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Waffle from '~/database/Waffle'
import WaffleDisplay from '~/components/WaffleDisplay'

export default {
  name: 'Vote',
  components: { WaffleDisplay },
  data () {
    return {
      filter: 0,
      filterData: [
        { text: 'Latest Waffles', value: 0 },
        { text: 'Favorite Waffles', value: 1 }
      ]
    }
  },
  computed: {
    ...mapGetters('accounts', {
      canVote: 'getCanVote'
    }),

    displayedWaffles () {
      return Waffle.getters('getActiveAccountWaffles')
    }
  },
  methods: {
    setWaffleFavorite (waffleId, value) {
      Waffle.dispatch('setWaffleFavorite', { waffleId, value })
    }
  }
}
</script>

<style scoped>
.select-container {

}

.waffle-container {
  border-radius: 25px;
  border: 6px rgba(255, 255, 255, 0.7) solid;
  background: rgba(30, 188, 223, 0.33);
}

.waffle-title {
  font-size: 32px;
}

.waffle-price {
  font-size: 25px;
  border-bottom: #BACCD0 5px solid;
}

</style>
