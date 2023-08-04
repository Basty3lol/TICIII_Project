export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export function validatePhoneNumber(celular){
    const re = /^(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}$/;
    return re.test(String(celular))
};

function clean (rut) {
    return typeof rut === 'string'
      ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase()
      : ''
}

export function validateRut (rut) {
    if (typeof rut !== 'string') {
      return false
    }
  
    // if it starts with 0 we return false
    // so a rut like 00000000-0 will not pass
    if (/^0+/.test(rut)) {
      return false
    }
  
    if (!/^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test(rut)) {
      return false
    }
  
    rut = clean(rut)
  
    let t = parseInt(rut.slice(0, -1), 10)
    let m = 0
    let s = 1
  
    while (t > 0) {
      s = (s + (t % 10) * (9 - (m++ % 6))) % 11
      t = Math.floor(t / 10)
    }
  
    const v = s > 0 ? '' + (s - 1) : 'K'
    return v === rut.slice(-1)
}

export function validateBirth(birth){
  if(birth === null || birth === "Invalid Date"){
    return false
  }
  return true
};