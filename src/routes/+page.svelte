<script lang="ts">
  import Dropzone from 'dropzone'
  import 'dropzone/dist/dropzone.css'
  import { onMount } from 'svelte'

  onMount(() => {
    const dropzone = new Dropzone('#dropzone', {
      uploadMultiple: false,
      acceptedFiles: '.png, .jpg, .jpeg, .gif, .svg, .webp',
      maxFiles: 1,
      maxFilesize: 10,
      url: 'https://api.cloudinary.com/v1_1/jhormanrus/image/upload'
    })

    dropzone.on('sending', (file, xhr, formData) => {
      formData.append('upload_preset', 'stickerland')
      formData.append('api_key', '525874491378754')
      formData.append('folder', 'stickerland')
    })

    dropzone.on('success', (file, response) => {
      console.log(response)
    })
  })
</script>

<div class="min-h-screen flex flex-col">
  <main class="max-w-screen-sm mx-auto w-full flex-grow flex items-center">
    <div class="card w-full">
      <h1 class="text-center text-5xl font-bold">Stickerland</h1>
      <form id="dropzone" class="shadow-2xl border-dashed border-2 border-gray-300 rounded-lg aspect-video w-full flex items-center justify-center flex-col">
        <button>upload files</button>
      </form>
    </div>
  </main>
</div>

<style lang="postcss">
  .card {
    @apply bg-white/60 rounded-3xl p-6 shadow-xl shadow-black/5;
  }
</style>
