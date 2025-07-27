<template>
  <div class="holdings-summary-deposit">
    <div class="summary-card">
      <div class="summary-info">
        <div class="info-row">
          <span class="label">예금 체결일</span>
          <span class="value">{{ data.contractDate }}</span>
        </div>
        <div class="info-row">
          <span class="label">예금 만료일</span>
          <span class="value">{{ data.maturityDate }}</span>
        </div>
        <div class="info-row">
          <span class="label">예금액</span>
          <span class="value current-value"
            >{{ data.holdingsTotalPrice?.toLocaleString() || 0 }}원</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
    validator: value => {
      return (
        value.contractDate !== undefined &&
        value.maturityDate !== undefined &&
        value.holdingsTotalPrice !== undefined
      );
    }
  }
});
</script>

<style scoped>
.holdings-summary-deposit {
  margin-bottom: 20px;
}

.summary-card {
  background-color: var(--white);
  border: 1px solid var(--main03);
  border-radius: 8px;
  padding: 20px;
}

.summary-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 24px;
}

.label {
  color: var(--main02);
  font-size: 16px;
  font-weight: 400;
}

.value {
  color: var(--black);
  font-size: 16px;
  font-weight: 500;
  text-align: right;
}

.current-value {
  color: var(--sub01);
  font-weight: 700;
}
</style>
