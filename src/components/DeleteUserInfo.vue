<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal">
            <p class="message">정말 탈퇴하시겠습니까? <br>탈퇴 후 복구가 불가능합니다.</p>
            <div class="actions">
                <button class="cancel-btn" @click="$emit('close')">취소</button>
                <button class="confirm-btn" @click="$emit('confirm')">탈퇴</button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineEmits(['close', 'confirm']);
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal {
    background-color: white;
    padding: 24px;
    border-radius: 10px;
    width: 300px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    text-align: center;
}
.message {
    font-size: 15px;
    margin-bottom: 20px;
}
.actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

/* btn Section Style */
.cancel-btn, .confirm-btn {
    flex: 1;
    padding: 10px 0;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
}
.cancel-btn {
    background-color: var(--main03);
    color: var(--main01);
}
.confirm-btn {
    background-color: var(--main01);
    color: var(--main05);
}
</style>
