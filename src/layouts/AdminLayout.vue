<template>
    <q-layout view="hHh lpR fFf" style="background-color: transparent;"> <!-- Layout con fondo transparente -->
      <q-header elevated style="background-color: transparent;"> <!-- Fondo del header transparente -->
        <q-toolbar>
          <q-space /> <!-- Espacio a la izquierda para centrar la imagen -->
  
          <!-- Contenedor para el logo -->
          <div style="display: flex; justify-content: center; flex-grow: 1;">
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
  
  <script>
  export default {
    name: 'AdminLayout',
  };
  </script>
  
  <style scoped>

  q-header {
    background-color: transparent; /* Fondo del header transparente */
  }
  
  q-page-container {
    background-color: transparent; /* Fondo del contenedor transparente */
  }
  
  q-page {
    background-color: transparent; /* Fondo de la página transparente */

  }
  </style>
  