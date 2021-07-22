<template>
  <div>
    <b-container fluid="md" style="margin-top: 25px">
      <b-card class="center col-sm-10">
        <div class="text-center label-create-campaign" style="font-size:25px;">
          Tambah Campaign Baru
        </div>
        <br>
        <div class="text-center" style="margin-bottom: 10px">
          Silahkan mengisi formulir dibawah ini, pastikan data yang dimasukan sudah sesuai.
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
                  placeholder="Masukan nama campaign (contoh: Rumah Yatim)"
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
              <br>

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
                  placeholder="Masukan deskripsi campaign"
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
                ></b-form-file>
              </b-form-group>
              <div>
              <b-button @click="tabIndex++" variant="outline-danger" 
                >Lanjut</b-button
              ></div>
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
                <multiselect
                  id="ajax"
                  open-direction="bottom"
                  v-model="form.agents"
                  :options="form.agent_options"
                  :hide-selected="true"
                  :limit="10"
                  :multiple="true"
                  :searchable="true"
                  :loading="form.agent_loading"
                  :options-limit="300"
                  @search-change="agentFind"
                  :allow-empty="false"
                  track-by="username"
                  label="nama"
                ></multiselect>
              </b-form-group>
              <b-button
                @click.prevent="onSubmit(0)"
                to="/beranda"
                variant="danger"
                >Save To Draft</b-button
              >
              <b-button
                @click.prevent="onSubmit(1)"
                to="/beranda"
                variant="outline-danger"
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
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

export default {
  // middleware: 'auth',
  components: { Multiselect },
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
        agents: null,
        agent_options: [],
        agent_loading: false,
      },
      tabIndex: 1,
      lastTabDisabled: true,
      show: true,
      errors: {},
      tempQrCodeUrl: null,
      tanggal_akhir_status: 'not_required',
      check_agent: false,
    }
  },
  created: function () {
    if (!this.$auth.loggedIn) {
      this.$router.push('/login')
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
      formData.append('campaign_qr_codes[file]', this.form.qrcode_linkaja)
      formData.append('campaign_photos[file]', this.form.foto_campaign)
      formData.append('is_publish', isPublish)

      this.$axios
        .$post(`${this.$axios.defaults.baseURL}/campaign`, formData, config)
        .then((data) => {
          console.log(data)
          this.lastTabDisabled = false
        })
        .then(() => {
          this.tabIndex++
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
    onQrCodeChange(e) {
      const file = e.target.files[0]
      this.tempQrCodeUrl = URL.createObjectURL(file)
    },
    onChange(event) {
      this.check_agent = event
      console.log(event)
    },
    agentFind(query) {
      const token = this.$auth.strategy.token.get()
      const config = {
        headers: { Authorization: `${token}` },
      }

      this.form.agent_loading = true
      this.$axios
        .get(
          `${this.$axios.defaults.baseURL}/agent`,
          { username: query },
          config
        )
        .then((response) => {
          let agent_array = []
          response.data.forEach((element) => {
            agent_array.push({
              username: element.username,
              nama: element.userinformation.nama,
            })
          })

          return agent_array
        })
        .then((array) => {
          this.form.agent_options = array
          this.form.agent_loading = false
        })
        .catch((error) => {
          this.$bvToast.toast(`Terjadi kesalahan pada api`, {
            title: 'Terjadi kesalahan',
            autoHideDelay: 5000,
            appendToast: true,
            variant: 'danger',
          })
        })
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
