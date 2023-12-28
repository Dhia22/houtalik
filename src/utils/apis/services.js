import axios from 'axios';
import api from './api';
import { err } from 'react-native-svg/lib/typescript/xml';

let cancelSource;
export const host = "https://api.houtalik.com/api/custom";
//export const host = "https://dev.api.houtalik.com/api/custom";



//hetha lien dev:
//export const Livraison = "http://prod.app.houtalik.com/livraison/params/"

//hetha lien production:
export const Livraison ="http://app.houtalik.com/livraison/params/"

const LOGGABLE = false;

export const IMG_BASE_URL = "https://api.houtalik.com/api/download/stock/img/identifier/";

//export const IMG_BASE_URL = "https://dev.api.houtalik.com/api/download/stock/img/identifier/";


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
    console.log("QrCode:::Data::",result);
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
    console.log("shopID:::",shopId);
    console.log("shopDetailURL::",`https://dev.api.houtalik.com/api/custom/shop/stocks/` + shopId);
    const result = await api.get(`shop/stocks/` + shopId).then((response) => {
      console.log("shopDetail:::::",response.data);
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

export async function shopDetailUsers(shopId) {
  try {
    console.log("shopDetailUsersshopID:::",shopId);
    const result = await api.get(`stocks/` + shopId).then((response) => {
      console.log("shopDetail:::::",response.data);
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
  console.log("shopDetailCard::::",shopId);
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
   console.log("shopAddFish::::url",url,params);

    const result = await axios(optionsAxis).then((response) => {
      console.log("shopAddFish:::Response:::",response);
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
    console.log("shopEditFish::optionsAxis",params);
    const result = await axios(optionsAxis).then((response) => {
      console.log("editFishShopRes:::",response);
      return response;
    }).catch((error) => {
      console.log("error::::shopEditFish",error);
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
    console.log("getDropDownFish:::",token,query);
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
export async function searchFishAndShop(cancelSource,query,topLeftLat,topLeftLon,topRightLat,topRightLon,bottomLeftLat,bottomLeftLon,bottomRightLat,bottomRightLon) {
  try {
    // const url = `${host}/search/` + query;
    const url = `${host}/search/`+ query +`/`+topLeftLat + `/` + topLeftLon+`/`+topRightLat  + `/` + topRightLon +'/'+bottomLeftLat+ '/' +bottomLeftLon+`/`+bottomRightLat  + `/` + bottomRightLon;

    const optionsAxis = {
      method: 'GET',
      url: url,
      headers: getHeaders('')
    };
    console.log("searchFishAndShop:::url::::",url);
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
// export async function fishShops(fishId, order, latitude, longitude) {
//   try {
//     let url = `${host}/shops/fish/` + fishId + `/` + order ;
//     if(latitude != undefined && longitude != undefined){
//       url = `${host}/shops/fish/` + fishId + `/` + order + `/` + latitude + `/` + longitude;
//     }
//     const optionsAxis = {
//       method: 'GET',
//       url: url,
//       headers: getHeaders('')
//     };
//     const result = await axios(optionsAxis).then((response) => {
//       return response.data;
//     }).catch((error) => {
//       return error.response.data;
//     })
//     if (result != null) {
//       return result;
//     }
//   } catch (err) {
//   }
//   return null;
// }


export async function fishShops(fishId, order,topLeftLat,topLeftLon,topRightLat,topRightLon,bottomLeftLat,bottomLeftLon,bottomRightLat,bottomRightLon) {
  try {
    let url = `${host}/shops/fish/` + fishId + `/` + order + `/` + topLeftLat + `/` + topLeftLon + '/' + topRightLat + '/' + topRightLon + '/' + bottomLeftLat + '/' + bottomLeftLon + '/' + bottomRightLat+ '/' + bottomRightLon; 
    ;
    console.log("fishShops1:::",url);
  //   if(latitude != undefined && longitude != undefined){
  //     url = `${host}/shops/fish/` + fishId + `/` + order + `/` + topLeftLat + `/` + topLeftLon + '/' + topRightLat + '/' + topRightLon + '/' + bottomLeftLat + '/' + bottomLeftLon + '/' + bottomRightLat+ '/' + bottomRightLon; 
  //  console.log("fishShops::::::",url);
  //   }
    const optionsAxis = {
      method: 'GET',
      url: url,
      headers: getHeaders('')
    };
    const result = await axios(optionsAxis).then((response) => {
      console.log("response FihShop Api:::",response.data);
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
export async function shopOnMap(cancelSource,topLeftLat,topLeftLon,topRightLat,topRightLon,bottomLeftLat,bottomLeftLon,bottomRightLat,bottomRightLon) {
  try {
//    const url = `${host}/shops/` + latitude + `/` + longitude;
 const url = `${host}/shops/`+ topLeftLat + `/` + topLeftLon+`/`+topRightLat+ `/` + topRightLon +'/'+bottomLeftLat+ '/' +bottomLeftLon+`/`+bottomRightLat  + `/` + bottomRightLon;
  
 console.log('url::::::ShopOnMap',url)
 
 const optionsAxis = {
      method: 'GET',
      url: url,
      headers: getHeaders('')
    };
    console.log("shopOnMap:::url::::",url);
    const result = await axios(optionsAxis, {
      cancelToken: cancelSource.token
    }).then((response) => {
      console.log("shopOnMap:::url::::Response:::::",response.data);
      return response.data;
    }).catch((error) => {
     // console.log("Response: error::::",error);
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
    console.log("fishClassification",url,params);
    console.log("optionsAxis:::",optionsAxis);
    console.log("formData::::",params?._parts)
    const result = await axios(optionsAxis).then((response) => {
      console.log("fishClassification::Response:::",response);
      return response;
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

export async function Countries() {
  try {
    const url = `${host}/countries`;
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

export async function Cities(topLeftLat,topLeftLon,topRightLat,topRightLon,bottomLeftLat,bottomLeftLon,bottomRightLat,bottomRightLon) {
  try {
    const url = `${host}/cities/`+ topLeftLat + `/` + topLeftLon+`/`+topRightLat  + `/` + topRightLon +'/'+bottomLeftLat+ '/' +bottomLeftLon+`/`+bottomRightLat  + `/` + bottomRightLon;
    const optionsAxis = {
      method: 'GET',
      url: url,
      headers: getHeaders('')
    };
    console.log("Cities data URL::::",url);
    const result = await axios(optionsAxis).then((response) => {
      console.log("Cities data::::",response.data);
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


