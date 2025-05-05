import axios from "axios";

const url = "https://sms-backend-blue.vercel.app";
// const url = 'http://localhost:8080'

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

///Visiter Data

export const GetVisiter = (setVisitorLogs, setloding) => {
  axios.get(`${url}/security/getallVisitors`).then((res) => {
    console.log(res.data);
    setVisitorLogs(res.data);
    setloding(false);
  });
};

export const PostVisiter = (payload, Fdata, setloding, close) => {
  setloding(true);
  axios.post(`${url}/security/createVisitor`, payload).then((res) => {
    Fdata();
    close();
    setloding(false);
  });
};

//Emergency Alert
// export const GetAlert = (setAlertType) => {
//     axios.get(`${url}/alert/createAlert`).then((res) => {
//         setAlertType(res.data)
//         setlodingData(false)
//     })
// }

export const PostAlert = async (data, callback) => {
  try {
    const response = await axios.post(`${url}/alert/createAlert`, data);
    console.log("Response:", response.data);
    if (callback) callback(response.data);
  } catch (error) {
    if (error.response) {
      console.error("Server Response:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
};

export const Profile_img = (setFormData) => {
  axios.get(`${url}/security/profile`).then((res) => {
    console.log(res.data);
    setFormData(res.data);
  });
};
