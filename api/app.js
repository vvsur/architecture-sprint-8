import express from 'express';
import { Issuer } from 'openid-client';

const app = express();
const port = 8000;

let keycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080';

const issuerUrl = keycloakUrl + '/realms/reports-realm/.well-known/openid-configuration';
const clientId = 'reports-api';
const clientSecret = 'oNwoLQdvJAvRcL89SydqCWCe5ry1jMgq';

// List of reports
let reports = [
    { id: 1, name: 'Annual Sales' },
    { id: 2, name: 'Monthly Sales' }
];

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}
);

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function validateToken(token) {
    console.log('Accessing URL:', issuerUrl);
    const issuer = await Issuer.discover(issuerUrl);
    const client = new issuer.Client({
        client_id: clientId,
        client_secret: clientSecret
    });

    try {
        const claims = await client.introspect(token);
        console.log('User claims:', claims);
        if (claims.active) {
            // Token is valid

            if (claims.realm_access && claims.realm_access.roles
                && claims.realm_access.roles.indexOf('prothetic_user') >= 0
            ) {
                console.log('Everything is in order');
                return claims;
            } else {
                console.log('Not allowed:', 'requestor does not have "prothetic_user" role');
                return null;    
            }
        } else {
            // Token is not valid
            console.log('No claims or access-token is not confirmed');
            return null;
        }
    } catch (error) {
        // Error during introspection
        console.error('Error validating token:', error);
        return null;
    }
}

// GET list of all reports
app.get('/reports', async (req, res) => {
    await delay(1000); // Simulate delay with report generation
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Headers:', req.headers);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const claims = await validateToken(token);

    if (claims) {
        return res.json(reports);
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

// GET a specific report by ID
app.get('/reports/:id', (req, res) => {
    const report = reports.find(r => r.id === parseInt(req.params.id));
    if (!report) {
        return res.status(404).json({ error: 'Report not found' });
    }
    res.json(user);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});