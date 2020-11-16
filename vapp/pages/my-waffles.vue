<template>
  <v-container>
    <v-row v-if="accountWaffles.length > 0">
      <v-col cols="12" md="9" order="2" order-md="1">
        <v-row v-for="(waffle, index) in accountWaffles" :key="index">
          <v-card width="100%" class="waffle-container mx-5 mt-5">
            <v-card class="vh-center fill-both waffle-overlay waffle-text" color="#000000DD">
              <div class="fill-both">
                <v-row>
                  <v-col cols="12" md="9">
                    <v-row class="vh-center waffle-subtitle mb-2">
                      {{ waffle.name }}dada
                    </v-row>
                    <v-row class="vh-center waffle-title mb-5">
                      Currently Baking...
                    </v-row>
                    <v-row class="vh-center">
                      Status: Adding Layer
                    </v-row>
                    <v-row class="vh-center">
                      <countdown-timer :end-timestamp="50000000000" />
                    </v-row>
                  </v-col>
                </v-row>
              </div>
            </v-card>
            <v-row>
              <v-col class="mt-5 vh-center" cols="12" md="4" order="2" order-md="1">
                <waffle-display :width="200" :waffle="waffle" viewable />
              </v-col>
              <v-col cols="12" md="5" order="1" order-md="2">
                <v-row class="vh-center waffle-text-border-black waffle-title">
                  {{ waffle.name }}
                </v-row>
                <v-row class="px-5">
                  <v-col cols="6">
                    <v-row class="vh-center">
                      Layers: {{ waffle.layers.length }}
                    </v-row>
                  </v-col>
                  <v-col cols="6">
                    <v-row class="vh-center">
                      Price: $3.50
                      <v-tooltip top color="accent" max-width="400">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="mx-2"
                            icon
                            height="15"
                            width="15"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon color="grey lighten-1" size="15">
                              mdi-information
                            </v-icon>
                          </v-btn>
                        </template>
                        <v-col />
                      </v-tooltip>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row class="px-5">
                  <v-col cols="6" class="ma-0 pa-0">
                    <v-card width="100%" height="65" flat class="vh-center waffle-text option-button left">
                      Customize
                    </v-card>
                  </v-col>
                  <v-col cols="6" class="ma-0 pa-0">
                    <v-card width="100%" height="65" flat class="vh-center waffle-text option-button right">
                      Add Layer
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="3" :class="{'votes-container': $vuetify.breakpoint.mdAndUp}" order="3" order-md="3">
                <v-row class="vh-center waffle-text-border-black waffle-title">
                  Votes
                </v-row>
                <v-row class="vh-center waffle-text-border-black votes-value">
                  {{ waffle.votes }}
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-row>
        <v-row>
          <v-card to="/create" width="100%" height="125" class="vh-center mx-5 mt-5 waffle-text create-waffle-button">
            Create New Waffle
          </v-card>
        </v-row>
      </v-col>
      <v-col cols="12" md="3" order="1" order-md="2">
        <v-row class="vh-center">
          <v-img max-width="250" :src="require('~/static/logos/yflhouse.png')" />
        </v-row>
        <v-row class="vh-center waffle-text">
          Current Funds
        </v-row>
        <v-row class="vh-center">
          0.5 YFL
        </v-row>
        <v-row class="vh-center">
          2000 ONE
        </v-row>
        <v-row class="vh-center">
          ($315.12)
        </v-row>
        <v-row class="vh-center mt-10">
          <v-btn width="100%" max-width="250" outlined tile>
            Return Tokens
          </v-btn>
        </v-row>
        <v-row class="vh-center mt-4">
          <v-btn width="100%" max-width="250" outlined tile>
            Load Tokens
          </v-btn>
        </v-row>
        <v-row class="vh-center mt-5">
          Tip: You can bake multiple waffles at once
        </v-row>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-row class="vh-center">
          <v-img max-width="250" contain :src="require('~/static/logos/yflhouse.png')" />
        </v-row>
        <v-row class="vh-center">
          <p>
            Looks like you haven’t made any waffles yet!
            <br><br>
            Let’s fix that.
          </p>
        </v-row>
        <v-row class="vh-center mt-10">
          <v-btn
            to="/create"
            width="80vw"
            max-width="600px"
            height="100px"
            :class="{'mobile': $vuetify.breakpoint.smAndDown}"
            class="waffle-text make-waffle-button"
          >
            Make Your Waffle
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CountdownTimer from '@/components/helper/CountdownTimer'
import Waffle from '~/database/Waffle'
import WaffleDisplay from '~/components/WaffleDisplay'

export default {
  name: 'MyWaffles',
  components: { CountdownTimer, WaffleDisplay },
  middleware: 'loadAccountWaffles',
  computed: {
    accountWaffles () {
      return Waffle.getters('getActiveAccountWaffles')
    }
  }
}
</script>

<style scoped>
  .waffle-overlay {
    position: absolute;
    border-radius: 25px;
    z-index: 500;
  }

  .waffle-title {
    font-size: 32px;
  }

  .waffle-subtitle {
    font-size: 22px;
  }

  .waffle-container {
    border-radius: 25px;
    border: 6px rgba(255, 255, 255, 0.7) solid;
    background: rgba(30, 188, 223, 0.33);
  }

  .votes-container {
    border-left: 5px white solid;
  }

  .votes-value {
    font-size: 50px;
  }

  .create-waffle-button {
    font-size: 40px;
    border-radius: 25px;
    border: 6px rgba(255, 255, 255, 0.7) solid;
    background: rgba(215, 215, 215, 0.33);
    user-select: none;
  }

  .option-button {
    font-size: 20px;
    border: 3px rgba(255, 255, 255, 0.7) solid;
    background: rgba(215, 215, 215, 0.33);
    user-select: none;
    background: radial-gradient(50% 50% at 50% 50%, #4BADC2 0%, #1A6D9B 100%);
  }

  .option-button.left {
    border-right: 1.5px rgba(255, 255, 255, 0.7) solid;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .option-button.right {
    border-left: 1.5px rgba(255, 255, 255, 0.7) solid;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .make-waffle-button {
    padding: 20px;
    font-size: 40px;
    border-radius: 50px;
    text-shadow: -2px 0 #000000, 0 2px #000000, 2px 0 #000000, 0 -2px #000000;
    border: 3px white solid;
    background: radial-gradient(50% 50% at 50% 50%, #4BADC2 0%, #003553 100%);
  }

  .make-waffle-button.mobile {
    font-size: 20px !important;
  }
</style>
