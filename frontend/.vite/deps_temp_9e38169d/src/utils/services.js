
// export const baseUrl1 = "https://my.srtquiz.fun";



 export const baseUrl1 = "http://localhost:5000";


export const postRequest = async (url, body) => {
  console.log("body", body);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", 
    },
    body,
  });

  const data = await response.json();
  if (!response.ok) {
    let message;
    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    return { error: true, message };
  }
  return data;
};
