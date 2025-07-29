<template>
  <div class="heart-toggle">
    <IconFullHeart
      v-if="heartActive"
      class="heart-icon"
      @click="toggleHeart" />
    <IconEmptyHeart
      v-else
      class="heart-icon"
      @click="toggleHeart" />

    <!-- 토스트 메시지 -->
    <ToastMessage
      ref="toastRef"
      :message="toastMessage"
      :type="toastType"
      :duration="3000" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import IconEmptyHeart from '@/components/icons/IconEmptyHeart.vue';
import IconFullHeart from '@/components/icons/IconFullHeart.vue';
import ToastMessage from '@/components/common/ToastMessage.vue';

const props = defineProps({
  initialActive: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle']);

const heartActive = ref(props.initialActive);
const toastRef = ref(null);
const toastMessage = ref('');
const toastType = ref('success');

const toggleHeart = () => {
  heartActive.value = !heartActive.value;

  // 토스트 메시지 설정
  if (heartActive.value) {
    toastMessage.value = '관심 상품으로 추가되었습니다.';
    toastType.value = 'success'; // 초록색
  } else {
    toastMessage.value = '관심 상품에서 제거되었습니다.';
    toastType.value = 'remove'; // 회색
  }

  // 토스트 메시지 표시
  if (toastRef.value) {
    toastRef.value.show();
  }

  // 부모 컴포넌트에 상태 변경 알림
  emit('toggle', heartActive.value);
};

// 외부에서 상태를 변경할 수 있도록 expose
defineExpose({
  toggleHeart,
  heartActive
});
</script>

<style scoped>
.heart-toggle {
  position: relative;
}

.heart-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  user-select: none;
  display: inline-block;
}
</style>
