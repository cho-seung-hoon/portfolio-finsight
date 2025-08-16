<template>
  <div class="heart-toggle" @click="toggleHeart">
    <IconFullHeart v-if="isLiked" class="heart-icon filled" />
    <IconEmptyHeart v-else class="heart-icon stroke" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import IconFullHeart from '@/components/icons/IconFullHeart.vue';
import IconEmptyHeart from '@/components/icons/IconEmptyHeart.vue';
import { useToastStore } from '@/stores/toast';
import { addToWatch, removeFromWatch } from '@/api/watchApi';

const props = defineProps({
  productCode: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    validator: (value) => ['deposit', 'fund', 'etf'].includes(value)
  },
  userWatches: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle']);
const toastStore = useToastStore();

// 내부 상태로 관리
const isLiked = ref(props.userWatches);

// userWatches가 변경되면 내부 상태도 업데이트 (즉시 실행)
watch(() => props.userWatches, (newValue) => {
  isLiked.value = newValue;
}, { immediate: true });

async function toggleHeart() {
  try {
    if (isLiked.value) {
      // 찜하기 해제
      await removeFromWatch(props.category, props.productCode);
      isLiked.value = false;
      toastStore.remove('관심 상품에서 제거되었습니다.');
    } else {
      // 찜하기 추가
      const watchData = {
        productCode: props.productCode,
        productCategory: props.category
      };
      
      await addToWatch(watchData);
      isLiked.value = true;
      toastStore.success('관심 상품으로 추가되었습니다.');
    }
    
    // 부모에게 상태 변경 알림
    emit('toggle', { 
      productCode: props.productCode, 
      category: props.category, 
      liked: isLiked.value 
    });
  } catch (error) {
    // 에러 발생 시 원래 상태로 되돌리기
    isLiked.value = !isLiked.value;
    
    // 에러 토스트 표시
    if (error.response?.status === 401) {
      toastStore.error('로그인이 필요합니다.');
    } else if (error.response?.status === 400) {
      const errorMessage = error.response.data?.message || '잘못된 요청입니다.';
      toastStore.error(errorMessage);
    } else {
      toastStore.error('처리 중 오류가 발생했습니다.');
    }
  }
}
</script>

<style scoped>
.heart-toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.heart-toggle:hover {
  transform: scale(1.1);
}

.heart-toggle:active {
  transform: scale(0.95);
}

.heart-icon {
  width: 24px;
  height: 24px;
  transition: all 0.2s ease;
}

.heart-icon.filled {
  color: var(--text-red);
}

.heart-icon.stroke {
  color: var(--text-red);
}

.heart-icon.filled:hover {
  transform: scale(1.1);
}

.heart-icon.stroke:hover {
  transform: scale(1.1);
}
</style>
