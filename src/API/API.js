import axios from "axios"

const instance = axios.create({
  baseURL: "https://oop-cw-4e86b-default-rtdb.firebaseio.com/",
  withCredentials: false
})

export const database = {
  pull: () => instance.get('library.json').then(r => r.data),
  push: (database) => instance.patch('library.json', database).then(r => r.data),
}
