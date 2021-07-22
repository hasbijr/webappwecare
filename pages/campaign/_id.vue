<template>
    <div class="background-custom">
        <div class="container">

            <b-card v-if="detailCampaign.campaign_photo == undefined">
                <b-skeleton-img no-aspect height="300px"></b-skeleton-img>
            </b-card>

            <b-card v-else :img-src="detailCampaign.campaign_photo ? baseURL + '/' + detailCampaign.campaign_photo.path : ''" :img-width="'40%'" :img-height="300" img-alt="Card image" img-left class="mb-3">
                <b-card-text class="descript">
                    <div class="title-card card-text" style="font-size: 2.1rem !important">
                        {{ detailCampaign.nama }}
                    </div>
                    <div class="row">
                        <div class="col-md-12 card-text" style="font-weight: 500">
                            {{ detailCampaign.tanggal_mulai }} - {{ detailCampaign.tanggal_selesai }}
                        </div>
                    </div>
                    <div class="card-text" style="font-weight: 500;">
                        Dana Terkumpul: Rp 2.015.000,00
                    </div>
                    <div class="row justify-content-end" style="padding-right: 20px">
                        <button v-b-modal.modal-prevent-closing type="button" class="btn btn-md btn-donasi-1 col-md-2 col-xs-4 justify-content-end">Donasi</button>
                    </div>
                </b-card-text>
            </b-card>
        </div>

        <div style="background-color: #ffffff; padding-top: 15px;">
            <div class="container1">
                <div class="sub-title-card">
                    Deskripsi Campaign
                </div>
                <div style="color: #828282">
                    {{ detailCampaign.deskripsi }}
                </div>
            </div>
        </div>

        <b-modal
        id="modal-prevent-closing"
        ref="modal"
        @show="resetModal"
        @hidden="resetModal"
        size="lg"
        >
            <div class="modal-title-custom">
                Formulir Data Donatur
            </div>
            <div style="text-align: center; margin-bottom: 30px">
                Petunjuk untuk data donatur Petunjuk untuk data donatur Petunjuk untuk data donatur Petunjuk untuk data donatur Petunjuk untuk data donatur
            </div>

            <form ref="form" @submit.stop.prevent style="padding: 0px 20px 0px 20px">
                <b-form-group
                label="Nama Donatur"
                label-for="nama-input"
                >
                    <b-form-input
                        id="nama-input"
                        v-model="form.nama"
                        required
                    ></b-form-input>
                </b-form-group>

                <b-row>
                    <b-col>
                        <b-form-group
                        label="NIK Donatur"
                        label-for="nik-input"
                        >
                            <b-form-input
                                id="nik-input"
                                v-model="form.nik"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group
                        label="No HP Donatur"
                        label-for="name-input"
                        >
                            <b-form-input
                                id="hp-input"
                                v-model="form.handphone"
                            ></b-form-input>
                            <label for="" style="font-size: 10px">
                                * Nomor HP yang dituliskan harus sama dengan nomor HP yang terdaftar di aplikasi LinkAja
                            </label>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-form-group id="label-qa" label-for="syarat" class="text-center">
                    <b-form-checkbox
                    id="qa"
                    v-model="form.agreement"
                    name="qa"
                    value="accepted"
                    unchecked-value="not_accepted"
                    >
                    Saya menyetujui Syarat & Ketentuan yang berlaku
                    </b-form-checkbox>
                </b-form-group>
            </form>
            <template #modal-footer="{}" class="center-button">
                <!-- Emulate built in modal footer ok and cancel button actions -->
                <b-button v-b-modal.modal-qr size="md" @click="saveDonation()" class="btn btn-md btn-donasi-2" style="width: 20%;">
                    Lanjut
                </b-button>
            </template>
        </b-modal>

        <b-modal id="modal-qr" size="md" ok-only>
            <div class="modal-title-custom">
                Terima kasih atas donasi Anda!
            </div>
            <div style="text-align: center; margin-bottom: 30px">
                Silakan scan QR Code berikut untuk melakukan donasi
            </div>
            
            <b-card id="qr" :img-src="detailCampaign.campaign_qr_code ? detailCampaign.campaign_qr_code.url : ''" img-height="250" img-width="250" style="height: 250px; width: 250px; margin: 0 auto; float: none; margin-bottom: 10px">
                <!-- <b-img v-if="detailCampaign.campaign_qr_code" :src="detailCampaign.campaign_qr_code.url" fluid alt="Responsive image" style="object-fit: contain;"></b-img> -->
            </b-card>

            <div style="text-align: center; margin-bottom: 30px">
                {{ detailCampaign.campaign_qr_code ? detailCampaign.campaign_qr_code.nama_linkaja : ''}}
            </div>

            <template #modal-footer="{ok}">
                <!-- Emulate built in modal footer ok and cancel button actions -->
                <b-button class="btn btn-md btn-donasi-2" size="md" @click="ok" style="width: 40%;">
                    Tutup
                </b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
