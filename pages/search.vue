<template>
  <v-card color="text--secondary">
    <v-card-title class="text-h5 accent">
      Search for Squad members
    </v-card-title>

    <v-card-text>
      Explore (one day) tens of free users ready for joining your squad!
    </v-card-text>

    <v-card-text flat>
      <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        hide-no-data
        hide-selected
        item-text="displayName"
        item-value="id"
        label="Search for friends"
        placeholder="Start typing to Search"
        prepend-icon="mdi-account-search"
        return-object
        cache-items
        clearable
      >
        <template v-slot:item="data">
          <template>
            <v-list-item-avatar>
              <v-img :src="data.item.image"></v-img>
            </v-list-item-avatar>

            <v-list-item-content
              ripple
              @click="$router.push(`/user/profile/${data.item.slug}`)"
            >
              <v-list-item-title
                v-text="data.item.displayName"
              ></v-list-item-title>
              <v-list-item-subtitle
                v-text="data.item.slug"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
    </v-card-text>

    <v-divider></v-divider>    
  </v-card>
</template>

<script>
import { mapState, createNamespacedHelpers } from 'vuex'
const fb = createNamespacedHelpers('firebase')

export default {
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    search: null,
    count: 0,
  }),

  computed: {
    items() {
      if (this.entries === undefined || this.entries === null) return []
      if (this.count === 0) return []
      return this.entries.map((e) => {
        return e
      })
    },
  },

  methods: {
    ...fb.mapActions(['searchProfiles']),
  },

  watch: {
    async search(val) {
      // Items have already been loaded
      // if (this.items.length > 0) return

      // No query
      if (this.search === null || this.search === '') {
        this.count = 0
        this.entries = []
        return
      }

      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      // Lazily load input items
      let res
      try {
        res = await this.searchProfiles(this.search)

        this.count = res.length
        this.entries = res
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
