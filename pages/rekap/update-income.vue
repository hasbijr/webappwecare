<template>
    <div class="background-custom">
        <div class="container">
            <b-card>
                <div class="row align-items-center">
                    <div class="col-md-12 align-self-center" align="center" style="color: #E42312; font-size:25px;">
                        Update Income
                    </div>
                    <div class="col-md-12 align-self-center" align="center" style="color: #E42312; font-size:25px;">
                        Campaign "{{dataCampaign.nama}}"
                    </div>
                    <br><br>
                    <div class="col-md-12" align="center">
                      Perbaiki data dengan teliti, lakukan pengcekan ulang sebelum di publish kembali.
                   </div>

                    <div class="col-md-12" style="padding: 30px 20px">
                        <b-card>
                            <b-form @submit="onSubmit">
                                <b-form-group
                                    id="input-group-1"
                                    label="Sumber Dana:"
                                    label-for="input-1"
                                >
                                    <b-form-input
                                    id="input-1"
                                    v-model="form.dana"
                                    placeholder="Link Aja"
                                    required
                                    ></b-form-input>
                                </b-form-group>

                                  <b-form-group
                                    id="input-group-1"
                                    label="Template Income:"
                                    label-for="input-1"
                                >
                                 <div class="col-md-12" >
                      Untuk melihat template Income,
                      <a href= "https://docs.google.com/spreadsheets/d/19jw3mmKTdIERcMwNxs6GDHJc_kn8HgcjJwGf-TeAu2c/edit?usp=sharing" target='_blank'> Klik disini </a>
                                </div>
                                 
                                </b-form-group>

                                <b-form-group
                                    id="input-group-1"
                                    label="Upload Income"
                                    label-for="file-1"
                                    description="* File harus berekstensi .xlsx"
                                >
                                    <b-form-file
                                    v-model="form.file"
                                    :state="Boolean(form.file)"
                                    placeholder="Choose a file or drop it here..."
                                    drop-placeholder="Drop file here..."
                                    ></b-form-file>
                                </b-form-group>

                                <div class="row">
                                    <div class="col-md-2 offset-md-5">
                                        <b-button v-if="!isLoading" @click.prevent="onSubmit()" class="btn-login" type="submit" variant="primary">Simpan</b-button>
                                        <div v-else class="text-center">
                                            <b-spinner variant="danger" label="Spinning"></b-spinner>
                                        </div>
                                    </div>
                                </div>
                            </b-form>
                        </b-card>
                    </div>
                    
                </div>
                
            </b-card>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'navbar',
    data() {
        return {
            dataCampaign: [],
            form: {
                dana: undefined,
                file: null,
            },
            baseURL: undefined,
            show: true,
            isLoading: false,
            // currentPage: 1,
            // rows: undefined,
            // perPage: 15,
        }
    },
    created: function() {
        this.getDataCampaign();
        this.baseURL = this.$axios.defaults.baseURL;
        if(!this.$auth.loggedIn){
            this.$router.push('/login');
        }
    },
    methods: {
        onSubmit() {
            this.isLoading = true
            const token = this.$auth.strategy.token.get()
            const config = {
                headers: { Authorization: `${token}` },
            }

            const formData = new FormData()
            formData.append('sumber_dana', this.form.dana)
            formData.append('file', this.form.file)
            
            this.$axios.$post(`campaign/${this.$route.query.id}/income`, formData, config)
            .then((data) => {
             

                if(data.success){
                    this.$bvToast.toast(`Sukses`, {
                        title: 'Sukses',
                        autoHideDelay: 5000,
                        appendToast: true,
                        variant: 'success',
                    })
                    this.$router.push('/rekap/index-rekap?id='+this.$route.query.id);
                }

                this.isLoading = false
            }).catch((error) => {
                this.$bvToast.toast(`Terjadi kesalahan api`, {
                    title: 'Terjadi kesalahan',
                    autoHideDelay: 5000,
                    appendToast: true,
                    variant: 'danger',
                })
                this.isLoading = false
            })
        },
        async getDataCampaign(){      
            await this.$axios.$get(`campaign/${this.$route.query.id}`).then(response => {
                this.dataCampaign = response;
                this.rows = response.total;
                // console.log(this.dataCampaign);
            }).catch(e => {
                console.log(e)
            })
        },

        selectDropdown(data){
            alert(data)
        },

        // handleCurrentChange(val) {
        //     this.currentPage = val;
        //     this.getDataCampaign();
        // },

        rekapData(id) {
            alert(id);
        },

        updateCampaign(id) {
            this.$router.push('/campaign/update-campaign?id='+id);
        },
    }
}
</script>

<style>
.btn-group .btn, .input-group .btn{
    padding: 8px !important;
}

.dropdown-custom .btn-outline-primary {
    color: #ffffff;
    border-color: #E42312;
    background-color: #E42312;
    background-image: none;
}

/* .dropdown {
    border: 1px solid #ccc;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 20px;
} */
</style>