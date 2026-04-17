const fs = require('fs');

const executeCount = async () => {
    try {
        const fetch = require('node-fetch'); // May not be installed, node 18+ has global fetch
        
        const url = 'https://zvwzpsgqyhysytpjbphc.supabase.co/rest/v1/connections?select=*';
        const key = 'sb_publishable__GmL1S3TDAl1seZSRoGVcA_XLbyNu6y';
        
        const res = await global.fetch(url, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });
        
        const data = await res.json();
        console.log("DB Data:", JSON.stringify(data, null, 2));
    } catch(e) {
        console.log("Fetch Error", e);
    }
}
executeCount();
