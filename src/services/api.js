import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Ensure the correct API base URL

// Fetch all readers
export const fetchDocGias = async () => {
  return await axios.get(`${API_URL}/docgia`);
};

// Add a new reader
export const addDocGia = async (newDocGia) => {
  return await axios.post(`${API_URL}/docgia`, newDocGia);
};

// Update reader information
export const updateDocGia = async (id, updatedDocGia) => {
  return await axios.put(`${API_URL}/docgia/${id}`, updatedDocGia);
};

// Delete a reader
export const deleteDocGia = async (id) => {
  return await axios.delete(`${API_URL}/docgia/${id}`);
};

// Fetch all books
export const fetchSaches = async () => {
  return await axios.get(`${API_URL}/sach`);
};

// Add a new book
export const addSach = async (newBook) => {
  return await axios.post(`${API_URL}/sach`, newBook);
};

// Delete a book
export const deleteSach = async (id) => {
  return await axios.delete(`${API_URL}/sach/${id}`);
};

// Update book information
export const updateSach = async (id, newBook) => {
  return await axios.put(`${API_URL}/sach/${id}`, newBook);
};

// Borrow a book
export const borrowSach = async (borrowData) => {
  return await axios.post(`${API_URL}/muonsach`, borrowData);
};

// Fetch borrowed books for a specific reader
export const fetchBorrowedBooksByReader = async (MaDocGia) => {
  try {
    const response = await axios.get(`${API_URL}/muonsach/${MaDocGia}`);
    return response; // Return response containing data
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    throw error; // Propagate the error for handling in the component
  }
};

// Fetch all borrowed books (for admin)
export const fetchAllBorrowedBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/muonsach`); // Adjust the endpoint accordingly
    return response; // Return the data
  } catch (error) {
    console.error("Error fetching all borrowed books:", error);
    throw error; // Rethrow error for handling
  }
};
