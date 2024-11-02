<template>
  <div>
    <h1>Cho Mượn Sách</h1>

    <form @submit.prevent="handleBorrow">
      <div>
        <label for="docGia">Độc Giả:</label>
        <input
          type="text"
          :value="selectedDocGia ? selectedDocGia.HoLot + ' ' + selectedDocGia.Ten : 'Chưa có độc giả'"
          disabled
        />
      </div>

      <div class="form-group">
        <label for="selectedBookName">Tên Sách:</label>
        <input type="text" :value="selectedBook?.TenSach || ''" id="selectedBookName" disabled />
      </div>

      <p>Số lượng hiện có: {{ selectedBook.SoQuyen }}</p>

      <div>
        <label for="ngayMuon">Ngày Mượn:</label>
        <input type="date" v-model="ngayMuon" id="ngayMuon" required />
      </div>

      <div>
        <label for="ngayTra">Ngày Trả:</label>
        <input type="date" v-model="ngayTra" id="ngayTra" required />
      </div>

      <button type="submit" class="borrow-btn">Mượn Sách</button>
      <button type="button" @click="closeForm" class="close-btn">Đóng Form</button>
    </form>

    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { fetchDocGias, borrowSach, updateSach } from '../services/api';

export default {
  props: {
    selectedBook: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const docGias = ref([]);
    const selectedDocGia = ref(JSON.parse(localStorage.getItem('loggedInUser'))); // Get logged-in user's info
    const ngayMuon = ref('');
    const ngayTra = ref('');
    const message = ref('');

    // Fetch list of readers
    const getDocGias = async () => {
      try {
        const { data } = await fetchDocGias();
        docGias.value = data; // Store the readers' data
      } catch (error) {
        handleError("Không thể tải danh sách độc giả.", error);
      }
    };

    // Find MaDocGia based on logged-in user's name
    const findMaDocGia = () => {
      if (!selectedDocGia.value) return null;

      const fullName = `${selectedDocGia.value.HoLot} ${selectedDocGia.value.Ten}`.trim();
      const matchedReader = docGias.value.find(docGia => 
        `${docGia.HoLot} ${docGia.Ten}`.trim() === fullName
      );
      return matchedReader ? matchedReader.MaDocGia : null;
    };

    // Handle borrowing book
    const handleBorrow = async () => {
      if (!validateForm()) return;

      const MaDocGia = findMaDocGia(); // Get the reader's ID from the list

      const borrowData = {
        MaDocGia: MaDocGia,
        MaSach: props.selectedBook.MaSach,
        NgayMuon: ngayMuon.value,
        NgayTra: ngayTra.value,
      };

      try {
        await borrowSach(borrowData);

        // Update the book quantity
        const updatedData = { SoQuyen: props.selectedBook.SoQuyen - 1 };
        await updateSach(props.selectedBook._id, updatedData);

        message.value = 'Mượn sách thành công!';
        resetForm();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Error during borrowing or updating:", error.response ? error.response.data : error);
        message.value = 'Có lỗi xảy ra, vui lòng thử lại.';
      }
    };

    // Form validation
    const validateForm = () => {
      if (!selectedDocGia.value) {
        message.value = 'Vui lòng đăng nhập trước khi mượn sách.';
        return false;
      }
      if (props.selectedBook.SoQuyen <= 0) {
        message.value = 'Số lượng sách hiện tại là 0. Không thể mượn sách!';
        return false;
      }
      if (!ngayMuon.value || !ngayTra.value) {
        message.value = 'Vui lòng chọn ngày mượn và ngày trả.';
        return false;
      }
      return true;
    };

    // Handle error logging and display
    const handleError = (userMessage, error) => {
      console.error(error);
      message.value = userMessage;
    };

    // Reset form fields
    const resetForm = () => {
      ngayMuon.value = '';
      ngayTra.value = '';
    };

    // Emit close event
    const closeForm = () => {
      emit('close');
    };

    onMounted(getDocGias);

    return {
      docGias,
      selectedDocGia,
      ngayMuon,
      ngayTra,
      message,
      handleBorrow,
      closeForm,
    };
  },
};
</script>

<style scoped>
.message {
  color: green;
  margin-top: 10px;
}

.borrow-btn {
  margin-left: 10px;
  background-color: #02cf6c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.borrow-btn:hover {
  background-color: #023f22;
}

.close-btn {
  margin-left: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #c82333;
}
</style>
