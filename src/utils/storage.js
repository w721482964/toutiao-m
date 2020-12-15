// 本地存储封装模块
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  // 为什么把JSON.parse放到try-catch中？
  // 因为data可能不是JSON格式字符串
  try {
    // 尝试把data转为JSON对象
    return JSON.parse(data)
  } catch (err) {
    //   如果不是直接原样返回
    return data
  }
}

export const setItem = (name, value) => {
  // 如果value是对象，就把value转为JSON格式字符串在存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

export const removeItem = name => {
  window.localStorage.remove(name)
}
