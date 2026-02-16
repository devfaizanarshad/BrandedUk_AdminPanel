
async function checkTypes() {
    try {
        const response = await fetch('http://localhost:3004/api/products/types');
        const data = await response.json();
        console.log('Root keys:', Object.keys(data));
        if (data.productTypes) {
            console.log('First item keys:', Object.keys(data.productTypes[0]));
            console.log('First item:', data.productTypes[0]);
        } else if (data.items) {
            console.log('First item keys (items):', Object.keys(data.items[0]));
            console.log('First item (items):', data.items[0]);
        } else if (Array.isArray(data)) {
            console.log('First item keys (array):', Object.keys(data[0]));
        }
    } catch (err) {
        console.error(err);
    }
}

checkTypes();
