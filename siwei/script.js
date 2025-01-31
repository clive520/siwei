const sheetId = '1W4fS595aUkPtRh12eX8ZMe9bHa2M1TYmNb0KpRDQqQE';
const apiKey = 'AIzaSyA5evftJMjUcIS50pZJMQGNUT1FR4v3nOg';
const range = '工作表1!A:D'; // 學期、日期、相簿名稱、相簿網址

async function fetchData() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`);
    const data = await response.json();
    return data.values;
}

function createSemesterSelect(semesters) {
    const select = document.getElementById('semester-select');
    // 移除重複學期並排序
    const uniqueSemesters = [...new Set(semesters)].sort((a, b) => b.localeCompare(a));
    
    uniqueSemesters.forEach(semester => {
        const option = document.createElement('option');
        option.value = semester;
        option.textContent = semester;
        select.appendChild(option);
    });

    // 設定預設選項為最新學期
    select.value = uniqueSemesters[0];
    
    // 添加事件監聽器
    select.addEventListener('change', () => {
        const selectedSemester = select.value;
        const filteredData = allData.filter(row => row[0] === selectedSemester);
        updateLinks(filteredData);
    });

    // 初始顯示最新學期資料
    const initialData = allData.filter(row => row[0] === uniqueSemesters[0]);
    updateLinks(initialData);
}

let allData = []; // 儲存所有資料

function createLinks(data) {
    const linksContainer = document.getElementById('links');
    linksContainer.innerHTML = ''; // 清空現有內容
    data.sort((a, b) => new Date(b[1]) - new Date(a[1])).forEach(row => {
        const [timestamp, date, albumName, albumUrl] = row;
        const img = document.createElement('img');
        img.src = `${albumUrl}/media?format=jpg&size=small&random=${Math.random()}`; // 假設相簿網址可以獲取縮圖
        img.alt = `${date} ${albumName} 縮圖`;
        img.style.width = '50px'; // 設定縮圖寬度
        img.style.marginRight = '10px'; // 縮圖與文字之間的間距

        const link = document.createElement('a');
        link.appendChild(img); // 將縮圖添加到連結中
        link.href = albumUrl;
        link.textContent = `${date} ${albumName}<br>`;
        link.target = '_blank'; // 在新標籤頁中打開
        link.setAttribute('aria-label', `打開相簿: ${albumName}，日期: ${date}`); // 無障礙標籤
        link.setAttribute('title', `${date} ${albumName} (另開新視窗)`); // title屬性
        linksContainer.appendChild(link);
    });
}

function updateLinks(data) {
    createLinks(data);
}

fetchData().then(data => {
    allData = data.slice(1); // 去掉標題行
    const semesters = allData.map(row => row[0]); // 取得所有學期
    createSemesterSelect(semesters);
}).catch(error => {
    console.error('Error fetching data:', error);
});
