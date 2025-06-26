import axios from 'axios';
import { API_URL } from '../lib/config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface UserData {
  school_id: string;
  fname: string;
  lname: string;
  mname: string;
  suffix: string;
  extension: string;
  password?: string;
}

export interface BookData {
  title: string;
  destiny_url: string;
  bib_id: string;
  book_img?: string | File;
  id?: number;
  img_id?: number;
  author?: string;
}

export interface EventData {
  title: string;
  descrip: string;
  link: string;
  event_image?: string | File;
  id?: number;
  img_id?: number;
}

export interface PersonData {
  fname: string;
  lname: string;
  mname: string;
  suffix: string;
  caption: string;
  month: string;
  course: number;
  id?: number;
  img_id?: number;
}

export interface ServiceData {
  service_name: string;
  service_desc: string;
  service_img?: string | File;
  id?: number;
}
interface LibraryType {
  library_id: number
  library_name: string
  library_description: string
  sections?: Section[]
}

interface Section {
  section_id: number
  section_name: string
  section_description: string
  section_image: string | null
}
// Auth endpoints
export const authAPI = {
  signup: (data: UserData) => api.post('user.php', { operation: 'signup', json: data }),
  signin: (data: Pick<UserData, 'school_id' | 'password'>) => api.post('user.php', { operation: 'signin', json: data }),
};

// Books endpoints
export const booksAPI = {
  getBooks: () => api.get('book.php', { params: { operation: 'getBooks' } }),
  addBook: async (data: BookData) => {
    const formData = new FormData()
    formData.append('operation', 'addBook')

    // Convert image to base64 if it exists
    if (data.book_img instanceof File) {
      const reader = new FileReader()
      reader.readAsDataURL(data.book_img)
      await new Promise((resolve) => {
        reader.onload = () => {
          const base64Image = reader.result as string
          const base64Data = base64Image.split(',')[1]
          formData.append('json', JSON.stringify({
            ...data,
            book_img: base64Data
          }))
          resolve(null)
        }
      })
    } else {
      formData.append('json', JSON.stringify(data))
    }

    return api.post('book.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  updateBook: async (data: BookData) => {
    const formData = new FormData()
    formData.append('operation', 'updateBook')

    // Convert image to base64 if it exists
    if (data.book_img instanceof File) {
      const reader = new FileReader()
      reader.readAsDataURL(data.book_img)
      await new Promise((resolve) => {
        reader.onload = () => {
          const base64Image = reader.result as string
          const base64Data = base64Image.split(',')[1]
          formData.append('json', JSON.stringify({
            ...data,
            book_img: base64Data
          }))
          resolve(null)
        }
      })
    } else {
      formData.append('json', JSON.stringify(data))
    }

    return api.post('book.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  deleteBook: (id: number) => {
    const formData = new FormData()
    formData.append('operation', 'deleteBook')
    formData.append('json', JSON.stringify({ id }))
    return api.post('book.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
};

// Events endpoints
export const eventsAPI = {
  getEvents: () => api.get('event.php', { params: { operation: 'getEvents' } }),
  addEvent: async (data: EventData) => {
    const formData = new FormData()
    formData.append('operation', 'addEvent')

    // Convert image to base64 if it exists
    if (data.event_image instanceof File) {
      const reader = new FileReader()
      reader.readAsDataURL(data.event_image)
      await new Promise((resolve) => {
        reader.onload = () => {
          const base64Image = reader.result as string
          const base64Data = base64Image.split(',')[1]
          formData.append('json', JSON.stringify({
            ...data,
            event_image: base64Data
          }))
          resolve(null)
        }
      })
    } else {
      formData.append('json', JSON.stringify(data))
    }

    return api.post('event.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  updateEvent: async (data: EventData) => {
    const formData = new FormData()
    formData.append('operation', 'updateEvent')

    // Convert image to base64 if it exists
    if (data.event_image instanceof File) {
      const reader = new FileReader()
      reader.readAsDataURL(data.event_image)
      await new Promise((resolve) => {
        reader.onload = () => {
          const base64Image = reader.result as string
          const base64Data = base64Image.split(',')[1]
          formData.append('json', JSON.stringify({
            ...data,
            event_image: base64Data
          }))
          resolve(null)
        }
      })
    } else {
      formData.append('json', JSON.stringify(data))
    }

    return api.post('event.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  deleteEvent: (id: number) => {
    const formData = new FormData()
    formData.append('operation', 'deleteEvent')
    formData.append('json', JSON.stringify({ id }))
    return api.post('event.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
};

// Student Assistant endpoints
export const saAPI = {
  getSA: () => api.get('sa.php', { params: { operation: 'getSA' } }),
  addSA: (data: PersonData & { sa_image?: Blob }) => api.post('sa.php', { operation: 'addSA', json: data }),
  updateSA: (data: PersonData & { sa_image?: Blob }) => api.post('sa.php', { operation: 'updateSA', json: data }),
  deleteSA: (id: number) => api.post('sa.php', { operation: 'deleteSA', json: { id } }),
};

// Housekeeper endpoints
export const hkAPI = {
  getHK: () => api.get('hk.php', { params: { operation: 'getHK' } }),
  addHK: (data: PersonData & { hk_image?: Blob }) => api.post('hk.php', { operation: 'addHK', json: data }),
  updateHK: (data: PersonData & { hk_image?: Blob }) => api.post('hk.php', { operation: 'updateHK', json: data }),
  deleteHK: (id: number) => api.post('hk.php', { operation: 'deleteHK', json: { id } }),
};

export default api;
