<template>
  <header class="header">
    <h1>Quản Lý Sách</h1>
    <div class="user-info">
      <span v-if="username">Xin chào, {{ username }}!</span>
      <button class="logout-btn" @click="handleLogout">Đăng Xuất</button>
    </div>
  </header>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const username = ref('');
    const isLoggedIn = ref(false);

    // Check if user is logged in and retrieve their info
    onMounted(() => {
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      if (user) {
        username.value = `${user.HoLot} ${user.Ten}`;
        isLoggedIn.value = true;
      }
    });

    const handleLogout = () => {
      localStorage.removeItem('loggedInUser'); // Remove user data
      router.push('/'); // Redirect to login page
    };

    return {
      username,
      isLoggedIn,
      handleLogout,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
}

.header h1 {
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
}

.logout-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #dc3545;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  margin-left: 15px; /* Add space between username and button */
}

.logout-btn:hover {
  background-color: #c82333;
}
</style>
