<script setup>
definePageMeta({
  layout: 'vuetify-app',
  middleware: ['auth']
})
const route = useRoute()
const sending = ref(false)
const resent = ref(false)
const errorMsg = ref(null)
const resendEmail = async () => {
  errorMsg.value = null
  sending.value = true
  const { data, error } = await useFetch('/api/account/registration/resend-email/', {
    method: 'POST',
  })
  if (error.value) {
    errorMsg.value = 'Something went wrong. Please try again later.'
  } else {
    resent.value = true
  }
  sending.value = false
}

onNuxtReady(() => {
  if (route.query.resend) {
    resendEmail()
  }
})
</script>

<template>
  <v-card
      class="h-100vh"
  >
    <v-container>
      <v-row>
        <v-col
            sm="9"
            offset-sm="1"
            md="8"
            offset-md="2"
        >
          <v-card
              class="mt-20vh"
              elevation="0"
          >
            <div class="text-center">
              <div v-if="route.query.email_verification_required && route.query.email_verification_required === 'none'">
                <h2 class="text-h4">注册成功</h2>
                <p class="mt-5">
                  现在可以 <NuxtLink to="/account/signin">登录</NuxtLink> 到您的账户了。
                </p>
              </div>
              <div v-else>
                <h2 class="text-h4">验证您的电子邮件</h2>
                <p class="mt-5">
                 我们已将验证邮件发送至 <strong>{{ $auth.user.email }}</strong>. <br>
                  请检查您的收件箱并单击链接以验证您的电子邮件地址。
                </p>
                <p v-if="errorMsg"
                   class="text-red"
                >{{ errorMsg }}</p>
                <v-btn
                    variant="text"
                    class="mt-5"
                    color="primary"
                    :loading="sending"
                    @click="resendEmail"
                    :disabled="resent"
                >
                  {{ resent ? 'Resent' : 'Resend email'}}
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped>
.h-100vh {
  height: 100vh;
}
.mt-20vh {
  margin-top: 20vh;
}
</style>