<template>
  <div class="container">
    <h1>Danh Sách Độc Giả</h1>

    <!-- Ô tìm kiếm -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm theo tên độc giả..."
      />
    </div>

    <!-- Nút Thêm Độc Giả -->
    <button v-if="!showForm" @click="toggleForm" class="add-reader-btn">Thêm Độc Giả</button>

    <!-- Form Thêm/Cập Nhật Độc Giả -->
    <form v-if="showForm" @submit.prevent="isEditMode ? handleUpdateReader() : handleAddReader()">
      <div>
        <label for="maDocGia">Mã Độc Giả:</label>
        <input v-model="newReader.MaDocGia" id="maDocGia" required />
      </div>
      <div>
        <label for="hoLot">Họ Lót:</label>
        <input v-model="newReader.HoLot" id="hoLot" required />
      </div>
      <div>
        <label for="ten">Tên:</label>
        <input v-model="newReader.Ten" id="ten" required />
      </div>
      <div>
        <label for="ngaySinh">Ngày Sinh:</label>
        <input v-model="newReader.NgaySinh" id="ngaySinh" type="date" required />
      </div>
      <div>
        <label for="phai">Phái:</label>
        <input v-model="newReader.Phai" id="phai" required />
      </div>
      <div>
        <label for="diaChi">Địa Chỉ:</label>
        <input v-model="newReader.DiaChi" id="diaChi" required />
      </div>
      <div>
        <label for="dienThoai">Điện Thoại:</label>
        <input v-model="newReader.DienThoai" id="dienThoai" type="tel" required />
      </div>
      <div class="buttons">
        <button type="submit">{{ isEditMode ? 'Cập Nhật Độc Giả' : 'Lưu Độc Giả' }}</button>
        <button type="button" @click="cancelEdit">Hủy</button>
      </div>
    </form>

    <!-- Bảng Hiển Thị Danh Sách Độc Giả -->
    <table>
      <thead>
        <tr>
          <th>Mã Độc Giả</th>
          <th>Họ Lót</th>
          <th>Tên</th>
          <th>Ngày Sinh</th>
          <th>Phái</th>
          <th>Địa Chỉ</th>
          <th>Điện Thoại</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="docgia in filteredDocGias" :key="docgia._id">
          <td>{{ docgia.MaDocGia }}</td>
          <td>{{ docgia.HoLot }}</td>
          <td>{{ docgia.Ten }}</td>
          <td>{{ docgia.NgaySinh }}</td>
          <td>{{ docgia.Phai }}</td>
          <td>{{ docgia.DiaChi }}</td>
          <td>{{ docgia.DienThoai }}</td>
          <td>
            <button class="edit-btn" @click="prepareEditReader(docgia)">Chỉnh Sửa</button>
            <button class="delete-btn" @click="handleDeleteReader(docgia._id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { fetchDocGias, addDocGia, updateDocGia, deleteDocGia } from '../services/api';
import Header from './Header.vue';

