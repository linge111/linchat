<script setup>
definePageMeta({
  layout: 'vuetify-app',
  path: '/account/verify-email/:token',
  title: '验证电子邮箱'
})
const route = useRoute()
const verifying = ref(false)
const status = ref('')

const verifyEmail = async () => {
  verifying.value = true
  const { data, error } = await useFetch(`/api/account/registration/verify-email/`, {
    method: 'POST',
    body: JSON.stringify({
      key: route.params.token
    })
  })
  if (!error.value && data.value.detail === 'ok') {
    status.value = 'success'
  } else {
    status.value = 'error'
  }
  verifying.value = false
}

onNuxtReady(() => {
  verifyEmail()
})
</script>

<template>
  <v-container class="h-100vh">
    <v-row
        class="fill-height"
        align-content="center"
        justify="center"
    >
      <v-col
          class="text-subtitle-1 text-center"
          cols="12"
          v-if="verifying"
      >
        验证您的电子邮件
      </v-col>
      <v-col
          cols="6"
          v-if="verifying"
      >
        <v-progress-linear
            color="deep-purple-accent-4"
            indeterminate
            rounded
            height="6"
        ></v-progress-linear>
      </v-col>
      <v-col
          cols="12"
          v-if="status === 'success'"
          class="text-center"
      >
        <h2 class="text-h4">
          您的电子邮件已经验证。
        </h2>
        <p class="text-subtitle-1">
          您现在可以登录的帐户。
        </p>
        <v-btn
            color="primary"
            variant="text"
            @click="navigateTo('/account/login')"
        >
          登录
        </v-btn>
      </v-col>
      <v-col
          cols="12"
          v-if="status === 'error'"
          class="text-center"
      >
        <h2 class="text-h4">
          验证您的电子邮件时出错。
        </h2>
        <v-btn
            color="primary"
            variant="text"
            @click="navigateTo('/account/onboarding?resend=1')"
        >
          重新发送电子邮件
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.h-100vh {
  height: 100vh;
}
</style>