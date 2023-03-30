<script setup>
definePageMeta({
  layout: 'vuetify-app'
})

const { $auth } = useNuxtApp()

const formData = ref({
  username: '',
  email: '',
  password1: '',
  password2: '',
})

const fieldErrors = ref({
  username: '',
  email: '',
  password1: '',
  password2: '',
})

const formRules = ref({
  username: [
    v => !!v || '请输入的你用户名',
    v => v.length >= 4 || '用户名至少要有4个有效字符'
  ],
  email: [
    v => !!v || '请填写有效的电子邮箱',
    v => /.+@.+\..+/.test(v) || '电子邮箱必须有效'
  ],
  password1: [
    v => !!v || '请设置你的密码',
    v => v.length >= 8 || '密码不少于8位并区分大小写'
  ],
  password2: [
    v => !!v || '请重复上面的密码',
    v => v.length >= 8 || '密码不少于8位并区分大小写',
    v => v === formData.value.password1 || '两个密码必须是一致的'
  ]
})

const submitting = ref(false)
const errorMsg = ref(null)
const signUpForm = ref(null)

const submit = async () => {
  errorMsg.value = null
  const { valid } = await signUpForm.value.validate()
  if (valid) {
    submitting.value = true

    const { data, error } = await useFetch('/api/account/registration/', {
      method: 'POST',
      body: JSON.stringify(formData.value)
    })

    console.log(error.value)

    if (error.value) {
      if (error.value.status === 400) {
        for (const key in formData.value) {
          if (error.value.data[key]) {
            fieldErrors.value[key] = error.value.data[key][0]
          }
        }
        if (error.value.data.non_field_errors) {
          errorMsg.value = error.value.data.non_field_errors[0]
        }
      } else {
        if (error.value.data.detail) {
          errorMsg.value = error.value.data.detail
        } else {
          errorMsg.value = '服务器游泳去了，再试一下呗。'
        }
      }
    } else {
      $auth.setUser(data.value.user)
      navigateTo('/account/onboarding')
    }

    submitting.value = false
  }
}

const handleFieldUpdate = (field) => {
  // fieldErrors.value[field] = ''
}
</script>

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
            <div class="text-center text-h4">创建你的账户</div>
            <v-card-text>
              <v-form ref="signUpForm" class="mt-5">
                <v-text-field
                    v-model="formData.username"
                    :rules="formRules.username"
                    :error-messages="fieldErrors.username"
                    label="用户名"
                    variant="underlined"
                    @update:modelValue="handleFieldUpdate('username')"
                    clearable
                ></v-text-field>

                <v-text-field
                    v-model="formData.email"
                    :rules="formRules.email"
                    :error-messages="fieldErrors.email"
                    label="电子邮箱"
                    variant="underlined"
                    @@update:modelValue="handleFieldUpdate('email')"
                    clearable
                ></v-text-field>

                <v-text-field
                    v-model="formData.password1"
                    :rules="formRules.password1"
                    :error-messages="fieldErrors.password1"
                    label="密码"
                    variant="underlined"
                    @update:modelValue="handleFieldUpdate('password1')"
                    clearable
                ></v-text-field>

                <v-text-field
                    v-model="formData.password2"
                    :rules="formRules.password2"
                    :error-messages="fieldErrors.password2"
                    label="重复密码"
                    variant="underlined"
                    @update:modelValue="handleFieldUpdate('password2')"
                    clearable
                ></v-text-field>

              </v-form>

              <div v-if="errorMsg" class="text-red">{{ errorMsg }}</div>

              <div
                  class="mt-5 d-flex justify-space-between"
              >
                <v-btn
                    @click="navigateTo('/account/signin')"
                    variant="text"
                    color="primary"
                >返回登录页面</v-btn>

                <v-btn
                    size="large"
                    color="primary"
                    :loading="submitting"
                    @click="submit"
                >提交</v-btn>
              </div>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>