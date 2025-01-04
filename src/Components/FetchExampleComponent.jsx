import BASE_URL from './config';

const fetchData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/example/`);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetchData();
