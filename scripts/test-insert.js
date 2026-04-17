const fs = require('fs');

const executeCount = async () => {
    try {
        const url = 'https://zvwzpsgqyhysytpjbphc.supabase.co/rest/v1/connections';
        const key = 'sb_publishable__GmL1S3TDAl1seZSRoGVcA_XLbyNu6y';
        
        const payload = {
            invite_code: "123456",
            host_id: "00000000-0000-4000-8000-000000000000",
            status: "waiting"
        };

        const res = await global.fetch(url, {
            method: 'POST',
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(payload)
        });
        
        const bodyText = await res.text();
        console.log("Status:", res.status, res.statusText);
        console.log("DB Insert Result:", bodyText);
    } catch(e) {
        console.log("Fetch Error", e);
    }
}
executeCount();
