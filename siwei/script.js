const sheetId = '1d--_OsiQIkRtYMTXJObTPfwVzUtaDyGTQMs7guPyQkA';
const apiKey = 'AIzaSyA5evftJMjUcIS50pZJMQGNUT1FR4v3nOg';
const range = '表單回應 1!A:D'; // 時間戳記、日期、相簿名稱、相簿網址

async function fetchData() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`);
    const data = await response.json();
    return data.values;
}

function createLinks(data) {
    const linksContainer = document.getElementById('links');
    data.sort((a, b) => new Date(b[1]) - new Date(a[1])).forEach(row => {
        const [timestamp, date, albumName, albumUrl] = row;
        const img = document.createElement('img');
        img.src = `${albumUrl}/media?format=jpg&size=small&random=${Math.random()}`; // 假設相簿網址可以獲取縮圖
        img.alt = `${date} ${albumName} 縮圖`;
        img.style.width = '50px';
        img.style.marginRight = '10px';

        const link = document.createElement('a');
        link.appendChild(img);
        link.href = albumUrl;
        link.textContent = `${date} ${albumName}`;
        link.target = '_blank';
        link.setAttribute('aria-label', `打開相簿: ${albumName}，日期: ${date}`);
        link.setAttribute('title', `${date} ${albumName} (另開新視窗)`);
        linksContainer.appendChild(link);
    });
}

fetchData().then(data => {
    createLinks(data.slice(1)); // 去掉標題行
}).catch(error => {
    console.error('Error fetching data:', error);
});
