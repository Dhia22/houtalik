import axios from 'axios';
import api from './api';

let cancelSource;
export const host = "https://api.houtalik.com/api/custom";
const LOGGABLE = false;

export const IMG_BASE_URL = "https://api.houtalik.com/api/download/stock/img/identifier/";

function getHeaders(token) {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Authorization': token
  };
}

// Scan QR Detail
export async function scanQRDetail(translations, loginId) {
  try {
    const result = await api.get(`/shop/` + loginId).then((response) => {
      return response.data;
    }).catch((error) => {
      return {
        "message": translations.invalid_credentials
      }
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;
}

// Shop Detail
export async function shopDetail(shopId) {
  try {
    const result = await api.get(`/stocks/` + shopId).then((response) => {
      return response.data;
    }).catch((error) => {
      return error.response.data;
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;
}

// Shop Detail
export async function shopDetailCard(cancelSource,shopId) {
  try {
    const url = `${host}/stocks/` + shopId;
    const optionsAxis = {
      method: 'GET',
      url: url,
      headers: getHeaders(''),
    };
    const result = await axios(optionsAxis, {
      cancelToken: cancelSource.token
    }).then((response) => {
      return response.data;
    }).catch((error) => {
      return error.response.data;
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;
}

// Deactivate Fish
export async function deactivateFish(fishId) {
  try {
    const result = await api.put(`/deactivate/stock/` + fishId).then((response) => {
      return response.data;
    }).catch((error) => {
      return error.response.data;
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;
}

// Activate Fish
export async function activateFish(fishId) {
  try {
    const result = await api.put(`/activate/stock/` + fishId).then((response) => {
      return response.data;
    }).catch((error) => {
      return error.response.data;
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;
}

// Close Shop
export async function shopClose(shopId) {
  try {
    const result = await api.put(`/close/` + shopId).then((response) => {
      return response.data;
    }).catch((error) => {
      return error.response.data;
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;
}

// Open Shop
export async function shopOpen(shopId) {
  try {
    const result = await api.put(`/open/` + shopId).then((response) => {
      return response.data;
    }).catch((error) => {
      return error.response.data;
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;
}

// Add Fish Api
export async function shopAddFish(params, token) {
  try {
    const url = `${host}/create/stock`;
    const optionsAxis = {
      method: 'POST',
      url: url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': token
      },
      data: params
    };
   
    const result = await axios(optionsAxis).then((response) => {
      return response.data;
    }).catch((error) => {
      return error.response.data;
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;
}

// Edit Fish Api
export async function shopEditFish(params, token) {
  try {
    const url = `${host}/update/stock`;
    const optionsAxis = {
      method: 'POST',
      url: url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': token
      },
      data: params
    };
    const result = await axios(optionsAxis).then((response) => {
      return response.data;
    }).catch((error) => {
      return error.response.data;
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;
}

// Get Dropdown Fish
export async function getDropDownFish(cancelSource,token,query) {
  try {
    const url = `${host}/search/fish/`+query;
    const optionsAxis = {
      method: 'GET',
      url: url,
      headers: getHeaders(token)
    };
    const result = await axios(optionsAxis, {
      cancelToken: cancelSource.token
    }).then((response) => {
      return response.data;
    }).catch((error) => {
      return error.response.data;
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;
}

// Search Fish/Shop
export async function searchFishAndShop(cancelSource,query) {
  try {
    const url = `${host}/search/` + query;
    const optionsAxis = {
      method: 'GET',
      url: url,
      headers: getHeaders('')
    };
    const result = await axios(optionsAxis, {
      cancelToken: cancelSource.token
    }).then((response) => {
      return response.data;
    }).catch((error) => {
      if (axios.isCancel(error)) {
        return null;
      } else {
        return error.response.data;
      }
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;

}

// Shop Fish
export async function fishShops(fishId, order, latitude, longitude) {
  try {
    let url = `${host}/shops/fish/` + fishId + `/` + order ;
    if(latitude != undefined && longitude != undefined){
      url = `${host}/shops/fish/` + fishId + `/` + order + `/` + latitude + `/` + longitude;
    }
    const optionsAxis = {
      method: 'GET',
      url: url,
      headers: getHeaders('')
    };
    const result = await axios(optionsAxis).then((response) => {
      return response.data;
    }).catch((error) => {
      return error.response.data;
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;
}

// Shops on map
export async function shopOnMap(cancelSource,latitude, longitude) {
  try {
    const url = `${host}/shops/` + latitude + `/` + longitude;
    const optionsAxis = {
      method: 'GET',
      url: url,
      headers: getHeaders('')
    };
    const result = await axios(optionsAxis, {
      cancelToken: cancelSource.token
    }).then((response) => {
      return response.data;
    }).catch((error) => {
      return error.response.data;
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;
}

// Fish classfication before add
export async function fishClassification(params, token) {
  try {
    const url = `${host}/classification`;
    const optionsAxis = {
      method: 'POST',
      url: url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': token
      },
      data: params
    };
    const result = await axios(optionsAxis).then((response) => {
      return response.data;
    }).catch((error) => {
      return error.response.data;
    })
    if (result != null) {
      return result;
    }
  } catch (err) {
  }
  return null;
}

