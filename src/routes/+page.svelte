<script lang="ts">
  import { afterUpdate, onDestroy } from 'svelte'
  import * as FilePond from 'filepond'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  import { fade, slide } from 'svelte/transition'

  let root: HTMLInputElement
  let instance: FilePond.FilePond
  let publicId: string | undefined
  let status: 'idle' | 'loading' | 'success' | 'error' = 'idle'

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
            publicId = data.public_id.replace('stickerland/', '')
            setTimeout(() => {
              status = 'success'
            }, 1000)
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
      labelIdle: 'Arrastrar y soltar<br>imagen o <span class="filepond--label-action">explorar</span>',
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

<div transition:slide class="space-y-8">
  {#if !publicId}
    <div class="filepond--wrapper relative">
      <input bind:this={root} type="file" name="file" />
    </div>
  {:else}
    <div class="filepond--wrapper relative">
      {#if status !== 'success'}
        <lottie-player autoplay src="check.json" out:fade={{ duration: 300 }} class="absolute left-0 top-0"></lottie-player>
      {:else}
        <lottie-player in:fade={{ duration: 300 }} autoplay loop src="stars.json" speed=".7" intermission="0" class="absolute left-[-18%] w-[140%] top-0"></lottie-player>
        <img in:fade={{ duration: 300 }} src={`https://res.cloudinary.com/jhormanrus/image/upload/v1677801678/stickerland/${publicId}`} alt="sticker" />
      {/if}
    </div>
  {/if}
  <div class="flex flex-col items-center gap-2">
    {#if !publicId}
      <button on:click={handleFileUpload} class="w-full">
        Generar
      </button>
    {:else}
      <a href="https://wa.me/51935858346?text=sticker-ID%20{publicId}" target="_blank" rel="noopener noreferrer" class="button w-full">
        Compartir
      </a>
    {/if}
    <a href="/galery">o ver galería de stickers</a>
  </div>
</div>

<style lang="postcss">
  button, .button {
    @apply rounded-2xl px-5 backdrop-blur-md text-white text-xl font-bold;
    @apply transition-colors duration-200;
  }
  button, .button {
    @apply py-3 flex items-center justify-center;
    @apply bg-[#df8c9a] hover:bg-[#df8c9a]/90 active:bg-[#df8c9a]/80;
    @apply disabled:cursor-not-allowed disabled:bg-[#df8c9a]/50;
  }
</style>
