<template>
  <div>
    <b-container fluid="md" style="margin-top: 25px">
      <b-card class="center col-sm-10">
        <div class="text-center label-create-campaign" style="font-size:25px;">
          Update Campaign
        </div>
        <br>
        <div class="text-center" style="margin-bottom: 10px">
          Perbaiki data dengan teliti, lakukan pengcekan ulang sebelum campaign di publish kembali.
        </div>
          <br>
        <section class="design-process-section">
          <b-tabs
            content-class="mt-3"
            class="process-model more-icon-preocess"
            v-model="tabIndex"
          >
            <b-tab title="Detail Campaign" active>
              <b-form-group
                label="Nama Campaign"
                label-for="campaign"
                class="text-left"
                :invalid-feedback="invalidCampaignName"
                :state="stateCampaignName"
              >
                <b-form-input
                  id="campaign"
                  v-model="form.nama"
                  type="text"
                  placeholder="Nama Campaign"
                  required
                ></b-form-input>
              </b-form-group>

              <b-row>
                <b-col>
                  <b-form-group
                    label="Tanggal Mulai"
                    label-for="tanggal_mulai"
                    class="text-left mb-1"
                    :invalid-feedback="invalidTglMulai"
                    :state="stateTglMulai"
                  >
                    <b-form-datepicker
                      id="tanggal_mulai"
                      v-model="form.tanggal_mulai"
                      class="mb-2"
                    ></b-form-datepicker>
                  </b-form-group>

                  <b-form-checkbox
                    id="tgl_akhir_check"
                    v-model="tanggal_akhir_status"
                    name="tgl_akhir_check"
                    value="required"
                    unchecked-value="not_required"
                  >
                    Campaign mempunyai batas akhir pengumpulan dana
                  </b-form-checkbox>
                </b-col>
                <b-col>
                  <b-form-group
                    label="Tanggal Akhir"
                    label-for="tanggal_akhir"
                    class="text-left"
                    :invalid-feedback="invalidTglAkhir"
                    :state="stateTglAkhir"
                    v-if="tanggal_akhir_status == 'required'"
                  >
                    <b-form-datepicker
                      id="tanggal_akhir"
                      v-model="form.tanggal_akhir"
                      class="mb-2"
                    ></b-form-datepicker>
                  </b-form-group>
                </b-col>
              </b-row>

              <hr class="my-3" />

              <b-form-group
                label="Deskripsi"
                label-for="deskripsi"
                class="text-left"
                :invalid-feedback="invalidCampaignDesc"
                :state="stateCampaignDesc"
              >
                <b-form-textarea
                  id="deskripsi"
                  v-model="form.deskripsi"
                  placeholder="deskripsi"
                  rows="3"
                  max-rows="6"
                ></b-form-textarea>
              </b-form-group>

              <b-form-group
                label="Foto Campaign"
                label-for="foto_campaign"
                class="text-left"
                :invalid-feedback="invalidCampaignPhoto"
                :state="stateCampaignPhoto"
              >
                <b-form-file
                  v-model="form.foto_campaign"
                  placeholder="Choose a file or drop it here..."
                  drop-placeholder="Drop file here..."
                  @change="onBannerChange"
                ></b-form-file>
                <img
                    v-if="tempBannerUrl"
                    :src="tempBannerUrl"
                    class="border border-primary p-1"
                    style="width: 200px; height: 200px; margin-top: 20px"
                  />
              </b-form-group>

              <b-button @click="tabIndex++" variant="outline-danger"
                >Lanjut</b-button
              >
            </b-tab>
            <b-tab title="QR Code LinkAja"
              ><b-row>
                <b-col>
                  <b-form-group
                    label="Nama LinkAja"
                    label-for="Linkaja"
                    class="text-left"
                    :invalid-feedback="invalidLinkAja"
                    :state="stateLinkAja"
                  >
                    <b-form-input
                      id="linkaja"
                      v-model="form.name_linkaja"
                      type="text"
                      placeholder="Nama LinkAja"
                      required
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="QR Code LinkAja"
                    label-for="qrcode_linkaja"
                    class="text-left"
                    :invalid-feedback="invalidQrCode"
                    :state="stateQrCode"
                  >
                    <b-form-file
                      v-model="form.qrcode_linkaja"
                      placeholder="Choose a file or drop it here..."
                      drop-placeholder="Drop file here..."
                      @change="onQrCodeChange"
                    ></b-form-file>
                  </b-form-group>
                </b-col>
                <b-col>
                  <img
                    v-if="tempQrCodeUrl"
                    :src="tempQrCodeUrl"
                    class="border border-primary p-1"
                    style="width: 200px; height: 200px"
                  />
                </b-col>
              </b-row>
              <b-button @click="tabIndex--" variant="danger">Kembali</b-button>
              <b-button @click="tabIndex++" variant="outline-danger"
                >Lanjut</b-button
              >
            </b-tab>
            <b-tab title="Agen Sahabat NITS">
              <b-form-group>
                <b-row>
                  <b-col>
                    <strong
                      >Apakah campaign mempunyai Agen Sahabat NITS?</strong
                    >
                  </b-col>
                  <b-col :md="1">
                    <b-form-checkbox
                      id="check-agent"
                      v-model="check_agent"
                      switch
                      size="lg"
                      button-variant="outline-danger"
                      @change="onChange($event)"
                    >
                    </b-form-checkbox>
                  </b-col>
                </b-row>
              </b-form-group>

              <b-form-group
                v-if="check_agent"
                label="Agen Sahabat NITS"
                label-for="sahabat-nits"
                class="text-left"
              >
                <b-form-input
                  id="sahabat-nits"
                  type="text"
                  placeholder=""
                  required
                ></b-form-input>
              </b-form-group>
              <b-button @click.prevent="onSubmit(0)" variant="danger"
                >Save To Draft</b-button
              >
              <b-button @click.prevent="onSubmit(1)" variant="outline-danger"
                >Save & Publish</b-button
              >
            </b-tab>
          </b-tabs>
        </section>
      </b-card>
    </b-container>
  </div>
