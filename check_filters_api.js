
async function checkFilters() {
    try {
        const response = await fetch('http://localhost:3004/api/filters/product-types');
        const data = await response.json();
        console.log('Root keys:', Object.keys(data));
        const list = data.product_types || data.productTypes || data;
        if (Array.isArray(list) && list.length > 0) {
            console.log('First item:', list[0]);
        } else {
            console.log('Data:', data);
        }
    } catch (err) {
        console.error(err);
    }
}

checkFilters();
