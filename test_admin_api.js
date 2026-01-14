const http = require('http');

const postData = JSON.stringify({
    nama: 'Test Company',
    alamat: 'Jl. Test No. 123',
    telepon: '08123456789'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/companies',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
