<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-title primary-title class="headline"> Sign-in </v-card-title>

        <v-card-text>
          <v-form>
            <v-text-field
              label="email"
              v-model="email"
              required
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
              :error-messages="errorsEmail"
            />

            <v-text-field
              label="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              :hint="'at least 8 characters'"
              counter
              required
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              @keyup.enter="submit"
              :error-messages="errorsPassword"
            />

            <div v-if="firebaseError" v-html="firebaseError" />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn :to="'/user/signup'">sign-up</v-btn>
          <v-spacer />
          <v-btn color="primary" @click="submit">sign-in</v-btn>
        </v-card-actions>
        <v-card-actions>
          <GoogleSignInVue />
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  email,
  sameAs,
  not,
  minLength,
} from 'vuelidate/lib/validators'

import { mapState, createNamespacedHelpers } from 'vuex'
const fb = createNamespacedHelpers('firebase')

import GoogleSignInVue from '~/components/User/GoogleSignIn.vue'

export default {
  mixins: [validationMixin],
  middleware: 'anonymous',
  validations: {
    email: { required, email },
    password: { required, minLength: minLength(8) },
  },
  components: {
    GoogleSignInVue,
  },
  data: () => ({
    email: '',
    password: '',
    showPassword: false,
    firebaseError: '',
  }),
  computed: {
    ...fb.mapState(['user']),

    errorsPassword() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required.')
      !this.$v.password.minLength &&
        errors.push('Password must be at least 8 characters.')
      return errors
    },
    errorsEmail() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.required &&
        errors.push('Password confirmation is required.')
      !this.$v.email.email && errors.push('Must be a valid email.')
      return errors
    },
  },
  methods: {
    submit() {
      this.$v.$touch()
      this.login()
    },

    clear() {
      this.$v.$reset()
      this.password = ''
      this.email = ''
    },
    login() {
      this.firebaseError = ''
      if (!this.$v.$invalid) {
        this.$store
          .dispatch('firebase/userSignIn', {
            email: this.email,
            password: this.password,
          })
          .then(() => {
            this.$router.push('/user/profile')
          })
          .catch((err) => {
            this.firebaseError = err.message
          })
      }
    },
  },
  watch: {
    user(newUser, oldUser) {
      // console.log('new', newUser, 'old', oldUser)
    },
  },
}
</script>

<style></style>
