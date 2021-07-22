<template>
  <div class="container">
    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<script>
  export default {
    layout: 'navbar',
    created: function() {
     this.$router.push('/beranda');
      //  this.$router.push('/campaign/7');
    },
  }
</script>

