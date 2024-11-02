<template>
  <Header />
  <div class="admin-container">
    <div class="toggle-buttons">
      <button @click="currentComponent = 'Sach'" :class="{ active: currentComponent === 'Sach' }">Sách</button>
      <button @click="currentComponent = 'DocGia'" :class="{ active: currentComponent === 'DocGia' }">Độc Giả</button>
      <button @click="currentComponent = 'ThongKeMuonSach'" :class="{ active: currentComponent === 'ThongKeMuonSach' }">Thống Kê Mượn Sách</button>
    </div>
    <component :is="currentComponent" />
  </div>
</template>

<script>
import Sach from '../components/Sach.vue';
import DocGia from '../components/DocGia.vue';
import ThongKeMuonSach from '../components/ThongKeMuonSach.vue';
import Header from '@/components/Header.vue';

export default {
  components: {
    Sach,
    DocGia,
    ThongKeMuonSach, // Import the ThongKeMuonSach component
    Header
  },
  data() {
    return {
      currentComponent: 'Sach', // Default component to display
    };
  },
};
</script>

<style scoped>
.admin-container {
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.toggle-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button.active {
  background-color: #007bff;
  color: white;
}

button:not(.active) {
  background-color: #e0e0e0;
}
</style>
