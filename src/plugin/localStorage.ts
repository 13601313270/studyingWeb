export default {
  getItem: (key: string): Promise<any> => {
    return new Promise((resolve) => {
      const val = localStorage.getItem(key);
      if (val === null) {
        resolve(null)
      } else {
        resolve(JSON.parse(val))
      }
    })

  },
  setItem: (key: string, value: any): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.setItem(key, JSON.stringify(value));
      resolve()
    })
  }
}