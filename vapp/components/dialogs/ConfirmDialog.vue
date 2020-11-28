<template>
  <v-dialog
    :value="true"
    transition="fade-transition"
    class="vh-center"
    persistent
    no-click-animation
    fullscreen
  >
    <v-card class="vh-center" color="#000000DD" flat>
      <v-col class="content-wrapper">
        <v-row class="vh-center mb-5 waffle-text-border">
          <h1>
            Are you sure?
          </h1>
        </v-row>
        <v-row class="vh-center mb-5 text-center">
          Once you confirm, you’ll send back your unused tokens to your Ethereum wallet.
          <br><br>
          You won’t be able to make any more waffles!
        </v-row>
        <v-row>
          <v-col cols="6" class="vh-center">
            <v-btn outlined width="100%" color="red">
              Nevermind
            </v-btn>
          </v-col>
          <v-col cols="6" class="vh-center">
            <v-btn outlined width="100%" color="green">
              Sure
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog'
}
</script>

<style scoped>
.content-wrapper {
  max-width: 500px;
}
</style>
