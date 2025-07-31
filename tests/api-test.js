// MeetAI Backend API Test Script (Basitleştirilmiş)
const http = require('http');

async function testHealthCheck() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/health',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.status === 'OK') {
                        console.log('✅ Health Check - BAŞARILI');
                        resolve(true);
                    } else {
                        console.log('❌ Health Check - BAŞARISIZ');
                        resolve(false);
                    }
                } catch (error) {
                    console.log('❌ Health Check - HATA:', error.message);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ Health Check - BAĞLANTI HATASI:', error.message);
            resolve(false);
        });

        req.setTimeout(5000, () => {
            console.log('❌ Health Check - TIMEOUT');
            resolve(false);
        });

        req.end();
    });
}

async function main() {
    console.log('🚀 MeetAI Backend Test Başlatılıyor...\n');
    
    const healthOk = await testHealthCheck();
    
    if (healthOk) {
        console.log('\n🎉 Backend çalışıyor! Demo için hazır.');
    } else {
        console.log('\n⚠️ Backend çalışmıyor. npm start ile başlatın.');
    }
}

// Script çalıştırıldığında
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testHealthCheck };