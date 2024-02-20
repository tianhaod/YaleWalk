<template>
  <v-list two-line max-height="100%" flat>
  
      <div>
      <v-alert
        v-if="alert"
        dismissible
        color="cyan"
        elevation="2"
        colored-border

      >
        <div v-if="!initialized">WALK ERROR</div>
        <div v-else>
          
          <span style="font-size:30px; font-family:verdana;">{{item.title}}</span><br />          
          <v-btn style="font-size:15px; font-family:verdana;" @click="go_to_profile(item)">{{profileName(item)}}</v-btn><br />
          <span style="font-size:15px; font-family:verdana;">{{`Started walk: ${formatFirebaseTimestamp(item.startTime)}, ${item.startLocation}`}}</span ><br />
          <span  v-if="item.walkCompleted" style="font-size:15px; font-family:verdana;">{{`Ended walk: ${formatFirebaseTimestamp(item.endTime)}, ${item.endLocation}`}}</span ><br />
          <v-btn style="font-size:15px; font-family:verdana;" @click="(item.likes+=1)">{{item.likes}} likes</v-btn><br />
          <span v-if="item.walkCompleted" style="font-size:15px; font-family:verdana;">COMPLETED</span >
          <span v-else style="font-size:15px; font-family:verdana;">PENDING</span >
        
        </div>

      </v-alert>
    </div>

    <v-list-item-group>
      <template v-for="(item, index) in feed">
        
        <v-list-item :key="item.id" @click="popup(item)">
          <template v-slot:default="{ active }">
            <v-list-item-avatar :key="feed[index].image">
              <v-img :src="profileImage(item)"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title :key="feed[index].Name">
                            {{profileName(item)}}
                        </v-list-item-title>
              <v-list-item-subtitle
                class="text--primary"
                v-text="item.walkTitle"
              ></v-list-item-subtitle>

                <v-list-item-subtitle
                  v-text="figmaString(item)"
                ></v-list-item-subtitle>
              </v-list-item-content>
            <v-list-item-action v-if="!item.walkCompleted">
              <v-list-item-action-text> LIVE </v-list-item-action-text>

              <v-icon :color="color(item)">
                mdi-walk
              </v-icon>
            </v-list-item-action>
            <v-list-item-action>
              <v-list-item-action-text> </v-list-item-action-text>
              <v-badge
                v-if="item.likes"
                :content="item.likes ? item.likes : 0"
                color="pink"
                right
                
              >
                <v-btn @click="like(item)">
                  <v-icon color="pink">mdi-heart</v-icon>
                </v-btn>
              </v-badge>
              
              <v-badge
                v-else
                :content="0"
                color="clear"
                
              >
                <v-btn @click="like(item)">
                  <v-icon class="outlined" color="gray">mdi-heart</v-icon>
                </v-btn>
              </v-badge>


              <!-- <v-icon v-else>mdi-heart-outline</v-icon> -->
            </v-list-item-action>
          </template>
        </v-list-item>
      
        <v-divider v-if="index < feed.length - 1" :key="index"></v-divider>
      </template>
    </v-list-item-group>
  </v-list>

</template>

<script>

import { mapState, createNamespacedHelpers } from 'vuex'
const fb = createNamespacedHelpers('firebase')
let rerender = 0
export default {
  name: 'FeedPage',
  props: {
    // item: Object, 
  },
  data: () => ({
    alert: false,
    id: null,
    initialized: false,
    slug: null, 
    route: null,
    item: null,
  }),
  computed: {
    ...fb.mapState(['feed', 'authUser']),
  },
  methods: {
    ...fb.mapActions(['getFeed']),

    like(item) {
      this.item = item
      item.likes+=1
    },

    popup(item) {
      this.initialized = true
      this.alert = true
      this.item = item
    },

    async go_to_profile(item) {
      // uid = item.id
      this.slug = item.slug
      window.location.href = '/user/profile/' + String(this.slug)
    },

    async mounted() {
    // If current user profile, just go to profile
    if (this.slug === this.profile.slug) {
      this.$router.push('/user/profile')
    }
    // else test for user
    let slugFound = await this.testForSlug({ slug: this.slug })
    if (!slugFound) {
      this.$router.push('/')
    }
    // let profile = await this.fetchUserProfile()
    // this.other = profile
  },

    compactNumber(number) {
      const formatter = Intl.NumberFormat('en', {
        notation: 'compact',
        // style: 'unit',
        maximumSignificantDigits: 2,
      })
      let n = formatter.format(number)
      return n
    },
    color(item) {
      return item.walkCompleted === null
                    ? item.alertIds.length !== 0
                      ? 'orange'
                      : 'green'
                    : 'gray'
    },
    formatDate(timestamp) {
      const date = new Date(Date.UTC(timestamp))
      const formatter = new Intl.DateTimeFormat('en-US')
      return formatter.format(date)
    },
    formatFirebaseTimestamp(timestamp) {
      return timestamp.toDate().toDateString()
    },
    calculateItemDuration(item) {
      // let end = item.endTime === null ? new Date() : item.endTime.toDate()
      // the line above calculates duration but is being displayed as when the walk started
      let end = new Date()
      item.walkDuration = end - item.startTime.toDate()
      let ms = item.walkDuration
      if (ms < 0) ms *= -1
      let seconds = ms / 1000
      let minutes = ms / (1000 * 60)
      let hours = ms / (1000 * 60 * 60)
      let days = ms / (1000 * 60 * 60 * 24)
      let time, units
      if (seconds < 60) {
        time = seconds
        units = 'Sec'
      } else if (minutes < 60) {
        time = minutes
        units = 'Min'
      } else if (hours < 24) {
        time = hours
        units = 'Hrs'
      } else {
        time = days
        units = 'Days'
      }
      item.walkDurationUnits = units
      return this.compactNumber(time)
    },
    figmaString(item) {
      let prepend = item.walkCompleted ? '' : 'started '
      let duration = this.calculateItemDuration(item)
      return `${prepend}${duration} ${item.walkDurationUnits} ago`
    },
    profileImage(item) {
      if (!!item.image) return item.image
    },
    profileName(item) {
      if (!!item.Name) return item.Name
      if (!!item.displayName) return item.displayName
    }
  },
  async mounted() {
    if (this.authUser === null) {
      this.$router.push('/user/signin')
    }
    await this.getFeed({})
  },
}
</script>
