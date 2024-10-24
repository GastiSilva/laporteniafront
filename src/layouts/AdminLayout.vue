<template>
  <q-layout view="hHh lpR fFf" style="background-color: transparent;"> <!-- Layout con fondo transparente -->
    <q-header class="no-shadow no-border" style="background-color: transparent;"> <!-- Quitar sombra y borde -->
      <q-toolbar>
        <q-space /> <!-- Espacio a la izquierda para centrar la imagen -->
  
        <!-- Contenedor para el logo con margen superior -->
        <div style="display: flex; justify-content: center; flex-grow: 1; margin-top: 20px;">
          <q-img
            src="/src/assets/laportenialogo.png" 
            style="max-height: 200px; max-width: 200px;" 
            alt="Logo"
          />
        </div>
  
        <q-space /> <!-- Espacio a la derecha para centrar la imagen -->
      </q-toolbar>
    </q-header>
  
    <q-page-container style="background-color: transparent; margin: 0; padding: 0;"> <!-- Fondo del contenedor transparente y sin márgenes -->
      <q-page style="background-color: transparent; margin: 0; padding: 0;"> <!-- Fondo de la página transparente -->
        <slot /> <!-- Aquí se inyecta el contenido de las páginas individuales -->
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
/* Quitar sombras y bordes en el q-header */
.no-shadow {
  box-shadow: none !important;
}

.no-border {
  border: none !important;
  border-bottom: none !important;
}

/* Añadir espacio al logo para que no esté pegado al borde superior */
q-header {
  background-color: transparent;
}

q-page-container, q-page {
  background-color: transparent;
}
</style>
