<script setup lang="ts">
defineProps({
  url: {
    type: String,
  },
});

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
</script>

<template>
  <ETailwind>
    <EHtml>
      <EHead />
      <!-- <EPreview> The sales intelligence platform that helps you uncover qualified leads. </EPreview> -->
      <EBody :style="main">
        <EContainer class="mx-auto pt-4 pb-10">
          <ELink :href="url" class="font-bold block text-center text-xl py-4">
            <span class="text-primary-600 dark:text-primary-400">Skeleton</span>
            <span class="text-secondary-500 dark:text-secondary-300">Logo</span>
          </ELink>
          <EText class="text-md"> {{ $tt("$.mailing.addressed") }}, </EText>
          <EText class="text-md" py="12">
            {{ $tt("$.mailing.signup.thank_you") }}
          </EText>
          <EText class="text-md">
            {{ $tt("$.mailing.signup.success_done") }}
          </EText>
          <EText class="text-md" py="12">
            {{ $tt("$.mailing.signup.further_questions") }}
          </EText>
          <EText class="text-md">
            {{ $tt("$.mailing.regards") }},
            <br />
            {{ $tt("$.mailing.team") }}
          </EText>
          <EHr class="text-gray-600" my="20" />
          <EText class="text-xs text-gray-600">
            © {{ new Date().getFullYear() }}
            <ELink :href="url" class="font-bold">
              <span class="text-primary-600 dark:text-primary-400"
                >Skeleton</span
              >
              <span class="text-secondary-500 dark:text-secondary-300"
                >Logo</span
              ></ELink
            >. {{ $tt("$.mailing.reserved") }}.
          </EText>
        </EContainer>
      </EBody>
    </EHtml>
  </ETailwind>
</template>
