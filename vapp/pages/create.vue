<template>
  <v-container>
    <v-col class="pa-0 ma-0">
      <v-row class="vh-center waffle-text-border waffle-time-label">
        It's Waffle Time!
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-card class="wafflemaker-container" color="#000000AA" tile>
            <v-card-title class="vh-center wafflemaker-title waffle-text">
              Wafflemaker 9000
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-spacer />
                <v-col cols="6">
                  <v-img :src="require('@/static/chef-yfl.png')" max-height="400" contain />
                </v-col>
                <v-col cols="6">
                  <v-img :src="require('@/static/chef-one.png')" max-height="400" contain />
                </v-col>
                <v-spacer />
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-row class="vh-center">
            <v-img max-width="250" contain :src="require('~/static/logos/yflhouse.png')" />
          </v-row>
          <v-row class="vh-center">
            <p class="page-content">
              At the $YFL Waffle House, waffle-making is serious business. That’s why we’ve partnered with Harmony to help us find the world’s greatest waffle. In order to participate, you’ll need a few tasty ingredients.
              <br><br>
              But don’t worry about that just yet. For now, let’s top up your Harmony wallet.
              <br><br>
              Ready? Let’s get started.
            </p>
          </v-row>
          <v-row class="vh-center">
            <v-btn @click="createWaffle">
              Create Waffle
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import Waffle from '~/database/Waffle'

export default {
  name: 'Create',
  methods: {
    createWaffle () {
      Waffle.dispatch('createWaffle')
    }
  }
}
</script>

<style scoped>
  .waffle-time-label {
    font-size: 65px;
    margin-bottom: 50px;
  }

  .wafflemaker-container {
    border: 5px white solid !important;
  }

  .wafflemaker-title {
    font-size: 45px;
    background-color: #3d3d3d;
    padding: 25px;
  }

  .page-content {
    font-family: Roboto, Serif;
    font-size: 14pt;
    text-align: center;
    max-width: 800px;
  }
</style>
