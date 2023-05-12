// Fetch data from Notion through Cloudflare Worker
async function fetchNotionData() {
  const endpoint = "https://crimson-shape-242d.zwaydot4972.workers.dev/";
  let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "filter": {
              "property": "Active",
              "checkbox": {
                  "equals": true
              }
          }
      })
  });
  
  if (!response.ok) {
      throw new Error("Notion API error: " + response.status);
  }
  
  let data = await response.json();
  return data.results;
}

// Load brand data when the window is loaded
window.onload = async function() {
  try {
      let brandData = await fetchNotionData();
      // Process the data as needed, e.g., display it on the webpage
  } catch (error) {
      console.error("Failed to fetch brand data: " + error.message);
  }
};