export default {
    // middleware: 'auth',
    layout: 'navbar',
    data() {
        return {
            id: this.$route.params.id,
            detailCampaign: {},
            baseURL: undefined,
            form: {
                nama: undefined,
                nik: undefined,
                handphone: undefined,
                agreement: false
            },
            errors: {},
        }
    },
    computed: {
        // state
        namaDonatur() {
            return this.form.namaDonatur === undefined
        },

        // feedback
        invalidNamaDonatur() {
            if (this.form.nama_donatur !== undefined) {
                return this.errors['nama_donatur']
            }
        },
    },
    created: function(){
        this.getDetailCampaign();
        this.baseURL = this.$axios.defaults.baseURL;
    }, 
    methods: {
        async getDetailCampaign(){        
            await this.$axios.$get(`campaign/${this.id}`).then(response => {
                this.detailCampaign = response;
                console.log(this.detailCampaign);
            }).catch(e => {
                console.log(e)
            })
        },

        saveDonation(){      
            
            const formData = new FormData()
            formData.append('nama', this.form.nama)
            formData.append('nik', this.form.nik)
            formData.append('handphone', this.form.handphone)
            formData.append('agreement', this.form.agreement ? 1 : 0)
            
            this.$axios.$post(`campaign/${this.id}/contributor`, formData).then(response => {
                this.resetModal();
            }).catch(e => {
                if (error.response.status == 422) {
                    this.errors = error.response.data
                } else {
                    this.$bvToast.toast(`Terjadi kesalahan pada api`, {
                    title: 'Terjadi kesalahan',
                    autoHideDelay: 5000,
                    appendToast: true,
                    variant: 'danger',
                    })
                }
            })
            
            // Hide the modal manually
            this.$nextTick(() => {
                this.$bvModal.hide('modal-prevent-closing')
            })
        },

        resetModal() {
            this.form.nama_donatur = ''
            this.form.nik_donatur = ''
            this.form.no_hp = ''
            this.form.qa = false
        },
        // handleOk(bvModalEvt) {
        //     // Prevent modal from closing
        //     bvModalEvt.preventDefault()
        //     // Trigger submit handler
        //     this.handleSubmit()
        // },
        // handleSubmit() {
        //     const formData = new FormData()
        //     formData.append('nama_donatur', this.form.nama_donatur)
        //     formData.append('nik', this.form.nik_donatur)
        //     formData.append('handphone', this.form.no_hp)
        //     formData.append('agreement', this.form.qa ? 1 : 0)
            
        //     // Exit when the form isn't valid
        //     if (!this.checkFormValidity()) {
        //         return
        //     }
        //     // Push the name to submitted names
        //     this.$axios.$post(`campaign/${this.id}/donation`, formData).then(response => {
        //         this.resetModal();
        //     }).catch(e => {
        //         console.log(e)
        //     })
        //     // Hide the modal manually
        //     this.$nextTick(() => {
        //         this.$bvModal.hide('modal-prevent-closing')
        //     })
        // }
    }
    }
</script>

<style>
.card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    border: 1px solid rgba(0, 0, 0, .05);
    border-radius: 1.375rem;
    background-color: #fff;
    background-clip: border-box;
}

.card-img, .card-img-left {
    object-fit: cover;
    /* height: 300px; */
    /* width: 40%; */
    border-top-left-radius: calc(1.25rem - 1px);
    border-top-right-radius: calc(1.25rem - 1px);
    border-bottom-left-radius: calc(1.25rem - 1px);
    border-bottom-right-radius: calc(1.25rem - 1px);
}

.btn-donasi-1 {
    color: #ffffff;
    border-color: #E42312;
    background-color: #E42312;
    box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);
    border-radius: 2.0em;
    font-size: 16px;
    width: 100%;
    position: absolute;
    bottom: 10%;
}

.btn-donasi-1:hover {
    color: #686868 !important;
    background-color: #ffffff;
    border-color: #E42312;
}

.btn-donasi-2 {
    color: #ffffff;
    border-color: #E42312;
    background-color: #E42312;
    box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);
    border-radius: 2.0em;
    font-size: 16px;
}

.btn-donasi-2:hover {
    color: #686868 !important;
    background-color: #ffffff;
    border-color: #E42312;
}

.descript {
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.modal-title {
    font-size: 1.0625rem;
    display: inline;
    text-align: center;
}

.modal-footer {
    justify-content: center !important;
}

/* #qr .card-img{
    object-fit: cover;
    border-top-left-radius: calc(1.25rem - 1px);
    border-top-right-radius: calc(1.25rem - 1px);
    border-bottom-left-radius: calc(1.25rem - 1px);
    border-bottom-right-radius: calc(1.25rem - 1px);
} */
</style>