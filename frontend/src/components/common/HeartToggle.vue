<template>
  <div
    class="heart-toggle"
    @click="toggleHeart">
    <IconFullHeart
      v-if="isLiked"
      class="heart-icon filled" />
    <IconEmptyHeart
      v-else
      :class="['heart-icon', 'stroke', iconColor === 'white' ? 'white' : '']" />
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
    validator: value => ['deposit', 'fund', 'etf'].includes(value)
  },
  userWatches: {
    type: Boolean,
    default: false
  },
  iconColor: {
    type: String,
    default: 'default'
  }
});

const emit = defineEmits(['toggle']);
const toastStore = useToastStore();

const isLiked = ref(props.userWatches);

watch(
  () => props.userWatches,
  newValue => {
    isLiked.value = newValue;
  },
  { immediate: true }
);

async function toggleHeart() {
  try {
    if (isLiked.value) {
      await removeFromWatch(props.category, props.productCode);
      isLiked.value = false;
      toastStore.remove('관심 상품에서 제거되었습니다.');
    } else {
      const watchData = {
        productCode: props.productCode,
        productCategory: props.category
      };

      await addToWatch(watchData);
      isLiked.value = true;
      toastStore.success('관심 상품으로 추가되었습니다.');
    }

    emit('toggle', {
      productCode: props.productCode,
      category: props.category,
      liked: isLiked.value
    });
  } catch (error) {
    isLiked.value = !isLiked.value;

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
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.heart-icon.filled {
  /*  background-color: var(--text-red);
  color:var(--main01);*/
  color: var(--sub01);
}

.heart-icon.stroke {
  color: var(--main01);
}

.heart-icon.stroke.white {
  color: var(--white);
}

.heart-icon.filled:hover,
.heart-icon.stroke:hover {
  transform: scale(1.1);
}
</style>
