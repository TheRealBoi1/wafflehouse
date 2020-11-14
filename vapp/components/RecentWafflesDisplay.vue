<template>
  <v-row v-if="$vuetify.breakpoint.mdAndUp" class="waffle-text vh-center">
    <v-col class="ma-0 pa-0">
      <v-row class="recent-waffles-displays">
        <v-container>
          <v-row>
            <v-col cols="4" class="vh-center">
              <waffle-display :waffle="playerWaffle" viewable />
            </v-col>
            <v-col cols="4" class="vh-center">
              <waffle-display :waffle="playerWaffle" viewable />
            </v-col>
            <v-col cols="4" class="vh-center">
              <waffle-display :waffle="playerWaffle" viewable />
            </v-col>
          </v-row>
        </v-container>
      </v-row>
      <v-row class="recent-waffles-info">
        <v-container>
          <v-row>
            <v-col cols="4">
              <v-row class="vh-center">
                The Penetrator
              </v-row>
              <v-row class="vh-center">
                Price: $4.12
              </v-row>
            </v-col>
            <v-col cols="4">
              <v-row class="vh-center">
                The Awful Waffle
              </v-row>
              <v-row class="vh-center">
                Price: $3.00
              </v-row>
            </v-col>
            <v-col cols="4">
              <v-row class="vh-center">
                Insulinslayer
              </v-row>
              <v-row class="vh-center">
                Price: $17.23
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import WaffleDisplay from '@/components/WaffleDisplay'
import Waffle from '@/database/Waffle'

export default {
  name: 'RecentWafflesDisplay',
  components: { WaffleDisplay },
  computed: {
    playerWaffle () {
      return Waffle.getters('getActiveAccountWaffles')[0]
    }
  }
}
</script>

<style scoped>
  .recent-waffles-displays {
    background-color: #405875;
    border-top: 3px black solid;
  }

  .recent-waffles-info {
    background-color: #2C3A42;
  }
</style>
