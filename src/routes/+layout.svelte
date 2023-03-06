<script>
  import { afterUpdate } from 'svelte'
  import '../app.css'

  afterUpdate(async () => {
    await import('@lottiefiles/lottie-player')
  })
</script>

<svelte:head>
  <title>Stickerland</title>
  <link rel="canonical" href="https://stickerland.vercel.app/" />
  <meta name="title" content="Stickerland" />
  <meta name="description" content="Crea y comparte tus propios stickers para WhatsApp" />
  <meta name="author" content="Jhorman Ruswel Tito Tito" />
  <meta name="robots" content="index,follow" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Stickerland" />
  <meta property="og:site_name" content="Stickerland" />
  <meta property="og:description" content="Crea y comparte tus propios stickers para WhatsApp" />
  <meta property="og:url" content="https://stickerland.vercel.app/" />
  <meta property="og:locale" content="es" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://stickerland.vercel.app/" />
  <meta name="twitter:title" content="Stickerland" />
  <meta name="twitter:description" content="Crea y comparte tus propios stickers para WhatsApp" />
</svelte:head>

<lottie-player autoplay loop src="bg.json" speed=".3" intermission="0" class="absolute right-24 sm:left-0 sm:right-0 top-0 bottom-0 ml-auto mr-auto mt-0 mb-0 w-[200%] sm:w-full lg:w-11/12 2xl:w-1/2 -z-10 opacity-50"></lottie-player>
<div class="min-h-screen max-h-screen overflow-y-auto">
  <main class="min-h-screen max-w-[440px] mx-auto w-full flex items-center py-6 px-2 sm:p-8">
    <div class="card w-full">
      <div class="space-y-3 mb-8">
        <h1 class="text-center text-5xl font-bold">Stickerland</h1>
        <p class="description">
          Crea y comparte tus propios stickers para WhatsApp
        </p>
      </div>
      <slot />
    </div>
  </main>
</div>

<style lang="postcss">
  .card {
    @apply bg-white/60 rounded-3xl px-8 py-10 shadow-xl shadow-black/5;
  }
  .description {
    @apply font-medium text-center text-xl opacity-80 max-w-lg;
  }
</style>
