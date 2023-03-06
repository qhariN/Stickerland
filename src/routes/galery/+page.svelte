<script lang="ts">
  import { slide } from 'svelte/transition'
  import type { Asset } from '../../interfaces/asset'

  const fetchAssets = async (): Promise<Asset[]> => {
    const response = await fetch('https://stickerland-api.vercel.app/api/asset')
    const data = await response.json()
    return data
  }
</script>

<div class="contents">
  {#await fetchAssets()}
    <lottie-player transition:slide autoplay loop src="loading.json" speed="1" intermission="0" class="h-48"></lottie-player>
  {:then assets}
    <div class="grid grid-cols-2 gap-4">
      {#each assets as asset}
        <a class="rounded-2xl bg-white/50 p-3 transition-transform hover:scale-105 hover:rotate-3 cursor-pointer shadow-sm" href="https://wa.me/51935858346?text=sticker-ID%20{asset.public_id}" target="_blank" rel="noopener noreferrer">
          <img src={asset.url} alt="sticker" class="rounded-xl" />
        </a>
      {/each}
    </div>
    <a href="/" class="button sticky bottom-8 mt-4">Generar nuevo sticker</a>
  {/await}
</div>
