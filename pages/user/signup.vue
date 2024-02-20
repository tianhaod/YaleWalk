<template>
  <v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title primary-title class="headline"> Sign-up </v-card-title>
          <v-card-text>
            <v-form ref="form">
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
                :error-messages="errorsPassword"
              />
              <v-text-field
                label="confirm password"
                v-model="repsword"
                :type="showRepsword ? 'text' : 'password'"
                :append-icon="showRepsword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showRepsword = !showRepsword"
                :hint="'should be the same as the password typed above'"
                counter
                required
                @input="$v.repsword.$touch()"
                @blur="$v.repsword.$touch()"
                :error-messages="errorsRepsword"
              />

              <div v-if="firebaseError" v-html="firebaseError" />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn :to="'/user/signin'">sign-in</v-btn>
            <v-spacer />
            <v-btn color="secondary" @click="clear">clear</v-btn>
            <v-btn color="primary" @click="submit">sign-up</v-btn>
          </v-card-actions>
          <v-card-actions>
            <GoogleSignInVue />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-row>
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
import GoogleSignInVue from '~/components/User/GoogleSignIn.vue'

export default {
  mixins: [validationMixin],
  middleware: 'anonymous',
  validations: {
    email: { required, email },
    password: { required, minLength: minLength(8) },
    repsword: { required, sameAs: sameAs('password') },
  },
  components: {
    GoogleSignInVue,
  },
  data: () => ({
    email: '',
    password: '',
    repsword: '',
    showPassword: false,
    showRepsword: false,
    firebaseError: '',
  }),
  computed: {
    errorsPassword() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required.')
      !this.$v.password.minLength &&
        errors.push('Password must be at least 8 characters.')
      return errors
    },
    errorsRepsword() {
      const errors = []
      if (!this.$v.repsword.$dirty) return errors
      !this.$v.repsword.required &&
        errors.push('Password confirmation is required.')
      !this.$v.repsword.sameAs && errors.push('Passwords must match.')
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
      this.signup()
    },

    clear() {
      this.$v.$reset()
      this.password = ''
      this.repsword = ''
      this.email = ''
    },

    signup() {
      this.firebaseError = ''
      if (!this.$v.$invalid) {
        this.$store
          .dispatch('firebase/userSignUp', {
            email: this.email,
            password: this.password,
            username: this.username,
          })
          .then(() => {
            this.$router.push('/')
          })
          .catch((err) => {
            this.firebaseError = err.message
          })
      }
    },
  },
}
</script>

<style></style>