export default {
  components: {
    Header
  },
  setup() {
    const docgias = ref([]);
    const message = ref('');
    const isEditMode = ref(false);
    const editReaderId = ref(null);
    const searchQuery = ref('');
    const showForm = ref(false);

    const newReader = ref({
      MaDocGia: '',
      HoLot: '',
      Ten: '',
      NgaySinh: '',
      Phai: '',
      DiaChi: '',
      DienThoai: ''
    });

    const getDocGias = async () => {
      try {
        const response = await fetchDocGias();
        docgias.value = response.data;
      } catch (error) {
        console.error('Error fetching readers:', error);
        message.value = 'Không thể tải dữ liệu độc giả.';
      }
    };

    const filteredDocGias = computed(() => {
      if (!searchQuery.value) return docgias.value;
      return docgias.value.filter((docgia) =>
        docgia.Ten.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const handleAddReader = async () => {
      try {
        await addDocGia(newReader.value);
        message.value = 'Thêm độc giả thành công!';
        getDocGias();
        resetForm();
      } catch (error) {
        console.error('Error adding reader:', error);
        message.value = 'Có lỗi xảy ra khi thêm độc giả.';
      }
    };

    const prepareEditReader = (docgia) => {
      newReader.value = { ...docgia };
      editReaderId.value = docgia._id;
      isEditMode.value = true;
      showForm.value = true;
    };

    const handleUpdateReader = async () => {
      try {
        await updateDocGia(editReaderId.value, newReader.value);
        message.value = 'Cập nhật độc giả thành công!';
        getDocGias();
        resetForm();
      } catch (error) {
        console.error('Error updating reader:', error);
        message.value = 'Có lỗi xảy ra khi cập nhật độc giả.';
      }
    };

    const handleDeleteReader = async (id) => {
      try {
        await deleteDocGia(id);
        message.value = 'Xóa độc giả thành công!';
        getDocGias();
      } catch (error) {
        console.error('Error deleting reader:', error);
        message.value = 'Có lỗi xảy ra khi xóa độc giả.';
      }
    };

    const cancelEdit = () => {
      resetForm();
    };

    const resetForm = () => {
      newReader.value = {
        MaDocGia: '',
        HoLot: '',
        Ten: '',
        NgaySinh: '',
        Phai: '',
        DiaChi: '',
        DienThoai: ''
      };
      editReaderId.value = null;
      isEditMode.value = false;
      showForm.value = false;
    };

    const toggleForm = () => {
      showForm.value = !showForm.value;
    };

    onMounted(() => {
      getDocGias();
    });

    return {
      docgias,
      newReader,
      message,
      isEditMode,
      searchQuery,
      filteredDocGias,
      showForm,
      handleAddReader,
      prepareEditReader,
      handleUpdateReader,
      handleDeleteReader,
      cancelEdit,
      toggleForm
    };
  }
};
</script>


<style scoped>
  /* Tổng thể */
  .container {
    max-width: 1500px;
    margin: 0 auto; /* Căn giữa */
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    background-color: #7fbefe;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  /* Tiêu đề */
  h1 {
    text-align: center;
    color: #007bff;
    margin-bottom: 20px;
  }

  /* Ô tìm kiếm */
  .search-bar {
    margin-bottom: 20px; /* Khoảng cách dưới ô tìm kiếm */
    text-align: center; /* Căn giữa */
  }

  .search-bar input {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ced4da;
    width: 300px; /* Chiều rộng của ô tìm kiếm */
    box-sizing: border-box; /* Bao gồm padding và border trong chiều rộng */
    transition: border-color 0.3s;
  }

  .search-bar input:focus {
    border-color: #007bff;
    outline: none;
  }

  /* Form thêm/cập nhật sách */
  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  /* Nhóm trường nhập */
  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    font-weight: bold;
    color: #555;
  }

  input[type="text"],
  input[type="number"] {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ced4da;
    width: 100%; /* Đảm bảo input chiếm toàn bộ chiều rộng */
    box-sizing: border-box; /* Bao gồm padding và border trong chiều rộng */
    transition: border-color 0.3s;
  }

  input[type="text"]:focus,
  input[type="number"]:focus {
    border-color: #007bff;
    outline: none;
  }

  /* Nút gửi và hủy */
  .buttons {
    display: flex;
    justify-content: space-between;
  }

  button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
  }

  button[type="submit"] {
    background-color: #007bff;
    color: white;
  }

  button[type="button"] {
    background-color: #e0e0e0;
    color: #333;
  }

  button:hover {
    background-color: #0056b3;
  }

  button[type="button"]:hover {
    background-color: #c0c0c0;
  }

  /* Bảng hiển thị sách */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 30px;
  }

  th,
  td {
    padding: 12px;
    border: 1px solid #dee2e6;
    text-align: left;
  }

  th {
    background-color: #007bff;
    color: white;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  .add-reader-btn {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.add-reader-btn:hover {
  background-color: #218838;
}

  .edit-btn,
  .delete-btn {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }

  .edit-btn {
    background-color: #f39c12;
    color: white;
  }

  .delete-btn {
    background-color: #dc3545;
    color: white;
  }

  .edit-btn:hover {
    background-color: #e67e22;
  }

  .delete-btn:hover {
    background-color: #c82333;
  }

  /* Thông báo */
  .message {
    color: green;
    margin-top: 20px;
    font-weight: bold;
    text-align: center;
  }
  </style>

