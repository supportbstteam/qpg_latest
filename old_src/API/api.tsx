import axios from 'axios';
import {Credential, UserData, changePassword} from './types';
const BASE_API_URL = 'https://bwptestpapers.com/api/';
export const Image_Base_Url = 'https://bwptestpapers.com/public';

const instance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = {
  register: (credentials: UserData) => instance.post('register', credentials),
  login: (Credential: Credential) => instance.post('login', Credential),
  get_user: (token: string, userId: number) =>
    instance.get(`user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  user_update: (userId: number, token: string, updateprofile: FormData) =>
    instance.post(`update/${userId}`, updateprofile, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Add this header
      },
    }),
  change_password: (token: string, Credential: changePassword) =>
    instance.post(`profile/change-password`, Credential, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Add this header
      },
    }),
  logout: (token: string) =>
    instance.get('/logout', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  forget_password: ({
    email,
    link,
    expirationTime,
  }: {
    email: string;
    link: any;
    expirationTime: string;
  }) =>
    instance.get('send-link', {params: {email, link, expire: expirationTime}}),
  reset_password: ({
    email,
    password,
    expire,
  }: {
    email: string;
    password: string;
    expire: string;
  }) => instance.get('reset-password', {params: {email, password, expire}}),

  sendLocation: (token: string | null, data: any) =>
    instance.post('school/add/location', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  //   digital contant
  class: (token: string) =>
    instance.get(`class`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  subject: (token: string, ClassID: number) =>
    instance.get(`subject/${ClassID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  video: (token: string, ClassID: number, subjectID: number) =>
    instance.get(`video/${ClassID}/${subjectID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  book: (token: string, ClassID: number, subjectID: number) =>
    instance.get(`book/${ClassID}/${subjectID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  pdf: (token: string, ClassID: number, subjectID: number) =>
    instance.get(`pdf/${ClassID}/${subjectID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Report route
  user_map_pdate: (token: string, data: any) =>
    instance.post(`user-map-update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

    coordinates: (token: string, data: any) =>
    instance.post(`/user/coordinates`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  user_Report: (token: string, user_Report: any) =>
    instance.post(`school/store`, user_Report, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  get_school: (token: string) =>
    instance.get(`school`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  submit_Report: (token: string, user_Report: FormData) =>
    instance.post(`school/report/store`, user_Report, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }),

  get_Report: (token: string) =>
    instance.get(`school/reports`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  get_price: (token: string, ClassId: number, SubjectId: number) =>
    instance.get(`order/get-price/${ClassId}/${SubjectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  requestSample: (token: string, SampleData: FormData) =>
    instance.post(`user/samples/store`, SampleData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }),

  getSample: (token: string, param?: string) => {
    let url = 'user/samples/all';
    if (param) {
      url += `?${param}`;
    }

    return instance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // store order

  store_order: (token: string, BookData: FormData) =>
    instance.post(`order/store`, BookData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }),

  // get confirm order history data
  getOrderHistory: (token: string) =>
    instance.get(`order`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  Update_School: (id: number, token: string, formData: any) =>
    instance.post(`school/update/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

    get_school_user: (token: string) =>
    instance.get(`school/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

    Approve_reject: (reportId: number, token: string, formData: any) =>
    instance.post(`school/${reportId}/status`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),


    Order_Approve_reject: (OrderId: number, token: string, formData: any) =>
    instance.post(`order/update/${OrderId}/status`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

    updateSampleStatus: (sampleId: number, token: string, formData: any) =>
    instance.post(`user/samples/${sampleId}/status`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    // user/samples/{sampleId}/status
    // get expenses api
    get_expenses: (token: string) =>
    instance.get(`expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

    update_Expenses_data: (id:any, token: string, EditExpenses: FormData) =>
    instance.post(`expenses/${id}/update`, EditExpenses, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Add this header
      },
    }),
    Expenses_Approve_reject: (reportId: number, token: string, formData: any) =>
    instance.post(`expenses/${reportId}/status`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

    delete_expenses: (id:number,token: string) =>
    instance.delete(`expenses/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

    // const get manage team api
    get_teamData: (token: string) =>
    instance.get(`team`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default api;
