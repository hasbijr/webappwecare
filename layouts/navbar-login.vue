<template>
  <div class="background-custom">
    <b-navbar
      toggleable="lg"
      type="light"
      variant="info"
      class="rounded-bottom shadow p-0 px-4"
    >
      <b-navbar-brand href="/"><b-img src="../static/favicon.png" fluid alt="Responsive image" style="height: 50px"></b-img></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item
            link-classes="py-3"
            href="/"
            :active="
              $nuxt.$route.name == 'beranda' || $nuxt.$route.name == 'index'
            "
            >Beranda</b-nav-item
          >
          <!-- <b-nav-item
            link-classes="py-3"
            href="/login"
            :active="
              $nuxt.$route.name == 'login' || $nuxt.$route.name == 'login'
            "
            >Login</b-nav-item
          > -->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <Nuxt />
  </div>
</template>

<script>
export default {
  head: {
    bodyAttrs: {
      class: 'ohide bg-putih',
    },
  },
  data() {
    return {
      role : undefined
    }
  },
  mounted: function () {
    if(this.$auth.loggedIn){
      this.role = this.$auth.$state.user.roles[0].name
    }
  },
  methods: {
    logOut() {
      this.role = undefined
      this.$auth.logout()
    },
   
  },
}
</script>

<style lang="css" scoped>
.bg-info {
  background-color: #ffffff !important;
}

.navbar-dark .navbar-brand {
  color: #e42312;
  font-weight: 800;
}

.navbar-dark .navbar-nav .nav-link {
  color: #595858;
}

.rounded-bottom {
  border-bottom-right-radius: 1.25rem !important;
  border-bottom-left-radius: 1.25rem !important;
}

.bottomRightShadow {
  /* width:350px;height:200px; */
  border: solid 1px #fff;
  background-color: #eed;
  box-shadow: 0px 10px 5px rgba(83, 83, 83, 0.6);
  -moz-box-shadow: 0px 10px 5px rgba(83, 83, 83, 0.6);
  -webkit-box-shadow: 0px 10px 5px rgba(83, 83, 83, 0.6);
  -o-box-shadow: 0px 10px 5px rgba(83, 83, 83, 0.6);
}

.navbar-nav .nav-link {
  color: #595858;
}
</style>
