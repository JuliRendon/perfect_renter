export const post = (url, body, onSuccess, onError, token) => {
  // console.log('Enviado.', token);
  fetch(url, {
    method: 'POST',
    headers: {
      Authorization: token,
    },
    body: body,
  })
    .then((res) => {
      // console.log('Respuesta de api.js/fetch', res);
      return res.json();
    })
    .then((data) => {
      if (data.status !== 'error') {
        onSuccess(data);
      } else {
        // console.log('Data de api.js/fetch', data);
        onError(data);
      }
      return data;
    })
    .catch((e) => '');
};

export const get = (url, onSuccess, onError, token, controller) => {
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: token,
    },
    // signal: controller.signal,
  })
    .then((res) => {
      // console.log('Respuesta de api.js/fetch', res);
      return res.json();
    })
    .then((data) => {
      if (data.status !== 'error') {
        onSuccess(data);
      } else {
        // console.log('Data de api.js/fetch', data);
        onError(data);
      }
      return data;
    })
    .catch((e) => '');
};

export const put = (url, body, onSuccess, onError, token) => {
  // console.log('Enviado.');
  // console.log(token);
  fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: token,
    },
    body: body,
  })
    .then((res) => {
      // console.log('Respuesta de api.js/fetch', res);
      return res.json();
    })
    .then((data) => {
      if (data.status !== 'error') {
        onSuccess(data);
      } else {
        // console.log('Data de api.js/fetch', data);
        onError(data);
      }
      return data;
    })
    .catch((e) => '');
};

export const del = (url, body, onSuccess, onError, token) => {
  fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: token,
    },
  })
    .then((res) => {
      // console.log('Respuesta de api.js/fetch', res);
      return res.json();
    })
    .then((data) => {
      if (data.status !== 'error') {
        onSuccess(data);
      } else {
        // console.log('Data de api.js/fetch', data);
        onError(data);
      }
      return data;
    })
    .catch((e) => console.error(e));
};

export function parseJwt(token) {
  if (!token) {
    return;
  } else if (typeof token !== 'string') {
    return;
  }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export function CreateFormData(body) {
  const formData = new FormData();

  Object.keys(body).map((prop) => formData.append(prop, body[prop]));

  return formData;
}

export function CreateFormDataMultipleFiles(files) {
  const formData = new FormData();
  if (files.length > 0) {
    files.map((file) => formData.append('photo', file));
  }

  return formData;
}

export function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}
