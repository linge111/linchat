<template>
  <v-card
      style="height: 100vh"
  >
    <v-container>
      <v-row>
        <v-col
            sm="9"
            offset-sm="1"
            md="6"
            offset-md="3"
        >
          <v-card
              class="mt-15"
              elevation="0"
          >
            <div class="text-center text-h4">登录</div>
            <v-card-text>
              <v-form ref="signInForm">
                <v-text-field
                    v-model="formData.username"
                    :rules="formRules.username"
                    label="用户名"
                    variant="underlined"
                    clearable
                ></v-text-field>
                <v-text-field
                    v-model="formData.password"
                    :rules="formRules.password"
                    label="密码"
                    variant="underlined"
                    @keyup.enter="submit"
                    clearable
                    :type="passwordInputType"
                    :append-inner-icon="passwordInputType === 'password' ? 'visibility' : 'visibility_off'"
                    @click:append-inner="passwordInputType = passwordInputType === 'password' ? 'text' : 'password'"
                ></v-text-field>

              </v-form>

              <div v-if="errorMsg" class="text-red">{{ errorMsg }}</div>

              <div
                class="mt-5 d-flex justify-space-between"
              >
                <v-btn
                    @click="navigateTo('/account/signup')"
                    variant="text"
                    color="primary"
                >注册新用户</v-btn>

                <v-btn
                    color="primary"
                    :loading="submitting"
                    @click="submit"
                    size="large"
                >提交</v-btn>
              </div>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>

</template>

<script setup>
definePageMeta({
  layout: 'vuetify-app'
})
const formData = ref({
  username: '',
  password: ''
})
const formRules = ref({
  username: [
      v => !!v || '必须输入用户名'
  ],
  password: [
      v => !!v || '必须输入密码'
  ]
})
const { $auth } = useNuxtApp()
const errorMsg = ref(null)
const signInForm = ref(null)
const valid = ref(true)
const submitting = ref(false)
const route = useRoute()
const passwordInputType = ref('password')

const submit = async () => {
  errorMsg.value = null
  const { valid } = await signInForm.value.validate()
  if (valid) {
    submitting.value = true
    const { data, error } = await useFetch('/api/account/login/', {
      method: 'POST',
      body: JSON.stringify(formData.value)
    })
    if (error.value) {
      if (error.value.status === 400) {
        if (error.value.data.non_field_errors) {
          errorMsg.value = error.value.data.non_field_errors[0]
        }
      } else {
        errorMsg.value = '服务器游泳去了，再试试呗。'
      }
    } else {
      $auth.setUser(data.value.user)
      navigateTo(route.query.callback || '/')
    }
    submitting.value = false
  }
}

</script>