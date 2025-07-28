import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePortfolioStore = defineStore('portfolio', () => {
  // State
  const userName = ref('다음');
  const userType = ref('aggressive'); // 'stable', 'stableplus', 'neutral', 'aggressive', 'veryaggressive'

  // 사용자 자산 비중 데이터
  const userAllocationData = [
    { id: 1, userAllocation: 15 },
    { id: 2, userAllocation: 5 },
    { id: 3, userAllocation: 8 },
    { id: 4, userAllocation: 20 },
    { id: 5, userAllocation: 2 },
    { id: 6, userAllocation: 8 },
    { id: 7, userAllocation: 25 },
    { id: 8, userAllocation: 12 },
    { id: 9, userAllocation: 5 }
  ];

  // Getters
  const getUserAllocationData = computed(() => {
    return userAllocationData;
  });

  // Actions
  const setUserName = name => {
    userName.value = name;
  };

  const setUserType = type => {
    userType.value = type;
  };

  const updateUserAllocation = (productId, allocation) => {
    const product = userAllocationData.find(item => item.id === productId);
    if (product) {
      product.userAllocation = allocation;
    }
  };

  return {
    // State
    userName,
    userType,

    // Getters
    getUserAllocationData,

    // Actions
    setUserName,
    setUserType,
    updateUserAllocation
  };
});
