<template>
  <q-layout view="hHh lpR fFf" class="bg-transparent">
    <q-header class="no-shadow no-border bg-transparent">
      <q-toolbar class="justify-center py-2">
        <q-img
          src="/src/assets/laportenialogo.png"
          class="max-h-[120px] max-w-[120px] sm:max-h-[160px] sm:max-w-[160px]"
          alt="La Porteña"
        />
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-transparent">
      <q-page class="bg-transparent">
        <slot />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.no-shadow {
  box-shadow: none !important;
}

.no-border {
  border: none !important;
}
</style>
