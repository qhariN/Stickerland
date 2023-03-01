<script lang="ts">
  import { onMount } from 'svelte'
  import * as FilePond from 'filepond'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata'

  onMount(() => {
    const inputElement = document.querySelector('input[type="file"]')
    FilePond.registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType, FilePondPluginFileMetadata)
    const pond = FilePond.create(inputElement as Element, {
      server: 'https://api.cloudinary.com/v1_1/jhormanrus/image/upload',
      credits: false,
      maxFiles: 1,
      required: true,
      allowRevert: false,
      instantUpload: false,
      maxFileSize: '10MB',
      acceptedFileTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp'],
      fileMetadataObject: {
        hello: 'world'
      },
      labelIdle: 'Arrastra y suelta tu imagen o <span class="filepond--label-action"> Busca en tu computadora </span>',
      labelMaxFileSizeExceeded: 'El archivo es muy grande',
      labelMaxFileSize: 'Tamaño máximo del archivo es {filesize}',
      labelFileTypeNotAllowed: 'Imagen no permitida',
      fileValidateTypeLabelExpectedTypes: 'Solo se permiten .png, .jpeg, .gif, .svg, .webp'
    })
  })
</script>

<div class="min-h-screen flex flex-col">
  <main class="max-w-screen-sm mx-auto w-full flex-grow flex items-center">
    <div class="card w-full">
      <h1 class="text-center text-5xl font-bold">Stickerland</h1>
      <input type="file" />
    </div>
  </main>
</div>

<style lang="postcss">
  .card {
    @apply bg-white/60 rounded-3xl p-6 shadow-xl shadow-black/5;
  }
</style>
