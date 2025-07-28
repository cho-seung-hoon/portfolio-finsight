<template>
  <div
    class="modal-overlay"
    @click="$emit('close')">
    <div
      class="modal-container term-detail-modal"
      @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">{{ term.title }}</h3>
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="$emit('close')"></button>
      </div>
      <div class="modal-content">
        <div class="term-content">
          {{ term.content }}
        </div>
      </div>
      <div class="modal-footer">
        <button
          class="confirm-button"
          @click="$emit('close')">
          확인
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
const term = defineProps({
    
})
</script>