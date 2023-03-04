<script lang="ts">
  import { afterUpdate, onDestroy } from 'svelte'
  import * as FilePond from 'filepond'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  import * as LottiePlayer from '@lottiefiles/lottie-player'

  let root: HTMLInputElement
  let instance: FilePond.FilePond

  afterUpdate(() => {
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
            return data.secure_url
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
      imagePreviewHeight: 304,
      acceptedFileTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp'],
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
</script>

<lottie-player autoplay loop src="bg.json" speed=".3" intermission="0" class="left-0 right-0 ml-auto mr-auto absolute w-2/3 2xl:w-1/2 -z-10 opacity-50"></lottie-player>
<div class="min-h-screen flex flex-col">
  <main class="max-w-[400px] mx-auto w-full flex-grow flex items-center">
    <div class="card w-full space-y-8">
      <div class="space-y-3">
        <h1 class="text-center text-5xl font-bold">Stickerland</h1>
        <p class="description">
          Crea y comparte tus propios<br />
          stickers para WhatsApp
        </p>
      </div>
      <div class="filepond--wrapper">
        <input bind:this={root} type="file" name="file" />
      </div>
      <button on:click={() => instance.processFile()} class="w-full">
        Generate
      </button>
    </div>
  </main>
</div>

<style lang="postcss">
  .card {
    @apply bg-white/60 rounded-3xl p-8 shadow-xl shadow-black/5;
  }
  button {
    @apply rounded-2xl px-5 backdrop-blur-md text-white text-xl font-bold;
    @apply transition-colors duration-200;
  }
  button {
    @apply py-3 flex items-center justify-center;
    @apply bg-[#DB91DC] hover:bg-[#E09FE0] active:bg-[#D98ED9];
    @apply disabled:cursor-not-allowed disabled:bg-[#DB91DC]/50;
  }
  .description {
    @apply font-medium text-center text-xl opacity-80 max-w-lg;
  }
</style>
