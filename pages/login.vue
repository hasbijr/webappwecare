<template>
    <div style="padding-top: 40px">
      <b-container>
        <b-card class="center col-sm-4"><br>
          <center><label style="font-size:35px">LOGIN</label></center><br>
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group id="username" label="Username:" label-for="username" class="text-left">
              <b-form-input id="username" v-model="form.username" type="text" placeholder="Username" required></b-form-input>
            </b-form-group>
            
            <b-form-group id="password" label="Password:" label-for="password" class="text-left">
              <b-form-input id="password" v-model="form.password" type="password" placeholder="Enter name" required></b-form-input>
              <br>
              <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">Remember me</b-form-checkbox>
            </b-form-group>

            <b-button type="submit" class="btn-login" variant="primary">Login</b-button>
          </b-form>
        </b-card>
      </b-container>
    </div>
</template>

<script>
  export default {
    layout: 'navbar-login',
    data() {
      return {
        form: {
          username: '',
          password: '',
          checked: false
        },
        show: true
      }
    },
    methods: {
      async onSubmit(event) {
        event.preventDefault()
        this.showLoading = true;
        try {
          // let response = await this.$auth.loginWith('local', { data: this.form })
          // console.log(response);
          // console.log(this.$auth.loggedIn)
            await this.$auth.loginWith('local', {
                data: this.form
            }).catch(e => {
                this.$bvToast.toast(`Username atau Password salah!`, {
                  title: 'Gagal Login',
                  autoHideDelay: 5000,
                  appendToast: true,
                  variant: 'danger'
                })
            });

            this.showLoading = false;
            if(this.$auth.loggedIn){
              this.$bvToast.toast(`Selamat Datang!`, {
                title: 'Sukses Login',
                autoHideDelay: 5000,
                appendToast: true,
                variant: 'success'
              });
              this.$router.push('/beranda')
            }
        } catch (e) {
            console.log(e)
            this.showLoading = false;
        }

      },
      onReset(event) {
        event.preventDefault()
        // Reset our form values
        this.form.username = ''
        this.form.password = ''
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      },

      async login() {
                this.showLoading = true;
                try {
                    await this.$auth.loginWith('local', {
                        data: {
                            "username": this.form.username,
                            "password": this.form.password,
                        }
                    }).catch(e => {
                        console.log(e);
                        // this.errorMessage = e.response.data.message
                        this.$notify.error({
                            title: 'Error',
                            message: e.response.data.message
                        });
                    });
                    this.showLoading = false;
                    if (this.$auth.loggedIn) {
                        this.$notify.success({
                            title: 'Berhasil Login',
                            message: 'Selamat Datang! :)'
                        });
                        this.$router.push('/')
                    }
                } catch (e) {
                    console.log(e)
                    this.showLoading = false;
                }
            }
    }
  }
</script>