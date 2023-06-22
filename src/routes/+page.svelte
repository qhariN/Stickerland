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
      labelIdle: 'Arrastrar y soltar<br>imagen o <strong style="font-weight: 600">explorar</strong>',
      labelMaxFileSize: 'Tamaño máximo del archivo es {filesize}',
      labelFileProcessing: 'Subiendo',
      labelFileTypeNotAllowed: 'Imagen no permitida',
      labelMaxFileSizeExceeded: 'El archivo es muy grande',
      fileValidateTypeLabelExpectedTypes: 'Solo se permiten .png, .jpeg, .gif, .svg, .webp'
    })
  })

  onDestroy(() => {
    if (!instance) return
    instance.destroy()
  })

  const handleFileUpload = () => {
    if (instance.getFile()) {
      instance.processFile()
    } else {
      instance.browse()
    }
  }

  const reset = () => {
    publicId = undefined
    status = 'idle'
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
        <lottie-player in:fade={{ duration: 300 }} autoplay loop src="stars.json" speed=".7" intermission="0" class="absolute left-[-18%] w-[140%] top-0 pointer-events-none z-10"></lottie-player>
        <div in:fade={{ duration: 300 }} class="rounded-2xl bg-white/50 p-6 transition-transform hover:scale-105 hover:rotate-3 shadow-sm">
          <img src={`https://res.cloudinary.com/jhormanrus/image/upload/v1677801678/stickerland/${publicId}`} alt="sticker" class="rounded-xl" />
        </div>
      {/if}
    </div>
  {/if}
  <div class="flex flex-col items-center gap-2">
    {#if !publicId}
      <button on:click={handleFileUpload} class="button w-full">
        Generar
      </button>
      <a href="/gallery">o ver <span class="font-semibold">galería de stickers</span></a>
    {:else}
      <a href="https://wa.me/51935858346?text=sticker-ID%20{publicId}" target="_blank" rel="noopener noreferrer" class="button w-full">
        Obtener sticker
      </a>
      <button on:click={() => reset()}>o volver a <span class="font-semibold">generar otro sticker</span></button>
    {/if}
  </div>
</div>
