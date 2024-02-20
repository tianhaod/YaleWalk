<template></template>

<script>
export default {
  mounted() {
    this.$store.dispatch('firebase/userLogout').then(() => {
      this.$router.push('/')
    })
  },
}
</script>

<style></style>
