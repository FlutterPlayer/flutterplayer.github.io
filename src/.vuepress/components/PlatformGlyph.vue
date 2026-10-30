<script setup lang="ts">
defineProps<{
  name: 'flutter' | 'android' | 'apple' | 'windows' | 'ohos';
}>();
</script>

<template>
  <svg
    class="platform-glyph"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'flutter'">
      <path d="M5.25 12.1 12.4 4.9h5.55l-7.2 7.2z" fill="currentColor" stroke="none" />
      <path d="m10.75 12.1 7.2 7.2h-5.55l-7.2-7.2z" fill="currentColor" stroke="none" />
      <path d="m8.55 14.3 3.55 3.55" />
    </template>
    <template v-else-if="name === 'android'">
      <path d="M7.2 9.1h9.6v7.2H7.2z" />
      <path d="M8.3 9.1 6.7 6.8M15.7 9.1l1.6-2.3" />
      <path d="M7.2 16.3v2.2M16.8 16.3v2.2M10 12.2h.01M14 12.2h.01" />
      <path d="M9.1 19.3h5.8" />
    </template>
    <template v-else-if="name === 'apple'">
      <path d="M15.2 3.8c.1 1.2-.4 2.4-1.1 3.2-.8.9-2.1 1.6-3.4 1.5-.1-1.2.5-2.4 1.2-3.2.8-.9 2.1-1.5 3.3-1.5Z" fill="currentColor" stroke="none" />
      <path d="M18.2 17.1c-.6 1.4-1.4 2.8-2.6 3.8-1 .8-1.8.8-2.7.4-.9-.4-1.7-.4-2.6 0-1 .4-1.8.3-2.7-.4-2.2-1.8-3.7-5.4-2.7-8.1.7-2 2.4-3.3 4.4-3.4 1 0 1.9.5 2.5.5.6 0 1.7-.6 2.8-.5 1.3.1 2.4.7 3.2 1.6-2.4 1.5-2 4.7.4 6.1Z" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'windows'">
      <path d="M4.2 6.2 11 5.2v6.1H4.2zM12.6 5 19.8 4v7.3h-7.2zM4.2 12.7H11v6.1l-6.8-1zM12.6 12.7h7.2V20l-7.2-1z" fill="currentColor" stroke="none" />
    </template>
    <template v-else>
      <path d="m12 3.2 7.6 4.4v8.8L12 20.8l-7.6-4.4V7.6z" />
      <ellipse cx="12" cy="12" rx="3.4" ry="4.1" />
      <path d="M12 7.9v8.2" />
    </template>
  </svg>
</template>

<style scoped>
.platform-glyph {
  display: block;
  flex: none;
}
</style>
