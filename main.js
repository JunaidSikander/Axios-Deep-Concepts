const SERVER_URL = `https://jsonplaceholder.typicode.com`;

// Axios Global for All Requests
axios.defaults.headers.common["X-Auth-Token"] =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// GET REQUEST
async function getTodos() {
  console.log("GET Request");

  //   Method 1 to Make GET request
  /* const res = await axios({
      method: "get",
      url: `${SERVER_URL}/todos`,
      params: {
        _limit: 5,
      },
    }); */

  //   Method 2 to Make GET request
  //   const res = await axios.get(`${SERVER_URL}/todos?_limit=5`);

  //   Method 3 to Make GET request
  const res = await axios(`${SERVER_URL}/todos?_limit=5`);

  showOutput(res);
}

// POST REQUEST
async function addTodo() {
  console.log("POST Request");

  //   Method 1 to Make POST request
  /* const res = await axios({
    method: "post",
    url: `${SERVER_URL}/todos`,
    data: {
      title: "New Todo",
      completed: false,
    },
  }); */

  //   Method 2 to Make POST request
  const res = await axios.post(`${SERVER_URL}/todos`, {
    title: "New Todo",
    completed: false,
  });

  showOutput(res);
}

// PUT/PATCH REQUEST
async function updateTodo() {
  console.log("PUT/PATCH Request");

  //   PUT Method
  /* const res = await axios.put(`${SERVER_URL}/todos/1`, {
    title: "Updated Todo",
    completed: true,
  }); */

  //   PATCH Method
  const res = await axios.put(`${SERVER_URL}/todos/1`, {
    title: "Updated Todo",
    completed: true,
  });

  showOutput(res);
}

// DELETE REQUEST
async function removeTodo() {
  console.log("DELETE Request");

  const res = await axios.delete(`${SERVER_URL}/todos/1`);

  showOutput(res);
}

// SIMULTANEOUS DATA
async function getData() {
  console.log("Simultaneous Request");

  //   Method 1:  Array Destructuring Remember the Request Order
  /* const res = await axios.all([
    axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5"),
    axios.get("https://jsonplaceholder.typicode.com/posts?_limit=5"),
  ]);

  const [todos, posts] = res;
   console.log(todos);
  console.log(posts); */

  //   Method 2: Using Axios Spread Function
  axios
    .all([
      axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5"),
      axios.get("https://jsonplaceholder.typicode.com/posts?_limit=5"),
    ])
    .then(
      axios.spread((todos, posts) => {
        console.log(todos);
        console.log(posts);

        showOutput(posts);
      })
    );
}

// CUSTOM HEADERS
async function customHeaders() {
  console.log("Custom Headers");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "sometoken",
    },
  };

  const res = await axios.post(
    `${SERVER_URL}/todos`,
    {
      title: "New Todo",
      completed: false,
    },
    config
  );

  showOutput(res);
}

// TRANSFORMING REQUESTS & RESPONSES
async function transformResponse() {
  console.log("Transform Response");

  const options = {
    method: "POST",
    url: `${SERVER_URL}/todos`,
    data: { title: "Hello World" },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase();
      return data;
    }),
  };

  const res = await axios(options);

  showOutput(res);
}

// ERROR HANDLING
async function errorHandling() {
  console.log("Error Handling");

  try {
    const res = await axios(`${SERVER_URL}/todoss`, {
      //   validateStatus: function (status) {
      //     return status < 500; //Reject only if status is greater ot equal to 500
      //   },
    });

    showOutput(res);
  } catch (error) {
    if (error.response) {
      // Server response with a status other than 200 range
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.header);
    } else if (error.request) {
      // Request is made but no response
      console.error(error.request);
    } else {
      console.error(error.message);
    }
  }
}

// CANCEL TOKEN
function cancelToken() {
  console.log("Cancel Token");

  const source = axios.CancelToken.source();

  axios
    .get(`${SERVER_URL}/todo`, {
      cancelToken: source.token,
    })
    .then((res) => showOutput(res))
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log("Request canceled", thrown.message);
      }
    });
  if (true) {
    source.cancel("Request canceled!");
  }
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(
  (config) => {
    console.log(
      `
    ${config.method.toUpperCase()} 
    request sent to ${config.url}
    at ${new Date()}
    `
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AXIOS INSTANCES
const axiosInstance = axios.create({
  // Other custom Settings
  baseURL: SERVER_URL,
});

// axiosInstance.get("/comments").then((res) => showOutput(res));

// Show output in browser
function showOutput(res) {
  document.getElementById("res").innerHTML = `
    <div class="card card-body mb-4">
      <h5>Status: ${res.status}</h5>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Headers
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.headers, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Data
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.data, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Config
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.config, null, 2)}</pre>
      </div>
    </div>
  `;
}

// Event listeners
document.getElementById("get").addEventListener("click", getTodos);
document.getElementById("post").addEventListener("click", addTodo);
document.getElementById("update").addEventListener("click", updateTodo);
document.getElementById("delete").addEventListener("click", removeTodo);
document.getElementById("sim").addEventListener("click", getData);
document.getElementById("headers").addEventListener("click", customHeaders);
document
  .getElementById("transform")
  .addEventListener("click", transformResponse);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("cancel").addEventListener("click", cancelToken);