</template>

<script>
export default {
  // middleware: 'auth',
  layout: 'navbar',
  computed: {
    // state
    stateCampaignName() {
      return this.errors['nama'] === undefined
    },
    stateTglMulai() {
      return this.errors['tanggal_mulai'] === undefined
    },
    stateTglAkhir() {
      return this.errors['tanggal_selesai'] === undefined
    },
    stateCampaignDesc() {
      return this.errors['deskripsi'] === undefined
    },
    stateCampaignPhoto() {
      return this.errors['campaign_photos.file'] === undefined
    },
    stateLinkAja() {
      return this.errors['campaign_qr_codes.nama_linkaja'] === undefined
    },
    stateQrCode() {
      return this.errors['campaign_qr_codes.file'] === undefined
    },

    // feedback
    invalidCampaignName() {
      if (this.errors['nama'] !== undefined) {
        return this.errors['nama'][0]
      }
    },
    invalidTglMulai() {
      if (this.errors['tanggal_mulai'] !== undefined) {
        return this.errors['tanggal_mulai'][0]
      }
    },
    invalidTglAkhir() {
      if (this.errors['tanggal_selesai'] !== undefined) {
        return this.errors['tanggal_selesai'][0]
      }
    },
    invalidCampaignDesc() {
      if (this.errors['deskripsi'] !== undefined) {
        return this.errors['deskripsi'][0]
      }
    },
    invalidCampaignPhoto() {
      if (this.errors['campaign_photos.file'] !== undefined) {
        return this.errors['campaign_photos.file'][0]
      }
    },
    invalidLinkAja() {
      if (this.errors['campaign_qr_codes.nama_linkaja'] !== undefined) {
        return this.errors['campaign_qr_codes.nama_linkaja'][0]
      }
    },
    invalidQrCode() {
      if (this.errors['campaign_qr_codes.file'] !== undefined) {
        return this.errors['campaign_qr_codes.file'][0]
      }
    },
  },
  data() {
    return {
      form: {
        nama: '',
        tanggal_mulai: '',
        tanggal_akhir: '',
        deskripsi: '',
        foto_campaign: undefined,
        name_linkaja: '',
        qrcode_linkaja: undefined,
      },
      tabIndex: 1,
      lastTabDisabled: true,
      show: true,
      errors: {},
      tempBannerUrl: null,
      tempQrCodeUrl: null,
      tanggal_akhir_status: 'not_required',
      check_agent: false,
      foto_campaign: undefined
    }
  },
  created: function () {
    if (!this.$auth.loggedIn) {
      this.$router.push('/login')
    } else {
      const token = this.$auth.strategy.token.get()
      const config = {
        headers: { Authorization: `${token}` },
      }
      let idParam = this.$route.query.id

      this.$axios
        .$get(`${this.$axios.defaults.baseURL}/campaign/${idParam}`, config)
        .then((data) => {
          let format_tanggal_mulai =
            `${data.tanggal_mulai.substring(6, 11)}-` +
            `${data.tanggal_mulai.substring(3, 5)}-` +
            `${data.tanggal_mulai.substring(0, 2)}`

          this.form.nama = data.nama
          this.form.tanggal_mulai = format_tanggal_mulai
          this.form.deskripsi = data.deskripsi

          // this.form.foto_campaign = URL.createObjectURL(data.campaign_photo.url)

          this.tempBannerUrl = data.campaign_photo.url

          this.tempQrCodeUrl = data.campaign_qr_code.url
          
          this.form.name_linkaja = data.campaign_qr_code.nama_linkaja

          if (data.tanggal_selesai !== null) {
            let format_tanggal_selesai =
              `${data.tanggal_selesai.substring(6, 11)}-` +
              `${data.tanggal_selesai.substring(3, 5)}-` +
              `${data.tanggal_selesai.substring(0, 2)}`

            this.tanggal_akhir_status = 'required'
            this.form.tanggal_akhir = format_tanggal_selesai
          }
        })
        .catch((error) => {
          if (error.response !== undefined) {
            if (error.response.status == 422) {
              this.errors = error.response.data
            } else if (error.response.status == 401) {
              window.location.href = 'login'
            } else {
              this.$bvToast.toast(`Terjadi kesalahan pada api`, {
                title: 'Terjadi kesalahan',
                autoHideDelay: 5000,
                appendToast: true,
                variant: 'danger',
              })
            }
          }
        })
    }
  },
  methods: {
    onSubmit(isPublish) {
      const token = this.$auth.strategy.token.get()
      const config = {
        headers: { Authorization: `${token}` },
      }

      const formData = new FormData()
      formData.append('nama', this.form.nama)
      formData.append('tanggal_mulai', this.form.tanggal_mulai)
      formData.append('tanggal_selesai', this.form.tanggal_akhir)
      formData.append('deskripsi', this.form.deskripsi)
      formData.append('campaign_qr_codes[nama_linkaja]', this.form.name_linkaja)
      if (this.form.qrcode_linkaja !== undefined) {
        formData.append('campaign_qr_codes[file]', this.form.qrcode_linkaja)
      }
      if (this.form.foto_campaign !== undefined) {
        formData.append('campaign_photos[file]', this.form.foto_campaign)
      }
      formData.append('is_publish', isPublish)

      let paramId = this.$route.query.id

      this.$axios
        .$post(
          `${this.$axios.defaults.baseURL}/campaign/${paramId}`,
          formData,
          config
        )
        .then((data) => {
          this.foto_campaign = undefined
          this.$router.push('/campaign/kelola-campaign')
        })
        .catch((error) => {
          if (error.response.status == 422) {
            this.errors = error.response.data
          } else if (error.response.status == 401) {
            window.location.href = 'login'
          } else {
            this.$bvToast.toast(`Terjadi kesalahan pada api`, {
              title: 'Terjadi kesalahan',
              autoHideDelay: 5000,
              appendToast: true,
              variant: 'danger',
            })
          }
        })
    },
    onBannerChange(e) {
      const file = e.target.files[0]
      this.tempBannerUrl = URL.createObjectURL(file)
    },
    onQrCodeChange(e) {
      const file = e.target.files[0]
      this.tempQrCodeUrl = URL.createObjectURL(file)
    },
    onChange(event) {
      this.check_agent = event
      console.log(event)
    },
  },
}
</script>

<style scoped>
.custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
  border-color: #e42312 !important;
  background-color: #e42312 !important;
  box-shadow: 0 3px 2px rgb(233 236 239 / 5%);
}
</style>
