<script lang="ts">
  import { afterUpdate, onDestroy } from 'svelte'
  import * as FilePond from 'filepond'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

  let root: HTMLInputElement
  let instance: FilePond.FilePond
  let publicId: string | undefined

  afterUpdate(async () => {
    await import('@lottiefiles/lottie-player')
    FilePond.registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType)
    instance = FilePond.create(root, {
      server: {
        url: 'https://api.cloudinary.com/v1_1/jhormanrus/image',
        process: {
          url: '/upload',
          ondata: (formData) => {
            formData.append('upload_preset', 'stickerland')
            formData.append('api_key', '525874491378754')
            formData.append('folder', 'stickerland')
            formData.append('background-removal', 'cloudinary_ai')
            return formData
          },
          onload: (response) => {
            const data = JSON.parse(response)
            publicId = data.public_id.replace('stickerland/', '')
            return data.public_id
          }
        }
      },
      credits: false,
      maxFiles: 1,
      required: true,
      allowRevert: false,
      instantUpload: false,
      allowProcess: false,
      maxFileSize: '10MB',
      imagePreviewHeight: 280,
      acceptedFileTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      labelIdle: 'Arrastra y suelta tu imagen o <br><span class="filepond--label-action"> Busca en tu computadora </span>',
      labelMaxFileSizeExceeded: 'El archivo es muy grande',
      labelMaxFileSize: 'Tamaño máximo del archivo es {filesize}',
      labelFileTypeNotAllowed: 'Imagen no permitida',
      fileValidateTypeLabelExpectedTypes: 'Solo se permiten .png, .jpeg, .gif, .svg, .webp'
    })
  })

  onDestroy(() => {
    if (!instance) return
    instance.destroy()
  })

  const handleFileUpload = () => {
    instance.processFile()
  }
</script>

<div class="min-h-screen flex flex-col relative overflow-hidden">
  <lottie-player autoplay loop src="bg.json" speed=".3" intermission="0" class="right-24 sm:left-0 sm:right-0 top-0 bottom-0 ml-auto mr-auto mt-0 mb-0 absolute w-[200%] sm:w-full lg:w-11/12 2xl:w-1/2 -z-10 opacity-50"></lottie-player>
  <main class="max-w-[440px] mx-auto w-full flex-grow flex items-center p-2 sm:p-8">
    <div class="card w-full space-y-8">
      <div class="space-y-3">
        <h1 class="text-center text-5xl font-bold">Stickerland</h1>
        <p class="description">
          Crea y comparte tus propios stickers para WhatsApp
        </p>
      </div>
      <div class="filepond--wrapper">
        <input bind:this={root} type="file" name="file" />
      </div>
      <div class="flex flex-col items-center gap-2">
        {#if !publicId}
          <button on:click={handleFileUpload} class="w-full">
            Generar
          </button>
        {:else}
          <a href="https://wa.me/51935858346?text=sticker-ID%20{publicId}" target="_blank" rel="noopener noreferrer">
            Compartir
          </a>
        {/if}
        <p>
          o ver galería de stickers
        </p>
      </div>
    </div>
  </main>
</div>

<style lang="postcss">
  .card {
    @apply bg-white/60 rounded-3xl px-8 py-10 shadow-xl shadow-black/5;
  }
  button, a {
    @apply rounded-2xl px-5 backdrop-blur-md text-white text-xl font-bold;
    @apply transition-colors duration-200;
  }
  button, a {
    @apply py-3 flex items-center justify-center;
    @apply bg-[#DB91DC] hover:bg-[#E09FE0] active:bg-[#D98ED9];
    @apply disabled:cursor-not-allowed disabled:bg-[#DB91DC]/50;
  }
  .description {
    @apply font-medium text-center text-xl opacity-80 max-w-lg;
  }
</style>
