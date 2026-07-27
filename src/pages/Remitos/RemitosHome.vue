<template>
  <div class="q-pa-lg">
    <div class="page-header">
      <div>
        <h1 class="page-title">Remitos</h1>
        <p class="page-subtitle">Generá un remito nuevo o consultá los ya emitidos.</p>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="accion in acciones" :key="accion.nombre" class="col-12 col-sm-6 col-md-4">
        <q-card
          flat
          class="surface-card accion-card cursor-pointer full-height"
          @click="$router.push({ name: accion.nombre })"
        >
          <q-card-section class="q-pa-lg">
            <div class="accion-icono q-mb-md" :class="accion.tono">
              <q-icon :name="accion.icono" size="26px" />
            </div>
            <div class="text-subtitle1 text-weight-semibold">{{ accion.titulo }}</div>
            <div class="text-body2 text-grey-7 q-mt-xs">{{ accion.descripcion }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none q-pb-lg q-px-lg">
            <div class="text-caption text-weight-medium text-primary flex items-center">
              {{ accion.cta }}
              <q-icon name="arrow_forward" size="16px" class="q-ml-xs" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RemitosHome',
  setup() {
    const acciones = [
      {
        nombre: 'remitosGenerar',
        titulo: 'Generar Remito',
        descripcion: 'Cargá los productos y emití un remito nuevo para un cliente.',
        cta: 'Crear remito',
        icono: 'receipt_long',
        tono: 'tono-primario',
      },
      {
        nombre: 'remitosConsultar',
        titulo: 'Consultar Remito',
        descripcion: 'Buscá remitos emitidos, descargá el PDF o eliminá los que no correspondan.',
        cta: 'Ver remitos',
        icono: 'search',
        tono: 'tono-secundario',
      },
    ];

    return { acciones };
  },
};
</script>

<style scoped>
.accion-card {
  position: relative;
  overflow: hidden;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.accion-card:hover {
  border-color: var(--color-brand-accent);
  box-shadow: 0 8px 24px -12px rgb(15 23 42 / 0.25);
  transform: translateY(-2px);
}

/* Brillo diagonal que barre la tarjeta al hacer hover. El pseudo-elemento
   arranca fuera del borde izquierdo y se desliza hacia afuera del derecho;
   overflow:hidden en .accion-card lo recorta a los limites de la tarjeta. */
.accion-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -60%;
  width: 35%;
  height: 100%;
  background: linear-gradient(115deg, transparent, rgb(255 255 255 / 0.5), transparent);
  transform: skewX(-20deg);
  transition: left 0.6s ease;
  pointer-events: none;
}

.accion-card:hover::after {
  left: 130%;
}

.accion-icono {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tono-primario {
  background: color-mix(in srgb, var(--color-brand-primary) 12%, white);
  color: var(--color-brand-primary);
}

.tono-secundario {
  background: color-mix(in srgb, var(--color-brand-accent) 14%, white);
  color: var(--color-brand-accent);
}
</style>
